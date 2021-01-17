import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { AreYouSureDialogComponent } from '../are-you-sure-dialog/are-you-sure-dialog.component';
import { BackendService } from '../backend.service';
import { LoggedInUser } from '../logged-in-user';

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
    public backend: BackendService,
  ) { }

  todoSnackBar(lUser: LoggedInUser) {
    this._snackBar.open("TODO", "Dismiss", {duration: 1500});
  }

  // Global actions
  resetGameDialog(lUser: LoggedInUser) {
    const dialogRef = this._dialog.open(AreYouSureDialogComponent, {
      data: {
        msg: "This will wipe all game progress on the server.",
        fn: (() => this.backend.resetGameData(lUser)),
      }
    });
    dialogRef.afterClosed().subscribe((result: Promise<Object>) => {
      result.then(
        _ => {
          this._snackBar.open("Game successfully reset.", "Dismiss");
        },
        err => {
          console.warn("Error resetting game.");
          this._snackBar.open(`Error: ${err.message}`, "Dismiss")
        },
      );
    });
  }
}