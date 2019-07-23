import { Component, OnInit, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DatabaseService } from 'src/app/core/database.service';
import { AuthService } from 'src/app/core/auth.service';
import { MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SerialNumber } from 'src/app/core/types';

@Component({
  selector: 'app-finished-products-change-color-confirm',
  templateUrl: './finished-products-change-color-confirm.component.html',
  styles: []
})
export class FinishedProductsChangeColorConfirmComponent implements OnInit {

  uploading: boolean = false;
  color = new FormControl();


  constructor(
    public dbs: DatabaseService,
    public auth: AuthService,
    private snackbar: MatSnackBar,
    private dialogRef: MatDialogRef<FinishedProductsChangeColorConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SerialNumber
  ) { }

  ngOnInit() {
    this.color.setValue(this.data.color);
  }

  change(): void {
    if (this.color.value) {
      this.uploading = true;

      this.dbs.finishedProductsCollection
        .doc(this.data.productId)
        .collection('products')
        .doc(this.data.id)
        .update({
          color: this.color.value,
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
