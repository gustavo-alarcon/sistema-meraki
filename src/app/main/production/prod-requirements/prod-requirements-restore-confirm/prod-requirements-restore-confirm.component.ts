import { Component, OnInit, Inject } from '@angular/core';
import { DatabaseService } from 'src/app/core/database.service';
import { AuthService } from 'src/app/core/auth.service';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { RequirementsListRestoreConfirmComponent } from 'src/app/main/sales/requirements/requirements-list/requirements-list-restore-confirm/requirements-list-restore-confirm.component';
import { Requirement } from 'src/app/core/types';

@Component({
  selector: 'app-prod-requirements-restore-confirm',
  templateUrl: './prod-requirements-restore-confirm.component.html',
  styles: []
})
export class ProdRequirementsRestoreConfirmComponent implements OnInit {

  uploading: boolean = false;

  flags = {
    deleted: false,
  }

  constructor(
    public dbs: DatabaseService,
    public auth: AuthService,
    private dialogRef: MatDialogRef<ProdRequirementsRestoreConfirmComponent>,
    private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { req: Requirement }
  ) { }

  ngOnInit() {
  }

  restore(): void {
    this.uploading = true;

    this.dbs.requirementsCollection
      .doc(this.data.req.id)
      .update({status: 'Enviado'})
        .then(() => {
          this.flags.deleted = true;
          this.uploading = false;
          this.snackbar.open(`Requrimiento #${this.data.req.correlative} restaurado!`, 'Cerrar', {
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
