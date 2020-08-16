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
  public errorMsg: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private backend: BackendService,
  ) { }

  ngOnInit(): void {
    this.getUser();
  }

  private setError(errorMsg: string): void {
    this.errorMsg = errorMsg;
    console.warn(errorMsg);
  }

  getUser(): void {
    const username = this.route.snapshot.paramMap.get('username');

    if(username) {
      this.backend.getUser(username)
        .then(user => {
          this.user = user;
          if (user === null) {
            this.setError('Could not find user ' + username + '.');
          }
        });
    } else {
      this.setError('No username provided.');
    }
  }
}
