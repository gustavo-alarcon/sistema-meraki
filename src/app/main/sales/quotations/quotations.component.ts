import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Quotation } from 'src/app/core/types';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';
import { DatabaseService } from 'src/app/core/database.service';
import { QuotationsCreateDialogComponent } from './quotations-create-dialog/quotations-create-dialog.component';
import { QuotationsEditDialogComponent } from './quotations-edit-dialog/quotations-edit-dialog.component';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-quotations',
  templateUrl: './quotations.component.html',
  styles: []
})
export class QuotationsComponent implements OnInit, OnDestroy {

  disableTooltips = new FormControl(false);

  filteredQuotations: Array<Quotation> = [];

  displayedColumns: string[] = ['correlative', 'description', 'deliveryDate', 'quantity', 'files', 'status', 'orderReference', 'recommendations', 'proposedDate', 'import', 'quotationPDF', 'actions'];


  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  subscriptions: Array<Subscription> = [];


  constructor(
    public dbs: DatabaseService,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    private route : Router,
    private aroute: ActivatedRoute
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
      option.status.toString().includes(ref));
    this.dataSource.data = this.filteredQuotations;
  }

  createQuotation(): void {
    this.dialog.open(QuotationsCreateDialogComponent);
  }

  editQuotation(quote: Quotation): void {
    this.dialog.open(QuotationsEditDialogComponent, {
      data: quote
    });
  }

  cancelQuotation(quote: Quotation): void {
    this.dbs.quotationsCollection
      .doc(quote.id)
      .update({ status: 'Anulado' })
      .then(() => {
        this.snackbar.open(`Cotización #${quote.correlative} Anulada`, 'Cerrar', {
          duration: 10000
        });
      })
      .catch(err => {
        this.snackbar.open(`Hubo un error anulando la cotización #${quote.correlative}`, 'Cerrar', {
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

  // generateOPe(quote: Quotation): void {
  //   this.route.navigate(['../../orders/form', quote.id], {relativeTo: this.aroute});
  // }

  previewQuotation(quote: Quotation): void {
    // 
  }

  printQuotation(quote: Quotation): void {
    // 
  }

}
