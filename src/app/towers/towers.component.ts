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

  @ViewChild("canvasDiv") canvasDiv!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private backend: BackendService,
  ) { }

  setupKonva() {
    // Basic konva test
    console.log("Width: " + this.canvasDiv.nativeElement.offsetWidth);
    console.log("Height: " + this.canvasDiv.nativeElement.offsetHeight);
    let stage = new Konva.Stage({
      container: "canvasDiv",
      width: this.canvasDiv.nativeElement.offsetWidth,
      height: this.canvasDiv.nativeElement.offsetHeight,
    });
    let layer = new Konva.Layer();
    stage.add(layer);

    let box = new Konva.Rect({
        x: 50,
        y: 50,
        width: 100,
        height: 50,
        fill: '#00D2FF',
        stroke: 'black',
        strokeWidth: 4,
        draggable: true
    });
    layer.add(box);

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
