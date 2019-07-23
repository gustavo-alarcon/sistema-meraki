import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { RawMaterialAddStockDialogComponent } from '../../raw-material/raw-material-add-stock-dialog/raw-material-add-stock-dialog.component';
import { Product } from 'src/app/core/types';
import { FinishedProductsAddStockConfirmComponent } from '../finished-products-add-stock-confirm/finished-products-add-stock-confirm.component';

@Component({
  selector: 'app-finished-products-add-stock-dialog',
  templateUrl: './finished-products-add-stock-dialog.component.html',
  styles: []
})
export class FinishedProductsAddStockDialogComponent implements OnInit {

  dataFormGroup: FormGroup;

  constructor(
    private dialog: MatDialog,
    public fb: FormBuilder,
    private dialogRef: MatDialogRef<FinishedProductsAddStockDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {product: Product}
  ) { }

  ngOnInit() {
    this.createForm();
  }

  createForm(): void {
    this.dataFormGroup = this.fb.group({
      OPCorrelative: [null, [Validators.required]],
      quantity: [null, [Validators.required]]
    });
  }

  addStock(): void {
    this.dialog.open(FinishedProductsAddStockConfirmComponent, {
      data: {
        product: this.data.product,
        form: this.dataFormGroup.value
      }
    }).afterClosed().subscribe(res => {
        if(res) {
          this.dialogRef.close(true);
        }
      });
  }

}
