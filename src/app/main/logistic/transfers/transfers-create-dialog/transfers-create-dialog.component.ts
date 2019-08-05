import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { DatabaseService } from 'src/app/core/database.service';
import { Observable, Subscription, of } from 'rxjs';
import { Store, Product, SerialNumber, TransferList } from 'src/app/core/types';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { startWith, map, tap } from 'rxjs/operators';
import { MatSnackBar, MatTableDataSource, MatPaginator, MatSort, MatDialog, MatDialogRef } from '@angular/material';
import { TransfersCreateConfirmComponent } from '../transfers-create-confirm/transfers-create-confirm.component';
import { isObjectValidator } from 'src/app/core/is-object-validator';

@Component({
  selector: 'app-transfers-create-dialog',
  templateUrl: './transfers-create-dialog.component.html',
  styles: []
})
export class TransfersCreateDialogComponent implements OnInit, OnDestroy {

  dataFormGroup: FormGroup;

  displayedColumns: string[] = ['serie', 'name', 'color', 'status', 'actions'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  filteredOriginStores: Observable<Store[]>;
  filteredDestinationStores: Observable<Store[]>;

  productsColection: AngularFirestoreCollection<Product>;
  products: Array<Product> = [];
  serialNumbersCollection: AngularFirestoreCollection<SerialNumber>;
  serialNumbers: Array<SerialNumber> = [];

  filteredProducts: Observable<Product[]>;
  filteredSerialNumbers: Observable<SerialNumber[]>;

  transferLists: Array<TransferList> = [];
  tableList: Array<SerialNumber> = [];

  selectedSerials: Array<boolean[]> = [];
  currentSerialIndex: number = -1;
  selectedProducts: Array<Product> = [];

  subscriptions: Array<Subscription> = [];

  constructor(
    public dbs: DatabaseService,
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<TransfersCreateDialogComponent>
  ) { }

  ngOnInit() {
    this.createForm();

    this.filteredOriginStores =
      this.dataFormGroup.get('origin').valueChanges
        .pipe(
          startWith<any>(''),
          map(value => typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase()),
          map(name => name ? this.dbs.stores.filter(option => option['name'].toLowerCase().includes(name)) : this.dbs.stores)
        );

    this.filteredDestinationStores =
      this.dataFormGroup.get('destination').valueChanges
        .pipe(
          startWith<any>(''),
          tap(res => {
            if (typeof res === 'object') {
              if (res.name === this.dataFormGroup.value['origin'].name) {
                this.dataFormGroup.get('destination').setValue('');
                this.snackbar.open('No puede seleccionar el mismo origen y destino', 'Cerrar', {
                  duration: 6000
                })
              }
            }
          }),
          map(value => typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase()),
          map(name => name ? this.dbs.stores.filter(option => option['name'].toLowerCase().includes(name)) : this.dbs.stores)
        );

    this.filteredProducts =
      this.dataFormGroup.get('product').valueChanges
        .pipe(
          startWith<any>(''),
          map(value => typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase()),
          map(name => name ? this.products.filter(option => option['name'].toLowerCase().includes(name) || option['code'].toLowerCase().includes(name)) : this.products)
        );

    this.filteredSerialNumbers =
      this.dataFormGroup.get('serialNumber').valueChanges
        .pipe(
          startWith<any>(''),
          map(value => typeof value === 'string' ? value.toLowerCase() : value.serie.toString()),
          map(name => {
            if (name) {
              return this.serialNumbers.filter(option => option.serie.toString().includes(name))
            } else {
              return this.serialNumbers
            }
          })
        );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  createForm(): void {
    this.dataFormGroup = this.fb.group({
      origin: [null, [Validators.required]],
      destination: [null, [Validators.required]],
      product: [null, [Validators.required, isObjectValidator]],
      serialNumber: null
    })
  }

  showStore(store: Store): string | null {
    return store ? store.name : null;
  }

  selectedOrigin(event): void {
    if (event) {
      if (event.option.value.name === "Productos acabados") {
        this.productsColection = this.dbs.finishedProductsCollection;
      } else {
        const storeId = event.option.value.id;

        this.productsColection =
          this.dbs.storesCollection
            .doc(storeId)
            .collection<Product>('products');
      }

      const product$ =
        this.productsColection
          .valueChanges()
          .subscribe(res => {
            if (res) {
              this.products = res;
              this.dataFormGroup.get('product').setValue('');
              this.dataFormGroup.get('serialNumber').setValue('');
            }
          });

      this.subscriptions.push(product$);
    }
  }

  showProduct(store: Store): string | null {
    return store ? store.name : null;
  }

  selectedProduct(event): void {
    if (event) {
      const productId = event.option.value.id;
      this.serialNumbersCollection =
        this.productsColection
          .doc(productId)
          .collection<SerialNumber>('products', ref => ref.orderBy('serie', 'asc'));

      const serialNumber$ =
        this.serialNumbersCollection
          .valueChanges()
          .pipe(
            tap(res => {
              const index = this.selectedProducts.indexOf(event.option.value);
              if (index === -1) {
                this.selectedProducts.push(event.option.value);
                let _serials = [];
                res.forEach(element => {
                  _serials.push(false);
                });
                this.selectedSerials.push(_serials);
                this.currentSerialIndex = this.selectedSerials.length - 1;
                this.transferLists.push({
                  product: event.option.value,
                  serialList: []
                })
              } else {
                this.currentSerialIndex = index;
              }
            }),
            map(res => {
              res.forEach((element, index) => {
                element.index = index;
              });
              return res;
            })
          )
          .subscribe(res => {
            if (res) {
              this.serialNumbers = res;
              this.dataFormGroup.get('serialNumber').setValue('');
            }
          });

      this.subscriptions.push(serialNumber$);
    }
  }

  showSerialNumber(serial: SerialNumber): number | null {
    return serial ? serial.serie : null;
  }

  selectedSerialNumber(event): void {
    if (event) {
      // read serial number selected
      const serialNumber = event.option.value;

      // mark serial number as selected in handler array
      const index1 = this.serialNumbers.indexOf(serialNumber);
      this.selectedSerials[this.currentSerialIndex][index1] = true;

      // search for actual product to insert serial number in transferList
      const index2 = this.transferLists.map(e => { return e.product.code; }).indexOf(this.dataFormGroup.value['product']['code']);
      this.transferLists[index2].serialList.push(serialNumber);

      // push the new serial number in tableList and update the dataSource
      this.tableList.push(serialNumber);
      this.dataSource.data = this.tableList;

      // clean input serialNumber
      this.dataFormGroup.get('serialNumber').setValue('');
    }
  }

  addSerial(event): void {
    const number = event.target.value;
    const serial = this.serialNumbers.filter(option => option.serie.toString() === number);

    if (serial.length) {
      // mark serial number as selected in handler array
      const index1 = this.serialNumbers.indexOf(serial[0]);
      this.selectedSerials[this.currentSerialIndex][index1] = true;

      // search for actual product to insert serial number in transferList
      const index2 = this.transferLists.map(e => { return e.product.code; }).indexOf(this.dataFormGroup.value['product']['code']);
      this.transferLists[index2].serialList.push(serial[0]);

      // push the new serial number in tableList and update the dataSource
      this.tableList.push(serial[0]);
      this.dataSource.data = this.tableList;

      // clean input serialNumber
      this.dataFormGroup.get('serialNumber').setValue('');
    } else {
      this.snackbar.open('No existe ese número de serie', 'Cerrar', {
        duration: 6000
      })
    }

  }

  removeProduct(index: number, serial: SerialNumber): void {
    // searching for product in transferList
    const index2 = this.transferLists.map(e => { return e.product.code; }).indexOf(serial.code);
    // searching for serial inside product
    const index3 = this.transferLists[index2].serialList.indexOf(serial);
    // removing serial number
    this.transferLists[index2].serialList.splice(index3, 1);

    this.tableList.splice(index, 1);
    this.selectedSerials[index2][serial.index] = false;
    this.dataSource.data = this.tableList;
  }

  transfer(): void {
    if (this.dataFormGroup.valid && this.tableList.length) {
      this.dialog.open(TransfersCreateConfirmComponent, {
        data: {
          form: { origin: this.dataFormGroup.value['origin'], destination: this.dataFormGroup.value['destination'] },
          transferLists: this.transferLists,
          tableList: this.tableList
        }
      }).afterClosed().subscribe(res => {
        if (res) {
          this.dialogRef.close(true);
        }
      })
    }
  }

}
