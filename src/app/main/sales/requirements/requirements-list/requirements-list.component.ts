import { MatSnackBar } from '@angular/material/snack-bar';
import { DatabaseService } from './../../../../core/database.service';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Requirement } from 'src/app/core/types';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { RequirementsListEditDialogComponent } from './requirements-list-edit-dialog/requirements-list-edit-dialog.component';
import { RequirementsListCancelConfirmComponent } from './requirements-list-cancel-confirm/requirements-list-cancel-confirm.component';
import { RequirementsListRestoreConfirmComponent } from './requirements-list-restore-confirm/requirements-list-restore-confirm.component';

@Component({
  selector: 'app-requirements-list',
  templateUrl: './requirements-list.component.html',
  styles: []
})
export class RequirementsListComponent implements OnInit, OnDestroy {

  disableTooltips = new FormControl(false);

  filteredRequirements: Array<Requirement> = [];

  displayedColumns: string[] = ['correlative', 'regDate', 'product', 'color', 'quantity', 'description', 'files', 'status', 'actions'];


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
      option.color.toLowerCase().includes(ref));
    this.dataSource.data = this.filteredRequirements;
  }

  editRequirement(req: Requirement): void {
    if (req.status === "Enviado") {
      this.dialog.open(RequirementsListEditDialogComponent, {
        data: {
          req: req
        }
      });
    } else {
      this.snackbar.open('No se pueden editar requerimientos APROBADOS o RECHAZADOS', 'Cerrar', {
        duration: 8000
      });
    }

  }

  cancelRequirement(req: Requirement): void {
    if (req.status === 'Enviado') {
      this.dialog.open(RequirementsListCancelConfirmComponent, {
        data: {
          req: req
        }
      })
    } else {
      this.snackbar.open('No se pueden anular requerimientos APROBADOS o RECHAZADOS', 'Cerrar', {
        duration: 8000
      });
    }

  }

  restoreRequirement(req: Requirement): void {
    if (req.status === 'Anulado') {
      this.dialog.open(RequirementsListRestoreConfirmComponent, {
        data: {
          req: req
        }
      })
    } else {
      this.snackbar.open('No se pueden restaurar requerimientos APROBADOS o RECHAZADOS', 'Cerrar', {
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
