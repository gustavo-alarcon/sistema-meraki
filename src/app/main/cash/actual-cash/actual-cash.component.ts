import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TicketProduct, TicketRawMaterial, DepartureProduct, DepartureRawMaterial, Cash, Transaction } from 'src/app/core/types';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';
import { DatabaseService } from 'src/app/core/database.service';
import { OpenCashDialogComponent } from './open-cash-dialog/open-cash-dialog.component';
import { CloseCashConfirmComponent } from './close-cash-confirm/close-cash-confirm.component';
import { AddMoneyCashDialogComponent } from './add-money-cash-dialog/add-money-cash-dialog.component';
import { map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from 'src/app/core/auth.service';
import { TransactionCancelConfirmComponent } from './transaction-cancel-confirm/transaction-cancel-confirm.component';
import { TransactionRestoreConfirmComponent } from './transaction-restore-confirm/transaction-restore-confirm.component';
import { TransactionApproveConfirmComponent } from './transaction-approve-confirm/transaction-approve-confirm.component';

@Component({
  selector: 'app-actual-cash',
  templateUrl: './actual-cash.component.html',
  styles: []
})
export class ActualCashComponent implements OnInit, OnDestroy {

  disableTooltips = new FormControl(false);

  filteredOperations: Array<TicketProduct | TicketRawMaterial | DepartureProduct | DepartureRawMaterial> = [];
  filteredTransactions: Array<Transaction> = [];

  currentCash: Cash;

  displayedColumns: string[] = ['index', 'regDate', 'type', 'description', 'import', 'user', 'verified', 'paymentType', 'debt', 'actions'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  subscriptions: Array<Subscription> = [];

  constructor(
    public dbs: DatabaseService,
    public auth: AuthService,
    public af: AngularFirestore,
    private dialog: MatDialog,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit() {

    this.dbs.currentDataCurrentCash
      .subscribe(res => {
        if (res.id) {
          const transaction$ =
            this.af.collection(`db/${this.auth.userInteriores.db}/cashList`)
              .doc(res.id)
              .collection('openings')
              .doc(res.currentOpening)
              .collection<Transaction>('transactions')
              .valueChanges()
              .pipe(
                map(res => {
                  res.forEach((element, index) => {
                    element['index'] = index;
                  });
                  return res;
                })
              )
              .subscribe(res => {
                this.filteredTransactions = res;
                this.dataSource.data = this.filteredTransactions;
              });

          this.subscriptions.push(transaction$);
        }
      })



  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  filterData(ref): void {
    // 
  }

  showTotal(): void {
    // 
  }

  addMoney(): void {
    this.dialog.open(AddMoneyCashDialogComponent);
  }

  retriveMoney(): void {
    // 
  }

  openCash(): void {
    this.dialog.open(OpenCashDialogComponent)
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.currentCash = res;
        }

      })
  }

  closeCash(): void {
    this.dialog.open(CloseCashConfirmComponent);
  }

  // CASH ACTIONS

  editOpeningBalance(): void {

  }

  editOpeningDate(): void {

  }

  printCash(): void {

  }

  exportCash(): void {

  }

  // TRANSACTION ACTIONS
  approveTransaction(transaction: Transaction): void {
    this.dialog.open(TransactionApproveConfirmComponent, {
      data: {
        transaction: transaction
      }
    })
  }

  editTransaction(transaction: Transaction): void {
    
  }

  cancelTransaction(transaction: Transaction): void {
    this.dialog.open(TransactionCancelConfirmComponent, {
      data: {
        transaction: transaction
      }
    });
  }

  restoreTransaction(transaction: Transaction): void {
    this.dialog.open(TransactionRestoreConfirmComponent, {
      data: {
        transaction: transaction
      }
    });
  }

}
