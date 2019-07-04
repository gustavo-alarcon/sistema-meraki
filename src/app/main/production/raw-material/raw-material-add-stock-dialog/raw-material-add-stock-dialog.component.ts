import { RawMaterialAddStockConfirmComponent } from './../raw-material-add-stock-confirm/raw-material-add-stock-confirm.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';
import { RawMaterial } from 'src/app/core/types';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-raw-material-add-stock-dialog',
  templateUrl: './raw-material-add-stock-dialog.component.html',
  styles: []
})
export class RawMaterialAddStockDialogComponent implements OnInit {

  dataFormGroup: FormGroup;

  constructor(
    private dialog: MatDialog,
    public fb: FormBuilder,
    private dialogRef: MatDialogRef<RawMaterialAddStockDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {raw: RawMaterial}
  ) { }

  ngOnInit() {
    this.createForm();
  }

  createForm(): void {
    this.dataFormGroup = this.fb.group({
      document: [null, [Validators.required]],
      documentCorrelative: [null, [Validators.required]],
      quantity: [null, [Validators.required]],
      totalPrice: [null, [Validators.required]]
    });
  }

  addStock(): void {
    this.dialog.open(RawMaterialAddStockConfirmComponent, {
      data: {
        raw: this.data.raw,
        form: this.dataFormGroup.value
      }
    }).afterClosed().subscribe(res => {
        if(res) {
          this.dialogRef.close(true);
        }
      });
  }

}
