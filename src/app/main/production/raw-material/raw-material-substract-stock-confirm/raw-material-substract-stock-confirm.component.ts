import { Component, OnInit, Inject } from '@angular/core';
import { DatabaseService } from 'src/app/core/database.service';
import { AuthService } from 'src/app/core/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { RawMaterialAddStockConfirmComponent } from '../raw-material-add-stock-confirm/raw-material-add-stock-confirm.component';
import { RawMaterial } from 'src/app/core/types';

@Component({
  selector: 'app-raw-material-substract-stock-confirm',
  templateUrl: './raw-material-substract-stock-confirm.component.html',
  styles: []
})
export class RawMaterialSubstractStockConfirmComponent implements OnInit {

  uploading: boolean = false;

  flags = {
    created: false,
  }

  constructor(
    public dbs: DatabaseService,
    public auth: AuthService,
    private af: AngularFirestore,
    private dialogRef: MatDialogRef<RawMaterialAddStockConfirmComponent>,
    private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { raw: RawMaterial, form: { OPCorrelative: number, quantity: number} }
  ) { }

  ngOnInit() {
  }

  save(): void {
    this.uploading = true;

    let transaction =
      this.af.firestore.runTransaction(t => {
        return t.get(this.dbs.rawMaterialsCollection.doc(this.data.raw.id).ref)
          .then(doc => {
            const newStock = doc.data().stock - this.data.form.quantity;
            const departureRef = this.af.firestore.collection(this.dbs.departuresCollection.ref.path).doc()

            t.update(this.dbs.rawMaterialsCollection.doc(this.data.raw.id).ref, {
              stock: newStock
            });
            t.set(departureRef, {
              OPCorrelative: this.data.form.OPCorrelative,
              raw: this.data.raw,
              quantity: this.data.form.quantity,
              source: 'production',
              regDate: Date.now(),
              createdBy: this.auth.userInteriores.displayName,
              createdByUid: this.auth.userInteriores.uid
            });
          });
      }).then(() => {
        this.flags.created = true;
        this.uploading = false;
        this.snackbar.open('Stock actualizado!', 'Cerrar', {
          duration: 6000
        });
        this.dialogRef.close(true)
      })
  }

}
