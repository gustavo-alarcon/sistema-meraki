import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Requirement } from 'src/app/core/types';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';
import { DatabaseService } from 'src/app/core/database.service';
import { ProdRequirementsRejectConfirmComponent } from './prod-requirements-reject-confirm/prod-requirements-reject-confirm.component';
import { ProdRequirementsApproveConfirmComponent } from './prod-requirements-approve-confirm/prod-requirements-approve-confirm.component';
import { ProdRequirementsRestoreConfirmComponent } from './prod-requirements-restore-confirm/prod-requirements-restore-confirm.component';

@Component({
  selector: 'app-prod-requirements',
  templateUrl: './prod-requirements.component.html',
  styles: []
})
export class ProdRequirementsComponent implements OnInit, OnDestroy {

  disableTooltips = new FormControl(false);

  filteredRequirements: Array<Requirement> = [];

  displayedColumns: string[] = ['correlative', 'regDate', 'product', 'color', 'quantity', 'description', 'files', 'status', 'createdBy', 'actions'];


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

    const req$ =
      this.dbs.currentDataRequirements.subscribe(res => {
        if (res) {
          this.filteredRequirements = res;
          this.dataSource.data = res;
        }
      });

    this.subscriptions.push(req$);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  filterData(ref: string) {
    ref = ref.toLowerCase();
    this.filteredRequirements = this.dbs.requirements.filter(option =>
      ('OR' + option.correlative).toLowerCase().includes(ref) ||
      option.product.name.toLowerCase().includes(ref) ||
      option.color.toLowerCase().includes(ref) ||
      option.createdBy.toString().includes(ref));
    this.dataSource.data = this.filteredRequirements;
  }

  rejectRequirement(req: Requirement): void {
    if (req.status === 'Enviado') {
      this.dialog.open(ProdRequirementsRejectConfirmComponent, {
        data: {
          req: req
        }
      })
    } else {
      this.snackbar.open('No se pueden rechazar requerimientos APROBADOS o ANULADOS', 'Cerrar', {
        duration: 8000
      });
    }

  }

  approveRequirement(req: Requirement): void {
    if (req.status === 'Enviado') {
      this.dialog.open(ProdRequirementsApproveConfirmComponent, {
        data: {
          req: req
        }
      })
    } else {
      this.snackbar.open('No se pueden aprobar requerimientos ANULADOS o RECHAZADOS', 'Cerrar', {
        duration: 8000
      });
    }
  }

  restoreRequirement(req: Requirement): void {
    if (req.status === 'Rechazado') {
      this.dialog.open(ProdRequirementsRestoreConfirmComponent, {
        data: {
          req: req
        }
      })
    } else {
      this.snackbar.open('No se pueden restaurar requerimientos APROBADOS o ANULADOS', 'Cerrar', {
        duration: 8000
      });
    }
  }

  previewRequirement(req: Requirement): void {
    //
  }

  printRequirement(req: Requirement): void {
    //
  }

}
