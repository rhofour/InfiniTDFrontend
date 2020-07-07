import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Konva from 'konva';

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

  @ViewChild("canvasDiv") canvasDiv!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private backend: BackendService,
    private gameConfigService: GameConfigService,
  ) {
    this.gameConfig = gameConfigService.config;
  }

  setupKonva() {
    let width = this.canvasDiv.nativeElement.offsetWidth;
    let height = this.canvasDiv.nativeElement.offsetHeight;
    console.log("Setting up Konva with dimensions: " + width + " x " + height);
    let stage = new Konva.Stage({
      container: "canvasDiv",
      width: width,
      height: height,
    });
    let layer = new Konva.Layer();
    stage.add(layer);

    let maxWidth = Math.floor(width / this.gameConfig.playfield.width);
    let maxHeight = Math.floor(height / this.gameConfig.playfield.height);
    let cellSize = Math.min(maxWidth, maxHeight);

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
        layer.add(box);
      }
    }

    layer.draw();
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
    setTimeout(() => this.setupKonva(), 1000);
  }

}
