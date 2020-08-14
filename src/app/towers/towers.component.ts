import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Konva from 'konva';

import { User } from '../user';
import { BackendService } from '../backend.service';


@Component({
  selector: 'app-towers',
  templateUrl: './towers.component.html',
  styleUrls: ['./towers.component.css']
})
export class TowersComponent implements OnInit {
  public user: User | null = null;
  username: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private backend: BackendService,
  ) { }

  ngOnInit(): void {
    this.getUser();
  }

  getUser(): void {
    this.username = this.route.snapshot.paramMap.get('username');

    // this.gameStateService.changeUser(this.username);

    if(this.username) {
      this.backend.getUser(this.username).then(user => {
        this.user = user;
      });
    }
  }
}
