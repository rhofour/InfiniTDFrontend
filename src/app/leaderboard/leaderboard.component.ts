import { Component, OnInit } from '@angular/core';
import { ToplevelUser } from '../toplevel-user';
import { ToplevelUsersService } from '../toplevel-users.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {
  users_data: ToplevelUser[] = [];

  constructor(
    private toplevelUsersService: ToplevelUsersService
  ) { }

  getUsers(): void {
    this.toplevelUsersService.getUsers().subscribe(users => this.users_data = users);
  }

  ngOnInit(): void {
    this.getUsers();
  }

}
