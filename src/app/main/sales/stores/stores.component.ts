import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Product, Store, SerialNumber } from 'src/app/core/types';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatSnackBar } from '@angular/material';
import { Subscription, Observable } from 'rxjs';
import { DatabaseService } from 'src/app/core/database.service';
import { startWith, map, tap } from 'rxjs/operators';
import { StoresCreateConfirmComponent } from './stores-create-confirm/stores-create-confirm.component';
import { StoresShowSerialsComponent } from './stores-show-serials/stores-show-serials.component';

@Component({
  selector: 'app-stores',
  templateUrl: './stores.component.html',
  styles: []
})
export class StoresComponent implements OnInit {

  disableTooltips = new FormControl(false);

  store = new FormControl('');

  filteredProducts: Array<Product> = [];
  referenceProducts: Array<Product> = [];
  filteredStores: Observable<Store[]>;

  serialNumbersInTransfering: object = {};
  serialNumbersSold: object = {};

  currentProductList: Array<Product>;
  currentStore: Store;

  displayedColumns: string[] = ['index', 'code', 'name', 'category', 'description', 'correlative', 'stock', 'sale', 'actions'];


  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  subscriptions: Array<Subscription> = [];

  constructor(
    public dbs: DatabaseService,
    private dialog: MatDialog,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.filteredStores = this.store.valueChanges
      .pipe(
        startWith<any>(''),
        map(value => typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase()),
        map(name => name ? this.dbs.stores.filter(option => option['name'].toLowerCase().includes(name)) : this.dbs.stores)
      );

  }

  filterData(ref: string) {
    ref = ref.toLowerCase();
    this.filteredProducts = this.referenceProducts.filter(option =>
      option.category.toLowerCase().includes(ref) ||
      option.code.toLowerCase().includes(ref) ||
      option.name.toLowerCase().includes(ref) ||
      option.stock.toString().includes(ref) ||
      option.sale.toString().includes(ref));
    this.dataSource.data = this.filteredProducts;
  }


  showSelectedStore(store: Store): string | null {
    return store ? store.name : null
  }

  selectedStore(event): void {
    this.currentStore = event.option.value;
    const product$ =
      this.dbs.storesCollection
        .doc<Store>(this.currentStore.id)
        .collection<Product>('products')
        .valueChanges()
        .pipe(
          tap(res => {
            if (res) {
              this.serialNumbersInTransfering = {};
              this.serialNumbersSold = {};
              res.forEach(product => {
                let transferCount = 0;
                let soldCount = 0;
                this.dbs.storesCollection
                  .doc(this.currentStore.id)
                  .collection<Product>('products')
                  .doc(product.id)
                  .collection('products')
                  .get().forEach(snapshots => {
                    snapshots.forEach(serial => {
                      if (serial.data()['status'] === 'Traslado') {
                        transferCount++;
                      }
                      if (serial.data()['status'] === 'Vendido') {
                        soldCount++;
                      }
                    });
                    this.serialNumbersInTransfering[product.id] = transferCount;
                    this.serialNumbersSold[product.id] = soldCount;
                    console.log('TR', transferCount);
                    console.log('SL', soldCount);
                  });
              });
            }
          }),
          map(res => {
            res.forEach((element, index) => {
              element['index'] = index;
            });
            return res;
          })
        )
        .subscribe(res => {
          if (res) {
            this.filteredProducts = res;
            this.referenceProducts = res;
            this.dataSource.data = res;
          }
        });

    this.subscriptions.push(product$);
  }

  createStore(): void {
    this.dialog.open(StoresCreateConfirmComponent)
  }

  showProducts(product: Product): void {
    this.dialog.open(StoresShowSerialsComponent, {
      data: {
        product: product,
        store: this.currentStore
      }
    });
  }

}
