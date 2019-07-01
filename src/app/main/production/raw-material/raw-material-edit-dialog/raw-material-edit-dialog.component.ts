import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Category, RawMaterial } from 'src/app/core/types';
import { DatabaseService } from 'src/app/core/database.service';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { RawMaterialCreateDialogComponent } from '../raw-material-create-dialog/raw-material-create-dialog.component';
import { startWith, map, tap, debounceTime } from 'rxjs/operators';
import { RawMaterialEditConfirmComponent } from '../raw-material-edit-confirm/raw-material-edit-confirm.component';

@Component({
  selector: 'app-raw-material-edit-dialog',
  templateUrl: './raw-material-edit-dialog.component.html',
  styles: []
})
export class RawMaterialEditDialogComponent implements OnInit, OnDestroy {

  loading = false;

  dataFormGroup: FormGroup;

  duplicate = {
    name: false,
    nameLoading: false,
    code: false,
    codeLoading: false,
  }

  filteredCategories: Observable<Category[]>
  filteredUnits: Observable<Category[]>

  subscriptions: Array<Subscription> = [];

  constructor(
    private fb: FormBuilder,
    public dbs: DatabaseService,
    private dialogRef: MatDialogRef<RawMaterialCreateDialogComponent>,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: {raw: RawMaterial}
  ) { }

  ngOnInit() {
    this.createForm();

    this.filteredCategories = this.dataFormGroup.get('category').valueChanges
      .pipe(
        startWith<any>(''),
        map(value => typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase()),
        map(name => name ? this.dbs.categories.filter(option => option['name'].toLowerCase().includes(name)) : this.dbs.categories)
      );

    this.filteredUnits = this.dataFormGroup.get('unit').valueChanges
      .pipe(
        startWith<any>(''),
        map(value => typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase()),
        map(name => name ? this.dbs.units.filter(option => option['name'].toLowerCase().includes(name)) : this.dbs.units)
      );

    const name$ =
      this.dataFormGroup.get('name').valueChanges
        .pipe(
          tap(() => {
            this.duplicate.nameLoading = true;
          }),
          debounceTime(500),
          tap(res => {

            this.duplicate.name = false;
            const find = this.dbs.rawMaterials.filter(option => option.name === res);

            if (find.length > 0) {
              this.duplicate.nameLoading = false;
              this.duplicate.name = true;
              this.snackbar.open('Nombre duplicado', 'Cerrar', {
                duration: 4000
              });
            } else {
              this.duplicate.nameLoading = false;
            }
          })
        ).subscribe()

    this.subscriptions.push(name$);

    const code$ =
      this.dataFormGroup.get('code').valueChanges
        .pipe(
          tap(() => {
            this.duplicate.codeLoading = true;
          }),
          debounceTime(500),
          tap(res => {

            this.duplicate.code = false;
            const find = this.dbs.rawMaterials.filter(option => option.code === res);

            if (find.length > 0) {
              this.duplicate.codeLoading = false;
              this.duplicate.code = true;
              this.snackbar.open('Código duplicado', 'Cerrar', {
                duration: 4000
              });
            } else {
              this.duplicate.codeLoading = false;
            }
          })
        ).subscribe()

    this.subscriptions.push(code$);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  createForm(): void {
    this.dataFormGroup = this.fb.group({
      name: [this.data.raw.name, [Validators.required]],
      code: [this.data.raw.code, [Validators.required]],
      category: [this.data.raw.category, [Validators.required]],
      unit: [this.data.raw.unit, [Validators.required]],
      purchase: [this.data.raw.purchase, [Validators.required]],
      sale: [this.data.raw.sale, [Validators.required]],
    })
  }

  edit(): void {
    this.dialog.open(RawMaterialEditConfirmComponent, {
      data: {
        form: this.dataFormGroup.value,
        raw: this.data.raw
      }
    }).afterClosed().subscribe(res => {
      if(res) {
        this.dialogRef.close();
      }
    })
  }

  

}
