import { Component, OnInit, ViewChild } from '@angular/core';
import { Purchase } from 'src/app/core/types';
import { FormControl } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';
import { DatabaseService } from 'src/app/core/database.service';
import { AuthService } from 'src/app/core/auth.service';
import { DebtsToPayShowItemsDialogComponent } from './debts-to-pay-show-items-dialog/debts-to-pay-show-items-dialog.component';

@Component({
  selector: 'app-debts-to-pay',
  templateUrl: './debts-to-pay.component.html',
  styles: []
})
export class DebtsToPayComponent implements OnInit {

  disableTooltips = new FormControl(false);

  filteredDebtsToPay: Array<Purchase> = [];

  displayedColumns: string[] = ['index', 'regDate', 'documentDate', 'itemsList', 'documentType', 'documentSerial', 'documentCorrelative', 'provider', 'totalImport', 'subtotalImport', 'igvImport', 'paymentType', 'status', 'paidImport', 'indebtImport', 'detractionImport', 'detractionNumber', 'detractionDate', 'creditDate','createdBy', 'editedBy', 'approvedBy', 'verifiedByAccountant', 'actions'];


  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  subscriptions: Array<Subscription> = [];

  constructor(
    public dbs: DatabaseService,
    public auth: AuthService,
    private dialog: MatDialog,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit() {

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort  = this.sort;

    const debt$ =
    this.dbs.currentDataDebtsToPay.subscribe(res => {
      if(res) {
        this.filteredDebtsToPay = res;
        this.dataSource.data = res;
      }
    });

    this.subscriptions.push(debt$);
  }

  filterData(ref: string): void {
    ref = ref.toLowerCase();
    this.filteredDebtsToPay = this.dbs.purchases.filter(option =>
      option.documentType.toLowerCase().includes(ref) ||
      option.provider.name.toLowerCase().includes(ref) ||
      option.provider.ruc.toString().includes(ref) ||
      option.documentCorrelative.toString().includes(ref) ||
      option.createdBy.toLowerCase().includes(ref) ||
      (option.editedBy ? option.editedBy.toLowerCase().includes(ref) : false) ||
      (option.approvedBy ? option.approvedBy.toLowerCase().includes(ref) : false) ||
      option.status.toLowerCase().includes(ref));
    this.dataSource.data = this.filteredDebtsToPay; 
  }

  showItemsList(list: any): void {
    this.dialog.open(DebtsToPayShowItemsDialogComponent, {
      data: {
        itemsList: list
      }
    });
  }

  payDebt(debt: Purchase): void {
    
  }

}
