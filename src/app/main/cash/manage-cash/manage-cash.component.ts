import { Component, OnInit, ViewChild } from '@angular/core';
import { DatabaseService } from 'src/app/core/database.service';
import { FormControl } from '@angular/forms';
import { Cash } from 'src/app/core/types';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { ManageCashCreateDialogComponent } from './manage-cash-create-dialog/manage-cash-create-dialog.component';

@Component({
  selector: 'app-manage-cash',
  templateUrl: './manage-cash.component.html',
  styles: []
})
export class ManageCashComponent implements OnInit {

  disableTooltips = new FormControl(false);

  filteredCashList: Array<Cash> = [];

  displayedColumns: string[] = ['index', 'open', 'currentOwner', 'name', 'location', 'supervisor', 'password', 'lastOpening', 'lastClosure', 'actions'];


  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  subscriptions: Array<Subscription> = [];

  constructor(
    public dbs: DatabaseService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    
    let cash$ =
      this.dbs.currentDataCashList
        .subscribe(res => {
          if (res) {
            this.filteredCashList = res;
            this.dataSource.data = this.filteredCashList;
          }
        })

  }

  filterData(value: string): void {
    let ref = value.toLowerCase();

    this.filteredCashList = this.dbs.cashList.filter(option => 
      (option.open ? 'Abierta':'Cerrada').toLowerCase().includes(ref) ||
      option.currentOwner.displayName.toLowerCase().includes(ref) ||
      option.name.toLowerCase().includes(ref) ||
      option.location.name.toLowerCase().includes(ref) ||
      option.supervisor.displayName.toLowerCase().includes(ref));

    this.dataSource.data = this.filteredCashList;
  }

  createCash(): void {
    this.dialog.open(ManageCashCreateDialogComponent);
  }

  editCash(cash: Cash): void {

  }

  deleteCash(cash: Cash): void {

  }

}
