import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminComponent {

  constructor(private _snackBar: MatSnackBar) { }

  todoSnackBar() {
    this._snackBar.open("TODO", "Dismiss", {duration: 1500});
  }
}
