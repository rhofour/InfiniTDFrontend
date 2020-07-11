import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { BackendService } from '../backend.service';

interface TopLink {
  label: string,
  link: string,
}

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {
  navLinks: TopLink[]
  accountLink: TopLink;

  constructor(
    public location: Location,
    private backend: BackendService,
  ) {
    this.navLinks = [
      {
        label: 'Leaderboard',
        link: '/leaderboard',
      },
      {
        label: 'Account',
        link: '/account',
      },
    ];
    this.accountLink = this.navLinks[1];
  }

  ngOnInit(): void {
    this.backend.getCurrentUser().subscribe(user => {
      if (user) {
        this.accountLink.label = 'Account';
      } else {
        this.accountLink.label = 'Login';
      }
    });
  }

}
