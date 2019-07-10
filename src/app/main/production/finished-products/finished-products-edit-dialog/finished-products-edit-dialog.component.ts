import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Category, Color, Product } from 'src/app/core/types';
import { DatabaseService } from 'src/app/core/database.service';
import { AuthService } from 'src/app/core/auth.service';
import { MatDialogRef, MatSnackBar, MatDialog } from '@angular/material';
import { startWith, map, tap, debounceTime } from 'rxjs/operators';
import { FinishedProductsEditConfirmComponent } from '../finished-products-edit-confirm/finished-products-edit-confirm.component';

@Component({
  selector: 'app-finished-products-edit-dialog',
  templateUrl: './finished-products-edit-dialog.component.html',
  styles: []
})
export class FinishedProductsEditDialogComponent implements OnInit, OnDestroy {

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
    private dialogRef: MatDialogRef<FinishedProductsEditDialogComponent>,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: Product
  ) { }

  ngOnInit() {
    this.createForm();

    this.filteredCategories = this.dataFormGroup.get('category').valueChanges
      .pipe(
        startWith<any>(''),
        map(value => typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase()),
        map(name => name ? this.dbs.categories.filter(option => option['name'].toLowerCase().includes(name) && option.source === 'product') : this.dbs.categories)
      );

    this.filteredColors = this.dataFormGroup.get('colors').valueChanges
      .pipe(
        startWith<any>(''),
        map(value => typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase()),
        map(name => name ? this.dbs.colors.filter(option => option['name'].toLowerCase().includes(name)) : this.dbs.colors)
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
      code: [this.data.code, [Validators.required]],
      name: [this.data.name, [Validators.required]],
      category: [this.data.category, [Validators.required]],
      colors: [this.data.colors, [Validators.required]],
      sale: [this.data.sale, [Validators.required]],
    })
  }

  edit(): void {
    if (this.dataFormGroup.valid) {
      this.dialog.open(FinishedProductsEditConfirmComponent, {
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
