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
    @Inject(MAT_DIALOG_DATA) public data: {raw: RawMaterial, quantity: number}
  ) { }

  ngOnInit() {
  }

  save(): void {
    this.uploading = true;

    let transaction =
      this.af.firestore.runTransaction(t => {
        return t.get(this.dbs.rawMaterialsCollection.doc(this.data.raw.id).ref)
          .then(doc => {
            let newStock = doc.data().stock + this.data.quantity;

            t.update(this.dbs.rawMaterialsCollection.doc(this.data.raw.id).ref, { stock: newStock });
          });
      }).then(() => {
        this.flags.created = true;
        this.uploading = false;
        this.snackbar.open('Stock actualizado!', 'Cerrar', {
          duration:6000
        });
        this.dialogRef.close(true)
      })
  }

}
