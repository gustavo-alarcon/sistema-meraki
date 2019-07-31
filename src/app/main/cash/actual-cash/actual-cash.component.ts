import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { RawMaterial, TicketProduct, TicketRawMaterial, DepartureProduct, DepartureRawMaterial, Cash } from 'src/app/core/types';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';
import { DatabaseService } from 'src/app/core/database.service';

@Component({
  selector: 'app-actual-cash',
  templateUrl: './actual-cash.component.html',
  styles: []
})
export class ActualCashComponent implements OnInit {

  disableTooltips = new FormControl(false);

  filteredOperations: Array<TicketProduct | TicketRawMaterial | DepartureProduct | DepartureRawMaterial> = [];

  currentCash: Cash;

  displayedColumns: string[] = ['index', 'code', 'name', 'category', 'brand', 'stock', 'unit', 'purchase', 'sale', 'actions'];
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
  }
  filterData(ref): void {
    // 
  }

  seeTotal(): void {
    // 
  }

  addMoney(): void {
    // 
  }

  retriveMoney(): void {
    // 
  }

  openCash(): void {
    // 
  }

}
