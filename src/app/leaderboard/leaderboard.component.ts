import { Component, OnInit } from '@angular/core';

import { User } from '../user'
import { BackendService } from '../backend.service'

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {
  users: User[] = [];

  constructor(
    private backend: BackendService
  ) { }

  ngOnInit(): void {
    this.backend.getUsers().subscribe(users => {
      this.users = users;
    });
  }

}
