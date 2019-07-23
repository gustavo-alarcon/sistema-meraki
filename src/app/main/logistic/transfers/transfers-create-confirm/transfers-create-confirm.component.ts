import { AngularFirestore } from '@angular/fire/firestore';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { DatabaseService } from 'src/app/core/database.service';
import { AuthService } from 'src/app/core/auth.service';
import { MatSnackBar, MatDialogRef } from '@angular/material';
import { SerialNumber, Transfer, Store, TransferList } from 'src/app/core/types';

@Component({
  selector: 'app-transfers-create-confirm',
  templateUrl: './transfers-create-confirm.component.html',
  styles: []
})
export class TransfersCreateConfirmComponent implements OnInit {

  uploading: boolean = false;

  flags = {
    created: false
  }
  constructor(
    private af: AngularFirestore,
    public dbs: DatabaseService,
    public auth: AuthService,
    private snackbar: MatSnackBar,
    private dialogRef: MatDialogRef<TransfersCreateConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      form: {
        origin: Store;
        destination: Store;
      },
      transferLists: Array<TransferList>,
      tableList: Array<SerialNumber>
    }
  ) { }

  ngOnInit() {
  }

  transfer(): void {
    if (this.data) {
      this.uploading = true;

      let transaction =
        this.af.firestore.runTransaction(t => {
          return t.get(this.dbs.transferCorrelativeDocument.ref)
            .then(doc => {

              const newCorrelative = doc.data().correlative + 1;
              const transferRef = this.dbs.transfersCollection.doc<Transfer>(`TR${newCorrelative}`);

              this.data.tableList.forEach(serial => {
                if (this.data.form.origin.name === "Productos acabados") {
                  this.dbs.finishedProductsCollection
                    .doc(serial.productId)
                    .collection('products')
                    .doc(serial.id)
                    .update({ status: 'Traslado' })
                    .catch(err => {
                      console.log(err);
                    });
                } else {
                  this.dbs.storesCollection
                    .doc(this.data.form.origin.id)
                    .collection('products')
                    .doc(serial.productId)
                    .collection('products')
                    .doc(serial.id)
                    .update({ status: 'Traslado' })
                    .catch(err => {
                      console.log(err);
                    });
                }
              })

              // this.data.producList.forEach(element => {

              //   if (this.data.form['origin']['name'] === "Productos acabados") {
              //     const productDestinationRef =
              //       this.dbs.finishedProductsCollection
              //         .doc(this.data.form['product']['id'])
              //         .collection('products')
              //         .doc(element.id).ref;
              //     t.set(productDestinationRef, element);
              //   } else {
              //     const productDestinationRef =
              //       this.dbs.storesCollection
              //         .doc(this.data.form['destination']['id'])
              //         .collection('products')
              //         .doc(this.data.form['product']['id'])
              //         .collection('products')
              //         .doc(element.id).ref;
              //     t.set(productDestinationRef, element);
              //   }

              //   if (this.data.form['origin']['name'] === "Productos acabados") {
              //     const productOriginRef =
              //       this.dbs.finishedProductsCollection
              //         .doc(this.data.form['product']['id'])
              //         .collection('products')
              //         .doc(element.id).ref;
              //     t.delete(productOriginRef);
              //   } else {
              //     const productOriginRef =
              //       this.dbs.storesCollection
              //         .doc(this.data.form['origin']['id'])
              //         .collection('products')
              //         .doc(this.data.form['product']['id'])
              //         .collection('products')
              //         .doc(element.id).ref;
              //     t.delete(productOriginRef);
              //   }

              // });

              // update transfer correlative
              t.update(this.dbs.transferCorrelativeDocument.ref,
                { correlative: newCorrelative });

              // setting new transfer operation
              t.set(transferRef.ref, {
                id: `TR${newCorrelative}`,
                correlative: newCorrelative,
                origin: this.data.form.origin,
                destination: this.data.form.destination,
                serialList: this.data.tableList,
                transferList: this.data.transferLists,
                status: 'Aprobado',
                source: 'logistic',
                regDate: Date.now(),
                createdBy: this.auth.userInteriores.displayName,
                createdByUid: this.auth.userInteriores.uid,
                approvedBy: this.auth.userInteriores.displayName,
                approvedByUid: this.auth.userInteriores.uid,
                approvedDate: Date.now(),
                canceledBy: null,
                canceldByUid: null,
                canceledDate: null,
                carriedBy: null,
                carriedByUid: null,
                carriedDate: null,
              });

            });
        }).then(() => {
          this.flags.created = true;
          this.uploading = false;
          this.snackbar.open('Traslado creado!', 'Cerrar', {
            duration: 6000
          });
          this.dialogRef.close(true)
        }).catch(err => {
          console.log('Transaction failure:', err);
        });
    }

  }
}