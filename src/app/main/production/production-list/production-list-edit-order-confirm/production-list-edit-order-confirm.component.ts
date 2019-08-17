import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatabaseService } from 'src/app/core/database.service';
import { MatSnackBar, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ProductionOrder } from 'src/app/core/types';

@Component({
  selector: 'app-production-list-edit-order-confirm',
  templateUrl: './production-list-edit-order-confirm.component.html',
  styles: []
})
export class ProductionListEditOrderConfirmComponent implements OnInit {

  loading = false;

  dataFormGroup: FormGroup;

  constructor(
    public dbs: DatabaseService,
    private snackbar: MatSnackBar,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: ProductionOrder,
    private dialogRef: MatDialogRef<ProductionListEditOrderConfirmComponent>
  ) { }

  ngOnInit() {
    this.createForm();
  }

  createForm(): void {
    this.dataFormGroup = this.fb.group({
      quantity: [this.data.quantity, [Validators.required]]
    });
  }

  save(): void {
    this.loading = true;

    this.dbs.productionOrdersCollection
    .doc(this.data.id)
    .update({quantity: this.dataFormGroup.value['quantity']})
    .then(() => {
      this.snackbar.open(`Orden de producción #${this.data.correlative} editada!`, 'Cerrar', {
        duration: 6000
      });
      this.dialogRef.close(true);
    })
    .catch(err => {
      this.loading = false;
      this.snackbar.open(`Parece que hubo un error editando la orden de producción`, 'Cerrar', {
        duration: 6000
      });
      console.log(err);
    });
  }

}
