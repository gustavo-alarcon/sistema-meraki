import { Component, OnInit, Inject } from '@angular/core';
import { DatabaseService } from 'src/app/core/database.service';
import { AuthService } from 'src/app/core/auth.service';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { RequirementFormSaveDialogComponent } from 'src/app/main/sales/requirements/requirements-form/requirement-form-save-dialog/requirement-form-save-dialog.component';
import { RawMaterial } from 'src/app/core/types';

@Component({
  selector: 'app-raw-material-delete-confirm',
  templateUrl: './raw-material-delete-confirm.component.html',
  styles: []
})
export class RawMaterialDeleteConfirmComponent implements OnInit {

  uploading: boolean = false;

  flags = {
    deleted: false,
  }

  constructor(
    public dbs: DatabaseService,
    public auth: AuthService,
    private dialogRef: MatDialogRef<RawMaterialDeleteConfirmComponent>,
    private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { raw: RawMaterial }
  ) { }

  ngOnInit() {
  }

  delete(): void {
    this.uploading = true;

    this.dbs.rawMaterialsCollection
      .doc(this.data.raw.id)
      .delete()
      .then(() => {
        this.flags.deleted = true;
        this.uploading = false;
        this.snackbar.open(`${this.data.raw.name} borrado!`, 'Cerrar', {
          duration: 6000
        });
        this.dialogRef.close(true)
      })
  }

}
