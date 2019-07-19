import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { RawMaterialAddStockDialogComponent } from '../raw-material-add-stock-dialog/raw-material-add-stock-dialog.component';
import { RawMaterial, ProductionOrder } from 'src/app/core/types';
import { RawMaterialSubstractStockConfirmComponent } from '../raw-material-substract-stock-confirm/raw-material-substract-stock-confirm.component';
import { DatabaseService } from 'src/app/core/database.service';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-raw-material-substract-stock-dialog',
  templateUrl: './raw-material-substract-stock-dialog.component.html',
  styles: []
})
export class RawMaterialSubstractStockDialogComponent implements OnInit {

  dataFormGroup: FormGroup;

  filteredProductionOrders: Observable<ProductionOrder[]>;

  constructor(
    public dbs: DatabaseService,
    private dialog: MatDialog,
    public fb: FormBuilder,
    private dialogRef: MatDialogRef<RawMaterialAddStockDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { raw: RawMaterial }
  ) { }

  ngOnInit() {
    this.createForm();

    this.filteredProductionOrders =
      this.dataFormGroup.get('OPCorrelative').valueChanges
        .pipe(
          startWith<any>(''),
          map(op => typeof op === 'string' ? op : op['correlative'].toString()),
          map(op => op ? this.dbs.productionOrders.filter(option => option.correlative.toString().includes(op) && option.status === 'Produciendo') : []),
        )
  }

  createForm(): void {
    this.dataFormGroup = this.fb.group({
      OPCorrelative: [null, [Validators.required]],
      quantity: [null, [Validators.required]]
    });
  }

  showOP(op: ProductionOrder): string | null {
    return op ? ('OP' + op.correlative) : null
  }

  substractStock(): void {
    this.dialog.open(RawMaterialSubstractStockConfirmComponent, {
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
