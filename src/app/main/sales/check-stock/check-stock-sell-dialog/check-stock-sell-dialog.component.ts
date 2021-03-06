import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatabaseService } from 'src/app/core/database.service';
import { AuthService } from 'src/app/core/auth.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar, MatDialog } from '@angular/material';
import { Product, SerialNumber, DepartureProduct, Document, Cash, WholesaleCustomer, Customer } from 'src/app/core/types';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { isObjectValidator } from 'src/app/core/is-object-validator';
import { CheckStockCreateWholesaleDialogComponent } from '../check-stock-create-wholesale-dialog/check-stock-create-wholesale-dialog.component';
import { CheckStockCreateCustomerDialogComponent } from '../check-stock-create-customer-dialog/check-stock-create-customer-dialog.component';

@Component({
  selector: 'app-check-stock-sell-dialog',
  templateUrl: './check-stock-sell-dialog.component.html',
  styles: []
})
export class CheckStockSellDialogComponent implements OnInit {

  loading: boolean = false;

  dataFormGroup: FormGroup;

  paymentTypes = [
    'TARJETA VISA',
    'TARJETA MASTERCARD',
    'TARJETA ESTILOS',
    'EFECTIVO'
  ]

  filteredDocuments: Observable<Document[]>;
  filteredCustomers: Observable<WholesaleCustomer[] | Customer[]>;
  filteredCash: Observable<Cash[]>;
  preFilteredCash: Array<Cash> = [];

  subscriptions: Array<Subscription> = [];

  constructor(
    public dbs: DatabaseService,
    public auth: AuthService,
    public fb: FormBuilder,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<CheckStockSellDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { serial: SerialNumber, product: Product },
    private snackbar: MatSnackBar
  ) { }

  ngOnInit() {
    this.createForm();

    this.dataFormGroup.get('price').valueChanges
      .pipe(
        debounceTime(1000)
      )
      .subscribe(res => {
        if (res) {
          let disc = 0;
          disc = 100 - (res * 100) / this.data.product.sale;
          this.dataFormGroup.get('discount').setValue(disc.toFixed(2));
        }
      });

    this.filteredDocuments =
      this.dataFormGroup.get('document').valueChanges
        .pipe(
          startWith<any>(''),
          map(value => typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase()),
          map(name => name ? this.dbs.documents.filter(option => option.name.toLowerCase().includes(name)) : this.dbs.documents)
        )

    // this.preFilteredCash = this.dbs.cashList.filter(option => option.location.name === this.data.serial.location);

    this.filteredCash =
      this.dataFormGroup.get('cash').valueChanges
        .pipe(
          startWith<any>(''),
          map(value => typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase()),
          map(name => name ? this.dbs.cashList.filter(option => option.name.toLowerCase().includes(name)) : this.dbs.cashList)
        )

    const customerType$ =
      this.dataFormGroup.get('customerType').valueChanges
        .subscribe(res => {
          if (res === 'MAYORISTA') {
            this.dataFormGroup.get('customer').reset();
            this.filteredCustomers =
              this.dataFormGroup.get('customer').valueChanges
                .pipe(
                  startWith<any>(''),
                  map(value => {
                    if (value) {
                      return typeof value === 'string' ? value.trim().toLowerCase() : (value.businessName ? value.businessName.toLowerCase() : value.name.toLowerCase())
                    } else {
                      return '';
                    }
                  }),
                  map(name => name ? this.dbs.wholesale.filter(option => (option.businessName ? option.businessName.toLowerCase().includes(name) : false) || (option.name ? option.name.toLowerCase().includes(name) : false)) : this.dbs.wholesale)
                )
          } else if (res === 'GENERAL') {
            this.dataFormGroup.get('customer').reset();
            this.filteredCustomers =
              this.dataFormGroup.get('customer').valueChanges
                .pipe(
                  startWith<any>(''),
                  map(value => {
                    if (value) {
                      return typeof value === 'string' ? value.trim().toLowerCase() : value.name.toLowerCase()
                    } else {
                      return '';
                    }
                  }),
                  map(name => name ? this.dbs.customers.filter(option => option.name.toLowerCase().includes(name)) : this.dbs.customers)
                )
          }
        });

    this.subscriptions.push(customerType$);
  }

  createForm(): void {
    this.dataFormGroup = this.fb.group({
      document: [null, [Validators.required, isObjectValidator]],
      documentSerial: [null, [Validators.required]],
      documentCorrelative: [null, [Validators.required]],
      customerType: [null, [Validators.required]],
      customer: [null, [Validators.required, isObjectValidator]],
      price: [null, [Validators.required]],
      discount: [0, [Validators.required]],
      paymentType: [null, [Validators.required]],
      cash: [null, [Validators.required, isObjectValidator]],
    });
  }

  showDocument(document: Document): string | null {
    return document ? document.name : null;
  }

