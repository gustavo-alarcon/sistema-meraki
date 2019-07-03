import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Requirement, Order } from 'src/app/core/types';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';
import { DatabaseService } from 'src/app/core/database.service';
import { ProdOrdersGenerateOPConfirmComponent } from './prod-orders-generate-op-confirm/prod-orders-generate-op-confirm.component';

@Component({
  selector: 'app-prod-orders',
  templateUrl: './prod-orders.component.html',
  styles: []
})
export class ProdOrdersComponent implements OnInit, OnDestroy {
  
  disableTooltips = new FormControl(false);

  filteredOrders: Array<Requirement> = [];

  displayedColumns: string[] = ['correlative', 'document', 'quantity', 'deliveryDate', 'description', 'files', 'status', 'orderedBy', 'actions'];


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

    const order$ =
      this.dbs.currentDataOrders.subscribe(res => {
        if (res) {
          this.filteredOrders = res;
          this.dataSource.data = res;
        }
      });

    this.subscriptions.push(order$);

  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  generateProductionOrder(order: Order): void {
    if (order.status === 'Anulado') {
      this.dialog.open(ProdOrdersGenerateOPConfirmComponent, {
        data: {
          order: order
        }
      })
    } else {
      this.snackbar.open('No se pueden restaurar pedidos APROBADOS o RECHAZADOS', 'Cerrar', {
        duration: 8000
      });
    }
  }

  previewOrder(order: Order): void {
    //
  }

  printOrder(order: Order): void {
    //
  }

}
