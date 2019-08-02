import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { DatabaseService } from 'src/app/core/database.service';
import { AddMoneyCashConfirmComponent } from '../add-money-cash-confirm/add-money-cash-confirm.component';

@Component({
  selector: 'app-add-money-cash-dialog',
  templateUrl: './add-money-cash-dialog.component.html',
  styles: []
})
export class AddMoneyCashDialogComponent implements OnInit {

  dataFormGroup: FormGroup;

  paymentTypes = [
    'TARJETA VISA',
    'TARJETA MASTERCARD',
    'TARJETA ESTILOS',
    'EFECTIVO'
  ]

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<AddMoneyCashDialogComponent>,
    public dbs: DatabaseService
  ) { }

  ngOnInit() {
    this.createForm();
  }

  createForm(): void {
    this.dataFormGroup = this.fb.group({
      paymentType: [null, [Validators.required]],
      import: [null, [Validators.required]],
      debt: [null, [Validators.required]],
      description: [null, [Validators.required]]
    });
  }

  addMoney(): void {
    this.dialog.open(AddMoneyCashConfirmComponent, {
      data: {
        form: this.dataFormGroup.value
      }
    })
      .afterClosed().subscribe(res => {
        if (res) {
          this.dialogRef.close(true);
        }
      })
  }

}
