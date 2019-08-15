import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Cash, Purchase } from 'src/app/core/types';
import { DatabaseService } from 'src/app/core/database.service';
import { AuthService } from 'src/app/core/auth.service';
import { MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { startWith, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-debts-to-pay-partial-pay-dialog',
  templateUrl: './debts-to-pay-partial-pay-dialog.component.html',
  styles: []
})
export class DebtsToPayPartialPayDialogComponent implements OnInit {

  loading: boolean = false;

  dataFormGroup: FormGroup;

  filteredCashList: Observable<Cash[]>;

  constructor(
    public dbs: DatabaseService,
    public auth: AuthService,
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private dialogRef: MatDialogRef<DebtsToPayPartialPayDialogComponent>,
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

    this.dataFormGroup.get('import').valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(res => {
        if (res < 0) {
          this.dataFormGroup.get('import').setValue(0);
        } else {
          if (res > this.data.debt.totalImport) {
            this.dataFormGroup.get('import').setValue(this.data.debt.totalImport);
          }
        }
      });
  }

  createForm(): void {
    this.dataFormGroup = this.fb.group({
      cash: [null, [Validators.required]],
      import: [null, [Validators.required]]
    })
  }

  showCash(cash: Cash): string | null {
    return cash ? cash.name : null;
  }

}
