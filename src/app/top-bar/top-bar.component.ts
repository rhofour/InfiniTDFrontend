import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Location } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';

import { Observable, EMPTY } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { BackendService } from '../backend.service';
import { User } from '../user';

interface TopLink {
  label: string,
  link: string,
}

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopBarComponent {
  public path$: Observable<string> = EMPTY;
  encodeURIComponent = encodeURIComponent;

  constructor(
    public location: Location,
    public backend: BackendService,
    private router: Router,
  ) {
    this.path$ = this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e: NavigationEnd) => e.urlAfterRedirects)
    );
  }

}
