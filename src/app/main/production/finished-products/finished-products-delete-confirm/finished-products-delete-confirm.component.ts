import { Component, OnInit, Inject } from '@angular/core';
import { DatabaseService } from 'src/app/core/database.service';
import { AuthService } from 'src/app/core/auth.service';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { RawMaterialDeleteConfirmComponent } from '../../raw-material/raw-material-delete-confirm/raw-material-delete-confirm.component';
import { Product } from 'src/app/core/types';

@Component({
  selector: 'app-finished-products-delete-confirm',
  templateUrl: './finished-products-delete-confirm.component.html',
  styles: []
})
export class FinishedProductsDeleteConfirmComponent implements OnInit {

  uploading: boolean = false;

  flags = {
    deleted: false,
  }

  constructor(
    public dbs: DatabaseService,
    public auth: AuthService,
    private dialogRef: MatDialogRef<RawMaterialDeleteConfirmComponent>,
    private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: Product
  ) { }

  ngOnInit() {
  }

  delete(): void {
    this.uploading = true;

    this.dbs.finishedProductsCollection
      .doc(this.data.id)
      .delete()
      .then(() => {
        this.flags.deleted = true;
        this.uploading = false;
        this.snackbar.open(`${this.data.name} borrado!`, 'Cerrar', {
          duration: 6000
        });
        this.dialogRef.close(true)
      })
  }
}
