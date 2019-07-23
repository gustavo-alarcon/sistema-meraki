import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subscription } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { DatabaseService } from 'src/app/core/database.service';
import { SerialNumber } from 'src/app/core/types';

@Component({
  selector: 'app-receptions-show-serial-list',
  templateUrl: './receptions-show-serial-list.component.html',
  styles: []
})
export class ReceptionsShowSerialListComponent implements OnInit {

  displayedColumns: string[] = ['index', 'code', 'name', 'serie', 'color'];
  dataSource = new MatTableDataSource();

  subscriptions: Array<Subscription> = [];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    public af: AngularFirestore,
    public dbs: DatabaseService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<ReceptionsShowSerialListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Array<SerialNumber>
  ) { }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.data = this.data;
  }

}
