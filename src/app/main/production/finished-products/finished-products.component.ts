import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Product } from 'src/app/core/types';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';
import { DatabaseService } from 'src/app/core/database.service';
import { FinishedProductsCreateDialogComponent } from './finished-products-create-dialog/finished-products-create-dialog.component';
import { FinishedProductsShowSerieDialogComponent } from './finished-products-show-serie-dialog/finished-products-show-serie-dialog.component';
import { FinishedProductsDeleteConfirmComponent } from './finished-products-delete-confirm/finished-products-delete-confirm.component';
import { FinishedProductsAddStockDialogComponent } from './finished-products-add-stock-dialog/finished-products-add-stock-dialog.component';
import { FinishedProductsEditDialogComponent } from './finished-products-edit-dialog/finished-products-edit-dialog.component';

@Component({
  selector: 'app-finished-products',
  templateUrl: './finished-products.component.html',
  styles: []
})
export class FinishedProductsComponent implements OnInit, OnDestroy {

  disableTooltips = new FormControl(false);

  filteredFinishedProducts: Array<Product> = [];

  displayedColumns: string[] = ['index', 'code', 'name', 'category', 'colors', 'correlative', 'stock', 'sale', 'actions'];


  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  subscriptions: Array<Subscription> = [];

  constructor(
    public dbs: DatabaseService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort  = this.sort;

    const finishedProduct$ =
    this.dbs.currentDataFinishedProducts.subscribe(res => {
      if(res) {
        this.filteredFinishedProducts = res;
        this.dataSource.data = res;
      }
    });

    this.subscriptions.push(finishedProduct$);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  filterData(ref: string) {
    ref = ref.toLowerCase();
    this.filteredFinishedProducts = this.dbs.finishedProducts.filter(option =>
      option.category.toLowerCase().includes(ref) ||
      option.code.toLowerCase().includes(ref) ||
      option.name.toLowerCase().includes(ref) ||
      option.stock.toString().includes(ref) ||
      option.sale.toString().includes(ref));
    this.dataSource.data = this.filteredFinishedProducts;
  }

  createFinishedProduct(): void {
    this.dialog.open(FinishedProductsCreateDialogComponent);
  }

  editFinishedProduct(product: Product): void {
    this.dialog.open(FinishedProductsEditDialogComponent, {
      data: product
    });
  }

  deleteFinishedProduct(product: Product): void {
    this.dialog.open(FinishedProductsDeleteConfirmComponent, {
      data: product
    })
  }

  showRawMaterialList(product: Product): void {
    // this.dialog.open(RawMaterialAddStockDialogComponent, {
    //   data: {
    //     raw: raw,
    //   }
    // });
  }

  showProducts(product: Product): void {
    this.dialog.open(FinishedProductsShowSerieDialogComponent, {
      data: product
    });
  }

  assignRawMaterialList(product: Product): void {
    // this.dialog.open(RawMaterialAddStockDialogComponent, {
    //   data: {
    //     raw: raw,
    //   }
    // });
  }

  addStock(product: Product): void {
    this.dialog.open(FinishedProductsAddStockDialogComponent, {
      data: {
        product: product
      }
    });
  }

}
