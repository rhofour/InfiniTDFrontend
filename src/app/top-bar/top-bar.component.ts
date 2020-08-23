import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { Observable, EMPTY } from 'rxjs';

import { BackendService } from '../backend.service';
import { User } from '../user';

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
  currentUser$: Observable<User | null> = EMPTY;

  constructor(
    public location: Location,
    private backend: BackendService,
  ) { }

  ngOnInit(): void {
    this.currentUser$ = this.backend.getCurrentUser();
  }

}
