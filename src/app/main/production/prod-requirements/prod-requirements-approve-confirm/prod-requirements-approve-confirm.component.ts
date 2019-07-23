import { AngularFirestore } from '@angular/fire/firestore';
import { Component, OnInit, Inject } from '@angular/core';
import { DatabaseService } from 'src/app/core/database.service';
import { AuthService } from 'src/app/core/auth.service';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { RequirementsListRestoreConfirmComponent } from 'src/app/main/sales/requirements/requirements-list/requirements-list-restore-confirm/requirements-list-restore-confirm.component';
import { Requirement, ProductionOrder } from 'src/app/core/types';
import { database } from 'firebase';

@Component({
  selector: 'app-prod-requirements-approve-confirm',
  templateUrl: './prod-requirements-approve-confirm.component.html',
  styles: []
})
export class ProdRequirementsApproveConfirmComponent implements OnInit {

  uploading: boolean = false;

  flags = {
    approved: false,
  }

  constructor(
    public dbs: DatabaseService,
    public auth: AuthService,
    private af: AngularFirestore,
    private dialogRef: MatDialogRef<ProdRequirementsApproveConfirmComponent>,
    private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { req: Requirement }
  ) { }

  ngOnInit() {
  }

  approve(): void {
    this.uploading = true;

    this.dbs.requirementsCollection
      .doc(this.data.req.id)
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
                  ORCorrelative: this.data.req.correlative,
                  status: 'Configurando',
                  product: this.data.req.product,
                  color: [this.data.req.color],
                  quantity: this.data.req.quantity,
                  description: this.data.req.description,
                  image1: this.data.req.image1,
                  image2: this.data.req.image2,
                  file1: this.data.req.file1,
                  file2: this.data.req.file2,
                  regDate: Date.now(),
                  createdBy: this.data.req.createdBy,
                  createdByUid: this.data.req.createdByUid,
                  approvedBy: this.auth.userInteriores.displayName,
                  approvedByUid: this.auth.userInteriores.uid
                };

                t.set(productionOrderRef.ref, data);
                t.update(this.dbs.productionOrdersCorrelativeDocument.ref, { correlative: newCorrelative });

                this.snackbar.open(`Orden de Producción #${newCorrelative} creada!`, 'Cerrar', {
                  duration: 6000
                });
              });
          });

        this.flags.approved = true;
        this.uploading = false;
        this.snackbar.open(`Requerimiento #${this.data.req.correlative} aprobado!`, 'Cerrar', {
          duration: 6000
        });
        this.dialogRef.close(true);
      })
      .catch(err => {
        this.snackbar.open(`Hubo un error actualizando el documento`, 'Cerrar', {
          duration: 6000
        });
        this.uploading = false;
      })
  }

}
