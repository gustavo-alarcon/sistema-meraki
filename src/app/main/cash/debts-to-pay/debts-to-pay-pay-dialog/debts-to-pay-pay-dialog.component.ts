import { Component, OnInit, Inject } from '@angular/core';
import { DatabaseService } from 'src/app/core/database.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/auth.service';
import { MatSnackBar, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Purchase, Cash } from 'src/app/core/types';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-debts-to-pay-pay-dialog',
  templateUrl: './debts-to-pay-pay-dialog.component.html',
  styles: []
})
export class DebtsToPayPayDialogComponent implements OnInit {

  loading: boolean = false;

  dataFormGroup: FormGroup;

  filteredCashList: Observable<Cash[]>;

  constructor(
    public dbs: DatabaseService,
    public auth: AuthService,
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private dialogRef: MatDialogRef<DebtsToPayPayDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { debt: Purchase }
  ) { }

  ngOnInit() {

    this.createForm();

    this.filteredCashList =
      this.dataFormGroup.get('cash').valueChanges
        .pipe(
          startWith<any>(''),
          map(value => typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase()),
          map(name => name ? this.dbs.cashList.filter(option => option.name.toLowerCase().includes(name)) : this.dbs.cashList)
        )
  }

  createForm(): void {
    this.dataFormGroup = this.fb.group({
      cash: [null, [Validators.required]]
    })
  }

  showCash(cash: Cash): string | null {
    return cash ? cash.name : null;
  }

  pay(): void {
    if (this.dataFormGroup.valid) {

      this.loading = true;

      if (this.data.debt.payments) {
        this.data.debt.payments.push({
          type: 'TOTAL',
          import: this.data.debt.indebtImport,
          cashReference: this.dataFormGroup.value['cash'],
          paidBy: this.auth.userInteriores.displayName,
          paidByUid: this.auth.userInteriores.uid,
          regDate: Date.now()
        });
      } else {
        this.data.debt['payments'] = [{
          type: 'TOTAL',
          import: this.data.debt.indebtImport,
          cashReference: this.dataFormGroup.value['cash'],
          paidBy: this.auth.userInteriores.displayName,
          paidByUid: this.auth.userInteriores.uid,
          regDate: Date.now()
        }];
      }

      const data = {
        payments: this.data.debt.payments,
        status: 'Pagado',
        approvedBy: this.auth.userInteriores.displayName,
        approvedByUid: this.auth.userInteriores.uid,
        approvedDate: Date.now()
      };

      this.dbs.debtsToPayCollection
        .doc(this.data.debt.id)
        .update(data)
        .then(() => {
          this.dbs.purchasesCollection
            .doc(this.data.debt.id)
            .update(data)
            .then(() => {
              this.loading = false;
              this.snackbar.open(`Cuenta pagada con caja : ${this.dataFormGroup.value['cash'].name}.`, 'Cerrar', {
                duration: 15000
              });
              this.dialogRef.close(true);
            })
            .catch(err => {
              console.log(err);
              this.loading = false;
              this.snackbar.open('Hubo un error actualizando el documento en COMPRAS!', 'Cerrar', {
                duration: 6000
              });
            })
        })
        .catch(err => {
          console.log(err);
              this.loading = false;
              this.snackbar.open('Hubo un error actualizando el documento en CUENTAS POR PAGAR!', 'Cerrar', {
                duration: 6000
              });
        });
    }

  }

}
