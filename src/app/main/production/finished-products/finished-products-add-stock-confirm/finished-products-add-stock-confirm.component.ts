import { Component, OnInit, Inject } from '@angular/core';
import { DatabaseService } from 'src/app/core/database.service';
import { AuthService } from 'src/app/core/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { Product } from 'src/app/core/types';

@Component({
  selector: 'app-finished-products-add-stock-confirm',
  templateUrl: './finished-products-add-stock-confirm.component.html',
  styles: []
})
export class FinishedProductsAddStockConfirmComponent implements OnInit {

  uploading: boolean = false;

  flags = {
    created: false,
  }

  constructor(
    public dbs: DatabaseService,
    public auth: AuthService,
    private af: AngularFirestore,
    private dialogRef: MatDialogRef<FinishedProductsAddStockConfirmComponent>,
    private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { product: Product, form: { OPCorrelative: number, quantity: number } }
  ) { }

  ngOnInit() {
  }

  save(): void {
    this.uploading = true;

    let transaction =
      this.af.firestore.runTransaction(t => {
        return t.get(this.dbs.finishedProductsCollection.doc<Product>(this.data.product.id).ref)
          .then(doc => {

            const ticketsRef = this.af.firestore.collection(this.dbs.ticketsCollection.ref.path).doc();

            const correlative = doc.data().correlative;
            const newStock = doc.data().stock + this.data.form.quantity;

            const initSerie = correlative + 1;
            const finalSerie = correlative + this.data.form.quantity;

            for (let serie = initSerie; serie <= finalSerie; serie++) {
              const productsRef = this.af.firestore.collection(this.dbs.finishedProductsCollection.doc(this.data.product.id).ref.path + '/products').doc();
              t.set(productsRef, {
                id: productsRef.id,
                serie: serie,
                productId: this.data.product.id,
                name: this.data.product.name,
                code: this.data.product.code,
                status: 'Acabado',
                regDate: Date.now(),
                createdBy: this.auth.userInteriores.displayName,
                createdByUid: this.auth.userInteriores.uid,
                modifiedBy: '',
                modifiedByUid: ''
              });
            }

            t.update(this.dbs.finishedProductsCollection.doc(this.data.product.id).ref, {
              stock: newStock,
              correlative: finalSerie
            });


            t.set(ticketsRef, {
              id: ticketsRef.id,
              OPCorrelative: this.data.form.OPCorrelative,
              product: this.data.product,
              quantity: this.data.form.quantity,
              source: 'finished products',
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
