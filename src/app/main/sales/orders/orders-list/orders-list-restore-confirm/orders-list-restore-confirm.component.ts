import { Component, OnInit, Inject } from '@angular/core';
import { DatabaseService } from 'src/app/core/database.service';
import { AuthService } from 'src/app/core/auth.service';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { Order } from 'src/app/core/types';

@Component({
  selector: 'app-orders-list-restore-confirm',
  templateUrl: './orders-list-restore-confirm.component.html',
  styles: []
})
export class OrdersListRestoreConfirmComponent implements OnInit {

  uploading: boolean = false;

  flags = {
    deleted: false,
  }

  constructor(
    public dbs: DatabaseService,
    public auth: AuthService,
    private dialogRef: MatDialogRef<OrdersListRestoreConfirmComponent>,
    private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { order: Order }
  ) { }

  ngOnInit() {
  }

  restore(): void {
    this.uploading = true;

    this.dbs.ordersCollection
      .doc(this.data.order.id)
      .update({status: 'Enviado'})
        .then(() => {
          this.flags.deleted = true;
          this.uploading = false;
          this.snackbar.open(`Pedido #${this.data.order.correlative} restaurado!`, 'Cerrar', {
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
