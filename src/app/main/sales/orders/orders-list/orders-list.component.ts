import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Requirement, Order } from 'src/app/core/types';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { DatabaseService } from 'src/app/core/database.service';
import { OrdersListEditDialogComponent } from './orders-list-edit-dialog/orders-list-edit-dialog.component';
import { OrdersListDeleteConfirmComponent } from './orders-list-delete-confirm/orders-list-delete-confirm.component';

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styles: []
})
export class OrdersListComponent implements OnInit, OnDestroy {

  disableTooltips = new FormControl(false);

  filteredOrders: Array<Requirement> = [];

  displayedColumns: string[] = ['correlative', 'document', 'quantity', 'deliveryDate', 'description', 'files', 'status', 'orderedBy', 'actions'];


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

    const order$ =
    this.dbs.currentDataOrders.subscribe(res => {
      if(res) {
        this.filteredOrders = res;
        this.dataSource.data = res;
      }
    });

    this.subscriptions.push(order$);

  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  editOrder(order: Order): void {
    this.dialog.open(OrdersListEditDialogComponent, {
      data: {
        order: order
      }
    });
  }

  deleteOrder(order: Order): void {
    this.dialog.open(OrdersListDeleteConfirmComponent, {
      data: {
        order: order
      }
    })
  }

  previewOrder(order: Order): void {
    //
  }

  printOrder(order: Order): void {
    //
  }

}
