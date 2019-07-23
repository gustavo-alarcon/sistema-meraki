import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Product, SerialNumber } from 'src/app/core/types';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatSnackBar } from '@angular/material';
import { Subscription, Observable } from 'rxjs';
import { DatabaseService } from 'src/app/core/database.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-check-stock',
  templateUrl: './check-stock.component.html',
  styles: []
})
export class CheckStockComponent implements OnInit {

  searching: boolean = false;

  disableTooltips = new FormControl(false);
  product = new FormControl();

  filteredProducts: Observable<Product[]>;

  displayedColumns: string[] = ['index', 'location', 'serie', 'code', 'color', 'status', 'actions'];


  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  results: Array<SerialNumber> = [];
  filteredResults: Array<SerialNumber> = [];

  subscriptions: Array<Subscription> = [];

  constructor(
    public dbs: DatabaseService,
    private dialog: MatDialog,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit() {
    this.dataSource.data = this.filteredResults;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.filteredProducts =
      this.product.valueChanges
        .pipe(
          map(value => typeof value === 'string' ? value : value.code),
          map(code => code ? this.dbs.finishedProducts.filter(option => option.code.includes(code)) : this.dbs.finishedProducts)
        )
  }

  filterData(ref: string) {
    ref = ref.toLowerCase();
    this.filteredResults = this.results.filter(option =>
      option.color.toLowerCase().includes(ref) ||
      option.status.toLowerCase().includes(ref));
    this.dataSource.data = this.filteredResults;
  }

  searchProduct() {
    this.results = [];
    this.searching = true;
    if (typeof this.product.value === 'object') {
      this.dbs.currentDataStores.subscribe(stores => {
        stores.forEach(store => {
          let sub =
            this.dbs.storesCollection
              .doc(store.id)
              .collection('products')
              .doc(this.product.value['id'])
              .collection<SerialNumber>('products')
              .valueChanges()
              .subscribe(res => {
                if (res) {
                  res.forEach(serial => {
                    if (serial.code === this.product.value['code'] && !(serial.status === 'Vendido' || serial.status === 'Mantenimiento')) {
                      this.results.push(serial);
                      this.dataSource.data = this.results;
                    }
                  })
                }
              });
        })
      })

      this.dbs.finishedProductsCollection
        .doc(this.product.value['id'])
        .collection<SerialNumber>('products')
        .valueChanges()
        .subscribe(res => {
          if (res) {
            res.forEach(serial => {
              if (serial.code === this.product.value['code'] && !(serial.status === 'Vendido' || serial.status === 'Mantenimiento')) {
                this.results.push(serial);
                this.dataSource.data = this.results;
              }
            })
          }
        })
      this.searching = false;
    }
  }

  showProduct(product: Product): string | null {
    return product ? (product.code + ' | ' + product.name) : null
  }

  selectedProduct(event): void {
    this.searchProduct();
  }

  transferProduct(product: Product): void {

  }

  sellProduct(product: Product): void {

  }

  takeProduct(product: Product): void {

  }

}
