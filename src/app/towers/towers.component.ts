import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Konva from 'konva';

import { User } from '../user';
import { BackendService } from '../backend.service';
import { GameStateService } from '../game-state.service';


@Component({
  selector: 'app-towers',
  templateUrl: './towers.component.html',
  styleUrls: ['./towers.component.css']
})
export class TowersComponent implements OnInit {
  user: User | null = null;
  username: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private backend: BackendService,
    private gameStateService: GameStateService,
  ) { }

  ngOnInit(): void {
    this.getUser();
  }

  getUser(): void {
    this.username = this.route.snapshot.paramMap.get('username');
    if(this.username) {
      this.backend.getUser(this.username).then(user => {
        this.user = user;
      });
      this.gameStateService.changeUser(this.username);
    }
  }
}
