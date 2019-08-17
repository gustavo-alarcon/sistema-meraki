import { Component, OnInit, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DatabaseService } from 'src/app/core/database.service';
import { AuthService } from 'src/app/core/auth.service';
import { MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SerialNumber, Store } from 'src/app/core/types';

@Component({
  selector: 'app-stores-change-status-confirm',
  templateUrl: './stores-change-status-confirm.component.html',
  styles: []
})
export class StoresChangeStatusConfirmComponent implements OnInit {

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
    private dialogRef: MatDialogRef<StoresChangeStatusConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {serial: SerialNumber, store: Store }
  ) { }

  ngOnInit() {
    this.status.setValue(this.data.serial.status);
  }

  change(): void {
    if (this.status.value) {
      this.uploading = true;

      this.dbs.storesCollection
        .doc(this.data.store.id)
        .collection('products')
        .doc(this.data.serial.productId)
        .collection('products')
        .doc(this.data.serial.id)
        .update({
          status: this.status.value,
          modifiedBy: this.auth.userInteriores.displayName,
          modifiedByUid: this.auth.userInteriores.uid
        }).then(() => {
          this.uploading = false;
          this.snackbar.open(`${this.data.serial.name} # ${this.data.serial.serie} actualizado!`, 'Cerrar', {
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
