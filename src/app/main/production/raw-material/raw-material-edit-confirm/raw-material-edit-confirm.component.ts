import { Component, OnInit, Inject } from '@angular/core';
import { DatabaseService } from 'src/app/core/database.service';
import { AuthService } from 'src/app/core/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { RequirementFormSaveDialogComponent } from 'src/app/main/sales/requirements/requirements-form/requirement-form-save-dialog/requirement-form-save-dialog.component';
import { RawMaterial } from 'src/app/core/types';

@Component({
  selector: 'app-raw-material-edit-confirm',
  templateUrl: './raw-material-edit-confirm.component.html',
  styles: []
})
export class RawMaterialEditConfirmComponent implements OnInit {

  uploading: boolean = false;

  flags = {
    created: false,
  }

  constructor(
    public dbs: DatabaseService,
    public auth: AuthService,
    private dialogRef: MatDialogRef<RawMaterialEditConfirmComponent>,
    private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
  }

  save(): void {

    this.uploading = true;

    this.checkForNewCategory(this.data['form']['category']);
    this.checkForNewUnit(this.data['form']['unit']);

    this.dbs.rawMaterialsCollection
      .doc(this.data['raw']['id'])
      .update(this.data['form'])
      .then(() => {
        this.uploading = false;
        this.snackbar.open(`${this.data['raw']['name']} editado!`, 'Cerrar', {
          duration: 6000
        });
        this.dialogRef.close(true);
      })
      .catch(err => {
        this.uploading = false;
        this.snackbar.open(`Hubo un error editando ${this.data['raw']['name']}`, 'Cerrar', {
          duration: 6000
        });
        console.log(err);
      })
  }

  checkForNewCategory(category: string): void {
    const ref = typeof category;
    if (ref === 'string') {
      const find = this.dbs.categories.filter(option => option.name === category);

      if (find.length === 0) {
        const data = {
          id: '',
          name: category,
          source: 'raw',
          regDate: Date.now()
        }

        this.dbs.categoriesCollection
          .add(data)
          .then(ref => {
            ref.update({ id: ref.id });
            this.snackbar.open('Nueva categoría agregada!', 'Cerrar', {
              duration: 4000
            });
          })
          .catch(err => {
            this.snackbar.open('Error creando nueva categoría', 'Cerrar', {
              duration: 4000
            });
            console.log(err);
          })
      }
    }

  }

  checkForNewUnit(unit: string): void {
    const ref = typeof unit;
    if (ref === 'string') {
      const find = this.dbs.units.filter(option => option.name === unit);

      if (find.length === 0) {
        const data = {
          id: '',
          name: unit,
          regDate: Date.now()
        }

        this.dbs.unitsCollection
          .add(data)
          .then(ref => {
            ref.update({ id: ref.id });
            this.snackbar.open('Nueva unidad agregada!', 'Cerrar', {
              duration: 4000
            });
          })
          .catch(err => {
            this.snackbar.open('Error creando nueva unidad', 'Cerrar', {
              duration: 4000
            });
            console.log(err);
          })
      }
    }
  }

}
