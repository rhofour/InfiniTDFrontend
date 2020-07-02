import { Component, OnInit } from '@angular/core';
import { ToplevelUser } from '../toplevel-user'
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ToplevelUsersService } from '../toplevel-users.service';


@Component({
  selector: 'app-user-field',
  templateUrl: './user-field.component.html',
  styleUrls: ['./user-field.component.css']
})
export class UserFieldComponent implements OnInit {
  user: ToplevelUser | null = null;

  constructor(
    private route: ActivatedRoute,
    private toplevelUsersService: ToplevelUsersService,
    private location: Location,
  ) { }

  ngOnInit(): void {
    this.getUser();
  }

  getUser(): void {
    const username = this.route.snapshot.paramMap.get('username');
    if(username) {
      this.toplevelUsersService.getUser(username).subscribe(user => this.user = user);
    }
  }

}
