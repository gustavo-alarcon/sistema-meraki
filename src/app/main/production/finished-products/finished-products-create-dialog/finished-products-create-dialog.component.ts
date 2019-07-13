import { Color } from './../../../../core/types';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Category } from 'src/app/core/types';
import { DatabaseService } from 'src/app/core/database.service';
import { MatDialogRef, MatSnackBar, MatDialog } from '@angular/material';
import { startWith, map, tap, debounceTime } from 'rxjs/operators';
import { AuthService } from 'src/app/core/auth.service';
import { FinishedProductsCreateConfirmComponent } from '../finished-products-create-confirm/finished-products-create-confirm.component';

@Component({
  selector: 'app-finished-products-create-dialog',
  templateUrl: './finished-products-create-dialog.component.html',
  styles: []
})
export class FinishedProductsCreateDialogComponent implements OnInit, OnDestroy {

  loading = false;

  dataFormGroup: FormGroup;

  duplicate = {
    name: false,
    nameLoading: false,
    code: false,
    codeLoading: false,
  }

  filteredCategories: Observable<Category[]>
  filteredColors: Observable<Color[]>

  subscriptions: Array<Subscription> = [];

  constructor(
    private fb: FormBuilder,
    public dbs: DatabaseService,
    public auth: AuthService,
    private dialogRef: MatDialogRef<FinishedProductsCreateDialogComponent>,
    private snackbar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.createForm();

    this.filteredCategories = this.dataFormGroup.get('category').valueChanges
      .pipe(
        startWith<any>(''),
        map(value => typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase()),
        map(name => name ? this.dbs.categories.filter(option => option['name'].toLowerCase().includes(name) && option.source === 'product') : this.dbs.categories)
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
            const find = this.dbs.finishedProducts.filter(option => option.name === res);

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
            const find = this.dbs.finishedProducts.filter(option => option.code === res);

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
      code: [null, [Validators.required]],
      name: [null, [Validators.required]],
      correlative: [null, [Validators.required]],
      stock: [null, [Validators.required]],
      category: [null, [Validators.required]],
      description: [null, [Validators.required]],
      sale: [null, [Validators.required]],
    })
  }

  create(): void {
    if (this.dataFormGroup.valid) {
      this.dialog.open(FinishedProductsCreateConfirmComponent, {
        data: {
          form: this.dataFormGroup.value
        }
      }).afterClosed().subscribe(res => {
        if (res) {
          this.dialogRef.close(true);
        }
      })

    }
  }

}
