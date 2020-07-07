import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Konva from 'konva';
import { ResizedEvent } from 'angular-resize-event';

import { User } from '../user';
import { BackendService } from '../backend.service';
import { GameConfig } from '../game-config';
import { GameConfigService } from '../game-config.service';


@Component({
  selector: 'app-towers',
  templateUrl: './towers.component.html',
  styleUrls: ['./towers.component.css']
})
export class TowersComponent implements OnInit {
  user: User | null = null;
  username: string | null = null;
  gameConfig: GameConfig;
  konvaStage: Konva.Stage | null = null;
  towersLayer!: Konva.Layer;

  @ViewChild("canvasDiv") canvasDiv!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private backend: BackendService,
    private gameConfigService: GameConfigService,
  ) {
    this.gameConfig = gameConfigService.config;
  }

  onResize(event: ResizedEvent) {
    console.log(event);
    this.renderPlayfield();
  }

  renderTowers(cellSize: number) {
    this.towersLayer.destroyChildren();
    for (let row = 0; row < this.gameConfig.playfield.height; row++) {
      for (let col = 0; col < this.gameConfig.playfield.width; col++) {
        let i = col + row * (this.gameConfig.playfield.width + 1);
        let box = new Konva.Rect({
            x: col * cellSize,
            y: row * cellSize,
            width: cellSize,
            height: cellSize,
            fill: i % 2 == 1 ? 'black' : 'white',
            stroke: 'red',
            strokeWidth: 2,
        });
        this.towersLayer.add(box);
      }
    }

    this.towersLayer.draw();
  }

  renderPlayfield() {
    if (!this.konvaStage) {
      return;
    }
    let divSize = {
      width: this.canvasDiv.nativeElement.offsetWidth,
      height: this.canvasDiv.nativeElement.offsetHeight,
    }
    let konvaSize = this.konvaStage.size();
    let resized = false;
    if (divSize.width !== konvaSize.width && divSize.height !== konvaSize.height) {
      resized = true;
      console.log("Resizing konva from " + konvaSize.width + " x " + konvaSize.height +
        " to " + divSize.width + " x " + divSize.height);
      this.konvaStage.size(divSize);
    }

    konvaSize = this.konvaStage.size();
    let maxWidth = Math.floor(konvaSize.width / this.gameConfig.playfield.width);
    let maxHeight = Math.floor(konvaSize.height / this.gameConfig.playfield.height);
    let cellSize = Math.min(maxWidth, maxHeight);

    if (resized) {
      this.renderTowers(cellSize);
      return;
    } 

    this.towersLayer.draw();
  }

  setupKonva() {
    let width = this.canvasDiv.nativeElement.offsetWidth;
    let height = this.canvasDiv.nativeElement.offsetHeight;
    this.konvaStage = new Konva.Stage({
      container: "canvasDiv",
      width: 0,
      height: 0,
    });
    this.towersLayer = new Konva.Layer();
    this.konvaStage.add(this.towersLayer);

    this.renderPlayfield();
  }

  ngOnInit(): void {
    this.getUser();
  }

  getUser(): void {
    this.username = this.route.snapshot.paramMap.get('username');
    if(this.username) {
      this.backend.getUser(this.username).then(user => {
        this.user = user;
      });
    }
  }

  ngAfterViewInit() {
    // TODO(rofer): Figure out why this timeout is needed and replace it with
    // responsive code.
    this.setupKonva();
    setTimeout(() => this.renderPlayfield(), 250);
  }

}
