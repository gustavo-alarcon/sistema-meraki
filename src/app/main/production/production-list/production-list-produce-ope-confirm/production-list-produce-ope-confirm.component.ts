import { ProductionOrder, Category, Color } from 'src/app/core/types';
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { DatabaseService } from 'src/app/core/database.service';
import { MatSnackBar, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { startWith, map, tap, debounceTime } from 'rxjs/operators';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/auth.service';

@Component({
  selector: 'app-production-list-produce-ope-confirm',
  templateUrl: './production-list-produce-ope-confirm.component.html',
  styles: []
})
export class ProductionListProduceOpeConfirmComponent implements OnInit, OnDestroy {

  loading = false;

  dataFormGroup: FormGroup;

  duplicate = {
    name: false,
    nameLoading: false,
    code: false,
    codeLoading: false,
  }

  filteredCategories: Observable<Category[]>

  subscriptions: Array<Subscription> = [];

  constructor(
    public dbs: DatabaseService,
    public auth: AuthService,
    private snackbar: MatSnackBar,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: ProductionOrder,
    private dialogRef: MatDialogRef<ProductionListProduceOpeConfirmComponent>
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
      code: ['19P', [Validators.required]],
      name: [null, [Validators.required]],
      correlative: 0,
      stock: 0,
      category: [null, [Validators.required]],
      description: null,
      sale: [null, [Validators.required]],
    })
  }

  save(): void {
    this.loading = true;

    this.checkForNewCategory(this.dataFormGroup.value['category']);

    const data = {
      id: '',
      regDate: Date.now(),
      createdBy: this.auth.userInteriores.displayName,
      createdByUid: this.auth.userInteriores.uid,
      lastUpdateBy: null,
      lastUpdateByUid: null
    };

    const finalData = Object.assign(data, this.dataFormGroup.value);

    this.dbs.finishedProductsCollection
      .add(finalData)
      .then(ref => {
        ref.update({ id: ref.id })
          .then(() => {
            finalData['id'] = ref.id;

            this.dbs.productionOrdersCollection
              .doc(this.data.id)
              .update({
                status: 'Produciendo',
                product: finalData
              })
              .then(() => {
                this.snackbar.open(`Orden de producción #${this.data.correlative} en proceso!`, 'Cerrar', {
                  duration: 6000
                });
                this.dialogRef.close(true);
              })
              .catch(err => {
                this.loading = false;
                this.snackbar.open(`Parece que hubo un error iniciando la producción`, 'Cerrar', {
                  duration: 6000
                });
                console.log(err);
              });

          })

      })
      .catch(err => {
        this.loading = false;
        this.snackbar.open('Hubo un error grabando el documento', 'Cerrar', {
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
          source: 'product',
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

}
