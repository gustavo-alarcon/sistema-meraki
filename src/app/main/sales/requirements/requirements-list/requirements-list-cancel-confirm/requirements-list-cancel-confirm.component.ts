import { Component, OnInit, Inject } from '@angular/core';
import { DatabaseService } from 'src/app/core/database.service';
import { AuthService } from 'src/app/core/auth.service';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { Requirement } from 'src/app/core/types';

@Component({
  selector: 'app-requirements-list-cancel-confirm',
  templateUrl: './requirements-list-cancel-confirm.component.html',
  styles: []
})
export class RequirementsListCancelConfirmComponent implements OnInit {

  uploading: boolean = false;

  flags = {
    deleted: false,
  }

  constructor(
    public dbs: DatabaseService,
    public auth: AuthService,
    private dialogRef: MatDialogRef<RequirementsListCancelConfirmComponent>,
    private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { req: Requirement }
  ) { }

  ngOnInit() {
  }

  cancel(): void {
    this.uploading = true;

    this.dbs.requirementsCollection
      .doc(this.data.req.id)
      .update({status: 'Anulado'})
        .then(() => {
          this.flags.deleted = true;
          this.uploading = false;
          this.snackbar.open(`Requrimiento #${this.data.req.correlative} anualdo!`, 'Cerrar', {
            duration: 6000
          });
          this.dialogRef.close(true);
        })
        .catch(err => {
          this.snackbar.open(`Hubo un error actualizando el documento`, 'Cerrar', {
            duration: 6000
          });
          this.uploading = false;
        });
  }

}
