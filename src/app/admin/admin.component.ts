import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { AreYouSureDialogComponent, AreYouSureData } from '../are-you-sure-dialog/are-you-sure-dialog.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminComponent {

  constructor(
    private _snackBar: MatSnackBar,
    private _dialog: MatDialog,
  ) { }

  todoSnackBar() {
    this._snackBar.open("TODO", "Dismiss", {duration: 1500});
  }

  // Global actions
  resetGameDialog() {
    const dialogRef = this._dialog.open(AreYouSureDialogComponent, {
      data: {
        msg: "This will wipe all game progress on the server.",
        fn: (() => console.log("test")),
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }
}