  showCustomer(customer: any): string | null {
    if (customer) {
      if (customer.businessName) {
        return customer.businessName;
      } else if (customer.name) {
        return customer.name + (customer.lastname ? (' ' + customer.lastname) : '');
      }
    } else {
      return null;
    }

  }

  showCash(cash: Cash): string | null {
    return cash ? cash.name : null;
  }

  addWholesale(): void {
    this.dialog.open(CheckStockCreateWholesaleDialogComponent)
      .afterClosed().subscribe(res => {
        if (res) {
          this.dataFormGroup.get('customer').setValue(res);
        }
      });
  }

  addCustomer(): void {
    this.dialog.open(CheckStockCreateCustomerDialogComponent)
      .afterClosed().subscribe(res => {
        if (res) {
          this.dataFormGroup.get('customer').setValue(res);
        }
      });
  }

  save(): void {
    this.loading = true;
    if (this.dataFormGroup.valid) {
      const data: DepartureProduct = {
        id: '',
        document: this.dataFormGroup.value['document'],
        documentSerial: this.dataFormGroup.value['documentSerial'],
        documentCorrelative: this.dataFormGroup.value['documentCorrelative'],
        product: this.data.product,
        serie: this.data.serial.serie,
        color: this.data.serial.color ? this.data.serial.color : null,
        quantity: 1,
        price: this.dataFormGroup.value['price'],
        discount: (this.dataFormGroup.value['price'] / this.data.product.sale) * 100,
        paymentType: this.dataFormGroup.value['paymentType'],
        customerType: this.dataFormGroup.value['customerType'],
        customer: this.dataFormGroup.value['customer'],
        source: 'check stock',
        location: this.data.serial.location,
        regDate: Date.now(),
        createdBy: this.auth.userInteriores.displayName,
        createdByUid: this.auth.userInteriores.uid,
        canceledBy: '',
        canceldByUid: '',
        canceledDate: null
      }

      this.dbs.departuresCollection
        .add(data)
        .then(ref => {
          ref.update({ id: ref.id })
            .then(() => {
              const store = this.dbs.stores.filter(option => option.name === this.data.serial.location);
              this.dbs.storesCollection
                .doc(store[0].id)
                .collection('products')
                .doc(this.data.product.id)
                .collection('products')
                .doc(this.data.serial.id)
                .update({ status: 'Vendido' }).
                then(() => {
                  this.loading = false;
                  this.snackbar.open(`${this.data.serial.name} #${this.data.serial.serie} vendido!`, 'Cerrar', {
                    duration: 6000
                  });
                  this.dialogRef.close(true);
                })
                .catch(err => {
                  this.loading = false;
                  this.snackbar.open('Parece que hubo un error actualizando el producto!', 'Cerrar', {
                    duration: 6000
                  });
                  console.log(err);
                })
            })
            .catch(err => {
              this.loading = false;
              this.snackbar.open('Parece que hubo un error grabando el ID de venta!', 'Cerrar', {
                duration: 6000
              });
              console.log(err);
            })
        })
        .catch(err => {
          this.loading = false;
          this.snackbar.open('Parece que hubo un error grabando el documento de venta!', 'Cerrar', {
            duration: 6000
          });
          console.log(err);
        })

      let customerName;

      if (this.dataFormGroup.value['customer']['businessName']) {
        customerName = this.dataFormGroup.value['customer']['businessName'];
      } else {
        customerName = this.dataFormGroup.value['customer']['name'] + (this.dataFormGroup.value['customer']['lastname'] ? (' ' + this.dataFormGroup.value['customer']['lastname']) : '');
      }

      const transaction = {
        id: '',
        regDate: Date.now(),
        type: 'VENTA',
        description: this.dataFormGroup.value['document']['name']
          + ', Serie ' + this.dataFormGroup.value['documentSerial']
          + ', Correlativo ' + this.dataFormGroup.value['documentCorrelative']
          + ', Producto ' + this.data.serial.name + '#' + this.data.serial.serie
          + ', Cliente ' + customerName
          + ', Dsct.  ' + this.dataFormGroup.value['discount'] + '%',
        import: this.dataFormGroup.value['price'],
        user: this.auth.userInteriores,
        verified: false,
        status: 'Grabado',
        ticketType: 'VENTA',
        paymentType: this.dataFormGroup.value['paymentType'],
        expenseType: null,
        departureType: null,
        originAccount: null,
        debt: 0,
        lastEditBy: null,
        lastEditUid: null,
        lastEditDate: null,
        approvedBy: null,
        approvedByUid: null,
        approvedDate: null,
      }

      this.dbs.cashListCollection
        .doc(this.dataFormGroup.value['cash'].id)
        .collection('openings')
        .doc(this.dataFormGroup.value['cash'].currentOpening)
        .collection('transactions')
        .add(transaction)
        .then(ref => {
          ref.update({ id: ref.id });
        })
        .catch(err => {
          console.log(err);
          this.snackbar.open('Parece que hubo un error guardan la transacción!', 'Cerrar', {
            duration: 6000
          });
        })
    }

  }

}
