import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ProductionOrder } from 'src/app/core/types';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';
import { DatabaseService } from 'src/app/core/database.service';

@Component({
  selector: 'app-production-list',
  templateUrl: './production-list.component.html',
  styles: []
})
export class ProductionListComponent implements OnInit, OnDestroy {

  disableTooltips = new FormControl(false);

  filteredProductionOrders: Array<ProductionOrder> = [];

  displayedColumns: string[] = ['correlative', 'corr', 'product', 'document', 'color', 'quantity', 'files', 'description', 'deliveryDate', 'status', 'createdBy', 'actions'];


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

    const raw$ =
    this.dbs.currentDataProductionOrders.subscribe(res => {
      if(res) {
        this.filteredProductionOrders = res;
        this.dataSource.data = res;
      }
    });

    this.subscriptions.push(raw$);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  filterData(ref: string) {
    ref = ref.toLowerCase();
    this.filteredProductionOrders = this.dbs.productionOrders.filter(option =>
      ('OP' + option.correlative).toLowerCase().includes(ref) ||
      ('OR' + option.ORCorrelative).toLowerCase().includes(ref) ||
      ('OPe' + option.OPeCorrelative).toLowerCase().includes(ref) ||
      option.product.name.toLowerCase().includes(ref) ||
      (option.document.name + '' + option.documentCorrelative).toLowerCase().includes(ref) ||
      option.quantity.toString().includes(ref) ||
      option.status.toString().includes(ref) ||
      option.createdBy.toString().includes(ref));
    this.dataSource.data = this.filteredProductionOrders;
  }

  createProductionOrder(): void {

  }

  startProduction(): void {

  }

  cancelProduction(): void {

  }

  finalizeProduction(): void {

  }

  previewProductionOrder(): void {

  }

  printProductionOrder(): void {
    
  }

}
