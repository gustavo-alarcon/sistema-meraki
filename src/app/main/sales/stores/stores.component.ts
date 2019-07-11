import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Product, Store } from 'src/app/core/types';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatSnackBar } from '@angular/material';
import { Subscription, Observable } from 'rxjs';
import { DatabaseService } from 'src/app/core/database.service';
import { startWith, map } from 'rxjs/operators';
import { StoresCreateConfirmComponent } from './stores-create-confirm/stores-create-confirm.component';

@Component({
  selector: 'app-stores',
  templateUrl: './stores.component.html',
  styles: []
})
export class StoresComponent implements OnInit {

  disableTooltips = new FormControl(false);

  store = new FormControl('');

  filteredProducts: Array<Product> = [];
  filteredStores: Observable<Store[]>;

  currentProductList: Array<Product>;
  currentStore: Store;

  displayedColumns: string[] = ['index', 'code', 'name', 'category', 'colors', 'correlative', 'stock', 'sale', 'actions'];


  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  subscriptions: Array<Subscription> = [];

  constructor(
    public dbs: DatabaseService,
    private dialog: MatDialog,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort  = this.sort;

    this.filteredStores = this.store.valueChanges
      .pipe(
        startWith<any>(''),
        map(value => typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase()),
        map(name => name ? this.dbs.stores.filter(option => option['name'].toLowerCase().includes(name)) : this.dbs.stores)
      );
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
    .subscribe(res => {
      if(res) {
        this.filteredProducts = res;
        this.dataSource.data = res;
      }
    });

    this.subscriptions.push(product$);
  }

  createStore(): void {
    this.dialog.open(StoresCreateConfirmComponent)
  }

}
