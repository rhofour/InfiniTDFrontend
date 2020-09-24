import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
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
  styleUrls: ['./top-bar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopBarComponent {

  constructor(
    public location: Location,
    public backend: BackendService,
  ) { }

}
