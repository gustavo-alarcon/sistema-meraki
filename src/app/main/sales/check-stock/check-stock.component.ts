import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Product, SerialNumber } from 'src/app/core/types';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatSnackBar } from '@angular/material';
import { Subscription, Observable } from 'rxjs';
import { DatabaseService } from 'src/app/core/database.service';
import { map } from 'rxjs/operators';
import { CheckStockSellDialogComponent } from './check-stock-sell-dialog/check-stock-sell-dialog.component';
import { CheckStockTransferDialogComponent } from './check-stock-transfer-dialog/check-stock-transfer-dialog.component';
import { AuthService } from 'src/app/core/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';

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

  displayedColumns: string[] = ['index', 'location', 'serie', 'code', 'color', 'sale', 'status', 'actions'];


  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  results: Array<SerialNumber> = [];
  filteredResults: Array<SerialNumber> = [];

  subscriptions: Array<Subscription> = [];

  constructor(
    public dbs: DatabaseService,
    public auth: AuthService,
    private af: AngularFirestore,
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
          map(value => typeof value === 'string' ? value.toLowerCase() : null),
          map(value => value ? this.dbs.finishedProducts.filter(option => {
            if(option.code && option.name){
              return option.code.toLowerCase().includes(value) || option.name.toLowerCase().includes(value);
            }
          }) : this.dbs.finishedProducts)
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
                    if (serial.code === this.product.value['code'] && !(serial.status === 'Vendido')) {
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
              if (serial.code === this.product.value['code'] && !(serial.status === 'Vendido')) {
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

  transferProduct(serial: SerialNumber): void {
    this.dialog.open(CheckStockTransferDialogComponent, {
      data: {
        serial: serial,
        product: this.product.value
      }
    }).afterClosed().subscribe(res => {
      if (res) {
        this.searchProduct()
      }
    });
  }

  sellProduct(serial: SerialNumber): void {
    this.dialog.open(CheckStockSellDialogComponent, {
      data: {
        serial: serial,
        product: this.product.value
      }
    }).afterClosed().subscribe(res => {
      if (res) {
        this.searchProduct()
      }
    });
  }

  takeProduct(serial: SerialNumber): void {
    if (serial.location !== 'Productos acabados') {
      let store = this.dbs.stores.filter(option => option.name === serial.location);
      let serialRef =
        this.dbs.storesCollection
          .doc(store[0].id)
          .collection('products')
          .doc(serial.productId)
          .collection('products')
          .doc(serial.id);

      let transaction =
        this.af.firestore.runTransaction(t => {
          return t.get(serialRef.ref)
            .then(doc => {
              t.update(doc.ref, {
                status: 'Separado',
                takedBy: this.auth.userInteriores.displayName,
                takedByUid: this.auth.userInteriores.uid,
                takedDate: Date.now()
              });
            })
            .then(() => {
              this.snackbar.open(`${serial.name} #${serial.serie} SEPARADO!`, 'Cerrar', {
                duration: 6000
              });
              this.searchProduct();
            })
            .catch(err => {
              this.snackbar.open('Hubo un error separando el producto', 'Cerrar', {
                duration: 6000
              });
              console.log(err);
            })
        }).then(() => {
          this.searchProduct();
        }).catch(err => {
          this.snackbar.open('Transaction fails', 'Cerrar', {
            duration: 6000
          });
          console.log(err);
        })
    } else {
      this.snackbar.open('No puede separar un producto de taller, debe hacer una transferencia primero!', 'Cerrar', {
        duration: 6000
      });
    }

  }

}
