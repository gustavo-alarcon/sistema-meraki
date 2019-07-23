import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Quotation } from 'src/app/core/types';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';
import { DatabaseService } from 'src/app/core/database.service';
import { ProdQuotationsEditDialogComponent } from './prod-quotations-edit-dialog/prod-quotations-edit-dialog.component';
import { AuthService } from 'src/app/core/auth.service';

@Component({
  selector: 'app-prod-quotations',
  templateUrl: './prod-quotations.component.html',
  styles: []
})
export class ProdQuotationsComponent implements OnInit, OnDestroy {

  disableTooltips = new FormControl(false);

  filteredQuotations: Array<Quotation> = [];

  displayedColumns: string[] = ['correlative', 'description', 'deliveryDate', 'quantity', 'files', 'status', 'createdBy', 'actions'];


  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  subscriptions: Array<Subscription> = [];

  constructor(
    public dbs: DatabaseService,
    public auth: AuthService,
    private dialog: MatDialog,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    const raw$ =
      this.dbs.currentDataQuotations.subscribe(res => {
        if (res) {
          this.filteredQuotations = res;
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
    this.filteredQuotations = this.dbs.quotations.filter(option =>
      option.description.toLowerCase().includes(ref) ||
      option.createdBy.toLowerCase().includes(ref) ||
      option.status.toString().includes(ref));
    this.dataSource.data = this.filteredQuotations;
  }

  editQuotation(quote: Quotation): void {
    this.dialog.open(ProdQuotationsEditDialogComponent, {
      data: quote
    });
  }

  rejectQuotation(quote: Quotation): void {
    this.dbs.quotationsCollection
      .doc(quote.id)
      .update({ status: 'Rechazado' })
      .then(() => {
        this.snackbar.open(`Cotización #${quote.correlative} Rechazada`, 'Cerrar', {
          duration: 10000
        });
      })
      .catch(err => {
        this.snackbar.open(`Hubo un error rechazando la cotización #${quote.correlative}`, 'Cerrar', {
          duration: 10000
        });
        console.log(err);
      })
  }

  restoreQuotation(quote: Quotation): void {
    this.dbs.quotationsCollection
      .doc(quote.id)
      .update({ status: 'Enviado' })
      .then(() => {
        this.snackbar.open(`Cotización #${quote.correlative} Restaurada`, 'Cerrar', {
          duration: 10000
        });
      })
      .catch(err => {
        this.snackbar.open(`Hubo un error restaurando la cotización #${quote.correlative}`, 'Cerrar', {
          duration: 10000
        });
        console.log(err);
      })
  }

  approveQuotation(quote: Quotation): void {
    this.dbs.quotationsCollection
      .doc(quote.id)
      .update({
        status: 'Aprobado',
        approvedBy: this.auth.userInteriores.displayName,
        approvedByUid: this.auth.userInteriores.uid,
        approvedDate: Date.now()
      })
      .then(() => {
        this.snackbar.open(`Cotización #${quote.correlative} Aprobada`, 'Cerrar', {
          duration: 10000
        });
      })
      .catch(err => {
        this.snackbar.open(`Hubo un error aprobando la cotización #${quote.correlative}`, 'Cerrar', {
          duration: 10000
        });
        console.log(err);
      })
  }

  previewQuotation(quote: Quotation): void {
    // 
  }

  printQuotation(quote: Quotation): void {
    // 
  }


}
