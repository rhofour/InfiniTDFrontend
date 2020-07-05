import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { User } from '../user';
import { BackendService } from '../backend.service';


@Component({
  selector: 'app-user-field',
  templateUrl: './user-field.component.html',
  styleUrls: ['./user-field.component.css']
})
export class UserFieldComponent implements OnInit {
  user: User | null = null;

  constructor(
    private route: ActivatedRoute,
    private backend: BackendService,
  ) { }

  ngOnInit(): void {
    this.getUser();
  }

  getUser(): void {
    const username = this.route.snapshot.paramMap.get('username');
    if(username) {
      this.backend.getUser(username).then(user => this.user = user);
    }
  }

}
