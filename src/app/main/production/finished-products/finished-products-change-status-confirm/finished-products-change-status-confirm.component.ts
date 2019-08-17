import { SerialNumber } from 'src/app/core/types';
import { Component, OnInit, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatSnackBar, MatDialogRef } from '@angular/material';
import { DatabaseService } from 'src/app/core/database.service';
import { AuthService } from 'src/app/core/auth.service';

@Component({
  selector: 'app-finished-products-change-status-confirm',
  templateUrl: './finished-products-change-status-confirm.component.html',
  styles: []
})
export class FinishedProductsChangeStatusConfirmComponent implements OnInit {

  uploading: boolean = false;
  status = new FormControl();

  statusList: Array<string> = [
    'Acabado',
    'Exhibición',
    'Mantenimiento',
    'Separado',
    'Vendido',
    'Garantía',
    'Concesión'
  ]

  constructor(
    public dbs: DatabaseService,
    public auth: AuthService,
    private snackbar: MatSnackBar,
    private dialogRef: MatDialogRef<FinishedProductsChangeStatusConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SerialNumber
  ) { }

  ngOnInit() {
    this.status.setValue(this.data.status);
  }

  change(): void {
    if (this.status.value) {
      this.uploading = true;

      this.dbs.finishedProductsCollection
        .doc(this.data.productId)
        .collection('products')
        .doc(this.data.id)
        .update({
          status: this.status.value,
          modifiedBy: this.auth.userInteriores.displayName,
          modifiedByUid: this.auth.userInteriores.uid
        }).then(() => {
          this.uploading = false;
          this.snackbar.open(`${this.data.name} # ${this.data.serie} actualizado!`, 'Cerrar', {
            duration: 6000
          });
          this.dialogRef.close(true);
        }).catch(err => {
          this.uploading = false;
          this.snackbar.open('Hubo un error actualizando el producto', 'Cerrar', {
            duration: 6000
          });
          console.log(err);
        })
    }
  }

}
