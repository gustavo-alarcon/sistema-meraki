import { Component, OnInit, Inject } from '@angular/core';
import { DatabaseService } from 'src/app/core/database.service';
import { AuthService } from 'src/app/core/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { Requirement, Order, ProductionOrder } from 'src/app/core/types';

@Component({
  selector: 'app-prod-orders-generate-op-confirm',
  templateUrl: './prod-orders-generate-op-confirm.component.html',
  styles: []
})
export class ProdOrdersGenerateOPConfirmComponent implements OnInit {

  uploading: boolean = false;

  flags = {
    approved: false,
  }

  constructor(
    public dbs: DatabaseService,
    public auth: AuthService,
    private af: AngularFirestore,
    private dialogRef: MatDialogRef<ProdOrdersGenerateOPConfirmComponent>,
    private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { order: Order }
  ) { }

  ngOnInit() {
  }

  approve(): void {
    this.uploading = true;

    this.dbs.ordersCollection
      .doc(this.data.order.id)
      .update({ status: 'Aprobado' })
      .then(() => {
        let transaction =
          this.af.firestore.runTransaction(t => {
            return t.get(this.dbs.productionOrdersCorrelativeDocument.ref)
              .then(doc => {
                const newCorrelative = doc.data().correlative + 1;

                const productionOrderRef = this.dbs.productionOrdersCollection.doc<ProductionOrder>(`OP${newCorrelative}`);

                const data: ProductionOrder = {
                  id: `OP${newCorrelative}`,
                  correlative: newCorrelative,
                  OPeCorrelative: this.data.order.correlative,
                  quotationCorrelative: this.data.order.quotationCorrelative,
                  orderNote: this.data.order.orderNote ? this.data.order.orderNote : 0,
                  document: this.data.order.document,
                  documentSerial: this.data.order.documentSerial,
                  documentCorrelative: this.data.order.documentCorrelative,
                  status: 'Configurando',
                  color: '',
                  quantity: this.data.order.quantity,
                  totalImport: this.data.order.totalImport,
                  paidImport: this.data.order.paidImport,
                  indebtImport: this.data.order.indebtImport,
                  cash: this.data.order.cash,
                  description: this.data.order.description,
                  image1: this.data.order.image1,
                  image2: this.data.order.image2,
                  file1: this.data.order.file1,
                  file2: this.data.order.file2,
                  regDate: Date.now(),
                  deliveryDate: this.data.order.proposedDate ? this.data.order.proposedDate : this.data.order.deliveryDate,
                  createdBy: this.data.order.createdBy,
                  createdByUid: this.data.order.createdByUid,
                  approvedBy: this.auth.userInteriores.displayName,
                  approvedByUid: this.auth.userInteriores.uid,
                  approvedDate: Date.now()
                };

                t.set(productionOrderRef.ref, data);
                t.update(this.dbs.productionOrdersCorrelativeDocument.ref, { correlative: newCorrelative });

                this.snackbar.open(`Orden de Producción #${newCorrelative} creada!`, 'Cerrar', {
                  duration: 6000
                });
              });
          }).then(() => {
            this.flags.approved = true;
            this.uploading = false;
            this.snackbar.open(`Pedido #${this.data.order.correlative} aprobado!`, 'Cerrar', {
              duration: 6000
            });
            this.dialogRef.close(true);
          }).catch(err => {
            this.uploading = false;
            this.snackbar.open(`Transaction fails!`, 'Cerrar', {
              duration: 6000
            });
            console.log(err);
          })
      })
      .catch(err => {
        this.snackbar.open(`Hubo un error actualizando el documento`, 'Cerrar', {
          duration: 6000
        });
        this.uploading = false;
      })
  }

}
