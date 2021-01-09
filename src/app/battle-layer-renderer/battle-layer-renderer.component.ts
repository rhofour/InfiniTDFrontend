import { Component, OnInit, ChangeDetectionStrategy, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import Konva from 'konva';

import { BaseLayerRendererComponent } from '../base-layer-renderer/base-layer-renderer.component';
import { BattleState, ObjectType, ObjectState } from '../battle-state';
import { GameConfig, TowerConfig, MonsterConfig } from '../game-config';

export interface LocalObjState {
  group: Konva.Group;
  updated: boolean;
}

export interface RenderConfig {
  size: number;
  img: HTMLImageElement;
}

@Component({
  selector: 'app-battle-layer-renderer',
  template: ``,
  styleUrls: ['./battle-layer-renderer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BattleLayerRendererComponent extends BaseLayerRendererComponent implements OnInit, OnChanges, OnDestroy {
  private numRows = 0;
  private numCols = 0;
  private objectStates: Map<number, LocalObjState> = new Map();
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
    this.objectStates = new Map();
    this.layer.destroyChildren();
  }

  getRenderConfig(objState: ObjectState): RenderConfig  {
    switch (objState.objType) {
      case ObjectType.MONSTER: {
        const monsterConfig = this.gameConfig.monsters.get(objState.configId);
        if (monsterConfig === undefined) {
          throw Error(`Could not find monster ${objState.configId}.`);
        }
        const monsterImg = this.gameConfig.images.monsters.get(objState.configId);
        if (monsterImg === undefined) {
          throw Error(`Could not find image for monster ${objState.configId}.`);
        }
        return {
          size: monsterConfig.size,
          img: monsterImg,
        };
      }
      case ObjectType.PROJECTILE: {
        const towerConfig = this.gameConfig.towers.get(objState.configId);
        if (towerConfig === undefined) {
          throw Error(`Could not find tower ${objState.configId}.`);
        }
        const projectileImg = this.gameConfig.images.projectiles.get(objState.configId);
        if (projectileImg === undefined) {
          throw Error(`Could not find image for projectile associated with tower ${objState.configId}.`);
        }
        return {
          size: towerConfig.projectileSize,
          img: projectileImg,
        };
      }
      default:
        const _exhaustiveCheck: never = objState.objType;
        return _exhaustiveCheck;
    }
  }

  render() {
    this.animationRequestId = undefined;
    const battleUpdate: ObjectState[] | undefined = this.state.getState(
      Date.now() / 1000, this.gameConfig);
    const tileSize = this.gameConfig.playfield.tileSize;
    if (battleUpdate === undefined) {
      return;
    }

    // Mark every existing object as not updated. Any that remain unupdated will be removed at the end.
    this.objectStates.forEach((value, key, map) => value.updated = false);

    for (let i = 0; i < battleUpdate.length; i++) {
      const objState = battleUpdate[i];
      let localObjState = this.objectStates.get(objState.id);

      // Determine the size of the objects
      const config = this.getRenderConfig(objState);
      const size = config.size / tileSize;
      if (size === undefined || size <= 0.0 || size > 1.0) {
        console.warn(`Got invalid size: ${size}`);
      }

      if (localObjState) {
        localObjState.updated = true;
        let group = localObjState.group;
        group.x(objState.pos.col * this.cellSize_);
        group.y(objState.pos.row * this.cellSize_);
        group.scaleX(this.cellSize_ / tileSize);
        group.scaleY(this.cellSize_ / tileSize);

        // Adjust health.
        if (objState.health !== undefined && objState.maxHealth !== undefined) {
          const innerHealthBar = group.findOne('.innerHealthBar');
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

        this.objectStates.set(objState.id, {
          updated: true,
          group: newGroup,
        });
        this.layer.add(newGroup);
      }
    }

    // Delete any local objects not mentioned in the update.
    this.objectStates.forEach((value, key, map) => {
      if (!value.updated) {
        value.group.destroy();
        map.delete(key);
      }
    });

    this.layer.batchDraw();
    if (this.animationRequestId === undefined) {
      this.animationRequestId = requestAnimationFrame(() => { this.render(); });
    } else {
      console.warn("Overlapping render calls detected.");
    }
  }
}
