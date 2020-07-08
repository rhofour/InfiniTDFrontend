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
export class TowersComponent implements OnInit, AfterViewInit {
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

  renderTowers(cellSize: number) {
    console.log("cellSize: " + cellSize)
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

  calcCellSize(size: { width: number, height: number }) {
    let maxWidth = Math.floor(size.width / this.gameConfig.playfield.width);
    let maxHeight = Math.floor(size.height / this.gameConfig.playfield.height);
    return Math.min(maxWidth, maxHeight);
  }

  renderPlayfield() {
    if (!this.konvaStage) {
      console.warn("renderPlayfield called when konvaStage doesn't exist.");
      return;
    }
    let divSize = {
      width: this.canvasDiv.nativeElement.offsetWidth,
      height: this.canvasDiv.nativeElement.offsetHeight,
    }
    let konvaSize = this.konvaStage.size();
    let resized = false;
    let cellSize = this.calcCellSize(konvaSize);
    let divCellSize = this.calcCellSize(divSize);
    resized = cellSize !== divCellSize;
    if (resized) {
      const newSize = {
        width: divCellSize * this.gameConfig.playfield.width,
        height: divCellSize * this.gameConfig.playfield.height,
      }
      this.konvaStage.size(newSize);
      console.log("Resizing to " + newSize.width + " x " + newSize.height);
      this.renderTowers(divCellSize);
    }
  }

  setupKonva() {
    this.konvaStage = new Konva.Stage({
      container: "canvasDiv",
      width: 0,
      height: 0,
    });
    this.towersLayer = new Konva.Layer();
    this.konvaStage.add(this.towersLayer);
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
    let resizeObserver = new ResizeObserver(entries => {
      this.renderPlayfield();
    });
    this.setupKonva();
    resizeObserver.observe(this.canvasDiv.nativeElement);
  }
}
