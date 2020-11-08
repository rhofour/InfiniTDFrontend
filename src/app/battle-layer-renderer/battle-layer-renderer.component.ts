import { Component, OnInit, ChangeDetectionStrategy, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import Konva from 'konva';

import { BaseLayerRendererComponent } from '../base-layer-renderer/base-layer-renderer.component';
import { BattleState, BattleUpdate, ObjectType, ObjectState } from '../battle-state';
import { GameConfig, ConfigAndImage, TowerConfig, ConfigImageMap, MonsterConfig, ProjectileConfig } from '../game-config';

@Component({
  selector: 'app-battle-layer-renderer',
  template: ``,
  styleUrls: ['./battle-layer-renderer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BattleLayerRendererComponent extends BaseLayerRendererComponent implements OnInit, OnChanges, OnDestroy {
  private numRows = 0;
  private numCols = 0;
  private objectGroups: Map<number, Konva.Group> = new Map();
  @Input() gameConfig!: GameConfig;
  @Input() state!: BattleState;
  animationRequestId: number | undefined = undefined;

  constructor() { super(); }

  ngOnInit(): void {
    super.ngOnInit();

    if (this.gameConfig === undefined) {
      throw Error("Input gameConfig is undefined.");
    }

    this.numRows = this.gameConfig.playfield.numRows;
    this.numCols = this.gameConfig.playfield.numCols;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.state) {
      this.resetRendering();
      this.render();
    }
  }

  ngOnDestroy() {
    this.resetRendering();
  }

  resetRendering() {
    if (this.animationRequestId) {
      cancelAnimationFrame(this.animationRequestId);
      this.animationRequestId = undefined;
    }
    this.objectGroups = new Map();
    this.layer.destroyChildren();
  }

  getConfig(objState: ObjectState): ConfigAndImage<MonsterConfig | ProjectileConfig> {
    switch (objState.objType) {
      case ObjectType.MONSTER: {
        const monsterConfig = this.gameConfig.monsters.get(objState.configId);
        if (monsterConfig === undefined) {
          throw Error(`Could not find monster: ${objState.configId}`);
        }
        return monsterConfig;
        break;
      }
      case ObjectType.PROJECTILE: {
        const projectileConfig = this.gameConfig.projectiles.get(objState.configId);
        if (projectileConfig === undefined) {
          throw Error(`Could not find projectile: ${objState.configId}`);
        }
        return projectileConfig;
        break;
      }
      default:
        const _exhaustiveCheck: never = objState.objType;
        return _exhaustiveCheck;
    }
  }

  render() {
    this.animationRequestId = undefined;
    const battleUpdate: BattleUpdate | undefined = this.state.getState(
      Date.now() / 1000, this.gameConfig);
    const tileSize = this.gameConfig.playfield.tileSize;
    if (battleUpdate === undefined) {
      return;
    }

    for (let i = 0; i < battleUpdate.deletedIds.length; i++) {
      const deletedId: number = battleUpdate.deletedIds[i];
      let objGroup = this.objectGroups.get(deletedId);
      if (objGroup) {
        this.objectGroups.delete(deletedId);
        objGroup.destroy();
      } else {
        console.warn(`Attempted to remove ID ${deletedId}, but it wasn't found.`);
      }
    }

    for (let i = 0; i < battleUpdate.objects.length; i++) {
      const objState = battleUpdate.objects[i];
      let objGroup = this.objectGroups.get(objState.id);

      // Determine the size of the objects
      const config = this.getConfig(objState);
      const size = config.size / tileSize;
      if (size === undefined || size <= 0.0 || size > 1.0) {
        console.warn(`Got invalid size: ${size}`);
      }

      if (objGroup) {
        objGroup.x(objState.pos.col * this.cellSize_);
        objGroup.y(objState.pos.row * this.cellSize_);
        objGroup.scaleX(this.cellSize_ / tileSize);
        objGroup.scaleY(this.cellSize_ / tileSize);

        // Adjust health.
        if (objState.health !== undefined && objState.maxHealth !== undefined) {
          const innerHealthBar = objGroup.findOne('.innerHealthBar');
          if (innerHealthBar === undefined) {
            throw Error(`Object ${objState.id} has health, but no inner health bar.`);
          }
          innerHealthBar.width(tileSize * 0.9 * (objState.health / objState.maxHealth));
        }
      } else {
        var rawImg = config.img;
        if (rawImg === undefined) {
          console.warn("Couldn't find image for object ID: " + objState.id);
          console.warn(objState);
          continue;
        }
        // Group is normalized based on tileSize.
        let newGroup = new Konva.Group({
          x: objState.pos.col * this.cellSize_,
          y: objState.pos.row * this.cellSize_,
          scaleX: this.cellSize_ / tileSize,
          scaleY: this.cellSize_ / tileSize,
        });

        let newImg = new Konva.Image({
          x: (((1 - size) / 2)) * tileSize,
          y: (((1 - size) / 2)) * tileSize,
          width: tileSize * size,
          height: tileSize * size,
          image: rawImg,
        });
        newGroup.add(newImg);

        if (objState.health !== undefined) {
          if (objState.maxHealth === undefined) {
            throw Error(`Found object ${objState.id} with health, but not maxHealth.`);
          }
          let outerHealthBar = new Konva.Rect({
            x: tileSize * 0.05,
            width: tileSize * 0.9,
            height: tileSize * 0.075,
            name: 'outerHealthBar',
            stroke: 'red',
            strokeWidth: tileSize * 0.013,
          });
          let innerHealthBar = new Konva.Rect({
            x: tileSize * 0.05,
            width: tileSize * 0.9 * (objState.health / objState.maxHealth),
            height: tileSize * 0.075,
            name: 'innerHealthBar',
            fill: 'red',
          });
          newGroup.add(outerHealthBar);
          newGroup.add(innerHealthBar);
        }

        this.objectGroups.set(objState.id, newGroup);
        this.layer.add(newGroup);
      }
    }

    this.layer.batchDraw();
    if (this.animationRequestId === undefined) {
      this.animationRequestId = requestAnimationFrame(() => { this.render(); });
    } else {
      console.warn("Overlapping render calls detected.");
    }
  }
}
