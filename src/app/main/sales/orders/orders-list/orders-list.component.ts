import { OrdersListRestoreConfirmComponent } from './orders-list-restore-confirm/orders-list-restore-confirm.component';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Requirement, Order } from 'src/app/core/types';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';
import { DatabaseService } from 'src/app/core/database.service';
import { OrdersListEditDialogComponent } from './orders-list-edit-dialog/orders-list-edit-dialog.component';
import { OrdersListCancelConfirmComponent } from './orders-list-cancel-confirm/orders-list-cancel-confirm.component';

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styles: []
})
export class OrdersListComponent implements OnInit, OnDestroy {

  disableTooltips = new FormControl(false);

  filteredOrders: Array<Requirement> = [];

  displayedColumns: string[] = ['correlative', 'quotation', 'document', 'quantity', 'deliveryDate', 'description', 'files', 'status', 'actions'];


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

  filterData(ref: string): void {
    
  }

  editOrder(order: Order): void {
    this.dialog.open(OrdersListEditDialogComponent, {
      data: {
        order: order
      }
    });
  }

  cancelOrder(order: Order): void {
    if (order.status === 'Enviado') {
      this.dialog.open(OrdersListCancelConfirmComponent, {
        data: {
          order: order
        }
      })
    } else {
      this.snackbar.open('No se pueden anular pedidos APROBADOS o RECHAZADOS', 'Cerrar', {
        duration: 8000
      })
    }
  }

  restoreOrder(order: Order): void {
    if (order.status === 'Anulado') {
      this.dialog.open(OrdersListRestoreConfirmComponent, {
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
