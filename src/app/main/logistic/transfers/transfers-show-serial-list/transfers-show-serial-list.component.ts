import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { SerialNumber, Product } from 'src/app/core/types';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Subscription } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { DatabaseService } from 'src/app/core/database.service';

@Component({
  selector: 'app-transfers-show-serial-list',
  templateUrl: './transfers-show-serial-list.component.html',
  styles: []
})
export class TransfersShowSerialListComponent implements OnInit {

  displayedColumns: string[] = ['index', 'code', 'name', 'serie', 'color'];
  dataSource = new MatTableDataSource();

  subscriptions: Array<Subscription> = [];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    public af: AngularFirestore,
    public dbs: DatabaseService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<TransfersShowSerialListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Array<SerialNumber>
  ) { }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.data = this.data;
  }

}
