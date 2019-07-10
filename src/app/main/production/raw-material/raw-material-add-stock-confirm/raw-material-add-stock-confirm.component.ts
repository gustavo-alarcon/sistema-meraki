import { Component, OnInit, Inject } from '@angular/core';
import { DatabaseService } from 'src/app/core/database.service';
import { AuthService } from 'src/app/core/auth.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { RequirementFormSaveDialogComponent } from 'src/app/main/sales/requirements/requirements-form/requirement-form-save-dialog/requirement-form-save-dialog.component';
import { Subscription } from 'rxjs';
import { RawMaterial } from 'src/app/core/types';

@Component({
  selector: 'app-raw-material-add-stock-confirm',
  templateUrl: './raw-material-add-stock-confirm.component.html',
  styles: []
})
export class RawMaterialAddStockConfirmComponent implements OnInit {

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
    @Inject(MAT_DIALOG_DATA) public data: { raw: RawMaterial, form: { document: string, documentCorrelative: number, quantity: number, totalPrice: number } }
  ) { }

  ngOnInit() {
  }

  save(): void {
    this.uploading = true;

    let transaction =
      this.af.firestore.runTransaction(t => {
        return t.get(this.dbs.rawMaterialsCollection.doc(this.data.raw.id).ref)
          .then(doc => {
            const newStock = doc.data().stock + this.data.form.quantity;
            const purchaseRef = this.af.firestore.collection(this.dbs.ticketsCollection.ref.path).doc()


            t.update(this.dbs.rawMaterialsCollection.doc(this.data.raw.id).ref, {
              stock: newStock,
              purchase: this.data.form.totalPrice / this.data.form.quantity
            });
            t.set(purchaseRef, {
              document: this.data.form.document,
              documentCorrelative: this.data.form.documentCorrelative,
              provider: null,
              raw: this.data.raw,
              quantity: this.data.form.quantity,
              totalPrice: this.data.form.totalPrice,
              unitPrice: this.data.form.totalPrice / this.data.form.quantity,
              source: 'production',
              status: 'Grabado',
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
