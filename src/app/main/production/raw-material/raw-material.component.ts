import { Component, OnInit, ViewChild } from '@angular/core';
import { DatabaseService } from 'src/app/core/database.service';
import { MatDialog, MatSnackBar, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { RawMaterial } from 'src/app/core/types';

@Component({
  selector: 'app-raw-material',
  templateUrl: './raw-material.component.html',
  styles: []
})
export class RawMaterialComponent implements OnInit {

  filteredRawMaterials: Array<RawMaterial> = [];

  displayedColumns: string[] = ['index', 'code', 'name', 'category', 'unit', 'stock', 'warehouse', 'currency', 'purchase', 'sale','maxDiscount', 'actions'];


  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    public dbs: DatabaseService,
    private dialog: MatDialog,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit() {
  }

  filterData(ref: string) {
    ref = ref.toLowerCase();
    this.filteredRawMaterials = this.dbs.rawMaterials.filter(option =>
      option.category.name.toLowerCase().includes(ref) ||
      option.warehouse.name.toLowerCase().includes(ref) ||
      option.code.toLowerCase().includes(ref) ||
      option.name.toLowerCase().includes(ref) ||
      option.unit.name.toLowerCase().includes(ref) ||
      option.stock.toString().includes(ref) ||
      option.purchase.toString().includes(ref) ||
      option.sale.toString().includes(ref));
    this.dataSource.data = this.filteredRawMaterials;
  }

}
