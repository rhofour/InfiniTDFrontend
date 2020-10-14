import { Component, OnInit, ChangeDetectionStrategy, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import Konva from 'konva';

import { BaseLayerRendererComponent } from '../base-layer-renderer/base-layer-renderer.component';
import { BattleState, BattleUpdate, ObjectType, ObjectState } from '../battle-state';
import { GameConfig, TowerConfig, ConfigImageMap } from '../game-config';

@Component({
  selector: 'app-battle-layer-renderer',
  template: ``,
  styleUrls: ['./battle-layer-renderer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BattleLayerRendererComponent extends BaseLayerRendererComponent implements OnInit, OnChanges, OnDestroy {
  private numRows = 0;
  private numCols = 0;
  private objectImgs: Map<number, Konva.Image> = new Map();
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
    this.objectImgs = new Map();
    this.layer.destroyChildren();
  }

  render() {
    this.animationRequestId = undefined;
    const battleUpdate: BattleUpdate | undefined = this.state.getState(Date.now() / 1000);
    if (battleUpdate === undefined) {
      return;
    }

    for (let i = 0; i < battleUpdate.deletedIds.length; i++) {
      const deletedId: number = battleUpdate.deletedIds[i];
      let objectImg = this.objectImgs.get(deletedId);
      if (objectImg) {
        this.objectImgs.delete(deletedId);
        objectImg.destroy();
      } else {
        console.warn(`Attempted to remove ID ${deletedId}, but it wasn't found.`);
      }
    }

    for (let i = 0; i < battleUpdate.objects.length; i++) {
      const objState = battleUpdate.objects[i];
      let objImg = this.objectImgs.get(objState.id);
      if (objImg) {
        objImg.x(objState.pos.col * this.cellSize_);
        objImg.y(objState.pos.row * this.cellSize_);
        objImg.width(this.cellSize_);
        objImg.height(this.cellSize_);
      } else {
        var rawImg;
        if (objState.objType === ObjectType.Monster) {
          rawImg = this.gameConfig.monsters.get(objState.configId)?.img;
        } else if (objState.objType === ObjectType.Projectile) {
          console.warn("Loading projectile images is currently unsupported.");
        }
        if (rawImg === undefined) {
          console.warn("Couldn't find image for object ID: " + objState.id);
          console.warn(objState);
          continue;
        }
        let newObjImg = new Konva.Image({
          x: objState.pos.col * this.cellSize_,
          y: objState.pos.row * this.cellSize_,
          width: this.cellSize_,
          height: this.cellSize_,
          image: rawImg,
        });
        this.objectImgs.set(objState.id, newObjImg);
        this.layer.add(newObjImg);
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