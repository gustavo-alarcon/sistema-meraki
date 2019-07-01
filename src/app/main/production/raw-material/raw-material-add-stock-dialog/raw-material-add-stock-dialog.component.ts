import { RawMaterialAddStockConfirmComponent } from './../raw-material-add-stock-confirm/raw-material-add-stock-confirm.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';
import { RawMaterial } from 'src/app/core/types';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-raw-material-add-stock-dialog',
  templateUrl: './raw-material-add-stock-dialog.component.html',
  styles: []
})
export class RawMaterialAddStockDialogComponent implements OnInit {

  quantity = new FormControl(null);

  constructor(
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<RawMaterialAddStockDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {raw: RawMaterial}
  ) { }

  ngOnInit() {
  }

  addStock(): void {
    this.dialog.open(RawMaterialAddStockConfirmComponent, {
      data: {
        raw: this.data.raw,
        quantity: this.quantity.value
      }
    })
      .afterClosed().subscribe(res => {
        if(res) {
          this.dialogRef.close(true);
        }
      })
  }

}
