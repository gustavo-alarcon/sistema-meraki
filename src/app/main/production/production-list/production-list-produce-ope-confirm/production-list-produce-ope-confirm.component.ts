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

  year: number;
  date: Date;
  name: string;

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
    
    this.date = new Date();
    this.year = this.date.getFullYear();
    this.name = this.year + 'P' + (this.data.orderNote ? this.data.orderNote : '---');

    this.createForm();
    
    this.filteredCategories = this.dataFormGroup.get('category').valueChanges
      .pipe(
        startWith<any>(''),
        map(value => typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase()),
        map(name => name ? this.dbs.categories.filter(option => option['name'].toLowerCase().includes(name) && option.source === 'product') : this.dbs.categories)
      );

  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  createForm(): void {
    this.dataFormGroup = this.fb.group({
      code: [this.name, [Validators.required]],
      name: [this.name, [Validators.required]],
      correlative: 0,
      stock: 0,
      category: [null, [Validators.required]],
      description: null,
      sale: [this.data.indebtImport, [Validators.required]],
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
                product: finalData,
                startedBy: this.auth.userInteriores.displayName,
                startedByUid: this.auth.userInteriores.uid,
                startedDate: Date.now()
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
