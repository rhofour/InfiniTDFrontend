import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

export interface AreYouSureData<T> {
  msg: string;
  fn: () => T;
}

@Component({
  selector: 'app-are-you-sure-dialog',
  templateUrl: './are-you-sure-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AreYouSureDialogComponent<T> {
  inputText: string = "no";

  constructor(
    public dialogRef: MatDialogRef<AreYouSureDialogComponent<T>>,
    @Inject(MAT_DIALOG_DATA) public data: AreYouSureData<T>) {}

  proceed(): void {
    this.dialogRef.close(this.data.fn());
  }
  close(): void {
    this.dialogRef.close();
  }

}