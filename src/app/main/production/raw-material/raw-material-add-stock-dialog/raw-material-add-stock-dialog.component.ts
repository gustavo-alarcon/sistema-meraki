import { RawMaterialAddStockConfirmComponent } from './../raw-material-add-stock-confirm/raw-material-add-stock-confirm.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';
import { RawMaterial, Document } from 'src/app/core/types';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { DatabaseService } from 'src/app/core/database.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-raw-material-add-stock-dialog',
  templateUrl: './raw-material-add-stock-dialog.component.html',
  styles: []
})
export class RawMaterialAddStockDialogComponent implements OnInit {

  dataFormGroup: FormGroup;

  filteredDocuments: Observable<string[]>;

  filteredTypes = [
    'FACTURA',
    'BOLETA',
    'FACTURA ELECTRONICA',
    'BOLETA ELECTRONICA',
    'TICKET DE COMPRA',
    'PROFORMA'
  ]
  
  constructor(
    private dialog: MatDialog,
    public dbs: DatabaseService,
    public fb: FormBuilder,
    private dialogRef: MatDialogRef<RawMaterialAddStockDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { raw: RawMaterial }
  ) { }

  ngOnInit() {
    this.createForm();

    this.filteredDocuments =
      this.dataFormGroup.get('document').valueChanges
        .pipe(
          startWith<any>(''),
          map(value => value.toLowerCase()),
          map(name => name ? this.filteredTypes.filter(option => option.toLowerCase().includes(name)) : this.filteredTypes)
        )
  }

  createForm(): void {
    this.dataFormGroup = this.fb.group({
      document: [null, [Validators.required]],
      documentSerial: [null, [Validators.required]],
      documentCorrelative: [null, [Validators.required]],
      quantity: [null, [Validators.required]],
      totalPrice: [null, [Validators.required]]
    });
  }

  addStock(): void {
    this.dialog.open(RawMaterialAddStockConfirmComponent, {
      data: {
        raw: this.data.raw,
        form: this.dataFormGroup.value
      }
    }).afterClosed().subscribe(res => {
      if (res) {
        this.dialogRef.close(true);
      }
    });
  }

}
