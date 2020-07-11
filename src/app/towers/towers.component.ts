import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Konva from 'konva';

import { User } from '../user';
import { BackendService } from '../backend.service';
import { GameConfig } from '../game-config';
import { GameConfigService } from '../game-config.service';
import { GameState, TowerState } from '../game-state';


@Component({
  selector: 'app-towers',
  templateUrl: './towers.component.html',
  styleUrls: ['./towers.component.css']
})
export class TowersComponent implements OnInit {
  user: User | null = null;
  username: string | null = null;
  gameConfig: GameConfig;
  gameState: GameState;

  constructor(
    private route: ActivatedRoute,
    private backend: BackendService,
    private gameConfigService: GameConfigService,
  ) {
    this.gameConfig = gameConfigService.config;

    const towerState1: TowerState = {
      id: 1,
    }
    const towerState2: TowerState = {
      id: 2,
    }

    this.gameState = {
      towers: {
        towers: [],
      },
    };
    for (var row = 0; row < this.gameConfig.playfield.numRows; row++) {
      this.gameState.towers.towers[row] = [];
      for (var col = 0; col < this.gameConfig.playfield.numCols; col++) {
        this.gameState.towers.towers[row][col] = (row % 3 == 0 ? towerState1 : towerState2);
      }
    }
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
}
