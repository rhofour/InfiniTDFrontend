import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {
  navLinks: {label: string, link: string,}[]

  constructor(
    private router: Router,
    public location: Location,
  ) {
    this.navLinks = [
      {
        label: "Leaderboard",
        link: "/leaderboard",
      },
      {
        label: "Account",
        link: "/account",
      },
    ];
  }

  ngOnInit(): void {
  }

}
