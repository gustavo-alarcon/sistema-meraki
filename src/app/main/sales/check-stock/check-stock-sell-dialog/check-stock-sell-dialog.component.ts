import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatabaseService } from 'src/app/core/database.service';
import { AuthService } from 'src/app/core/auth.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { Product, Store, SerialNumber, DepartureProduct, Document, Cash } from 'src/app/core/types';
import { debounceTime, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { isObjectValidator } from 'src/app/core/is-object-validator';

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
  filteredCash: Observable<Cash[]>;
  preFilteredCash: Array<Cash> = [];

  constructor(
    public dbs: DatabaseService,
    public auth: AuthService,
    public fb: FormBuilder,
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
          console.log(disc);
          this.dataFormGroup.get('discount').setValue(disc.toFixed(2));
        }
      });

    this.filteredDocuments =
      this.dataFormGroup.get('document').valueChanges
        .pipe(
          map(value => typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase()),
          map(name => name ? this.dbs.documents.filter(option => option.name.toLowerCase().includes(name)) : this.dbs.documents)
        )

    this.preFilteredCash = this.dbs.cashList.filter(option => option.location.name === this.data.serial.location);

    this.filteredCash =
      this.dataFormGroup.get('cash').valueChanges
        .pipe(
          map(value => typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase()),
          map(name => name ? this.preFilteredCash.filter(option => option.name.toLowerCase().includes(name) && (option.location.name === this.data.serial.location)) : this.preFilteredCash)
        )
  }

  createForm(): void {
    this.dataFormGroup = this.fb.group({
      document: [null, [Validators.required, isObjectValidator]],
      documentSerial: [null, [Validators.required]],
      documentCorrelative: [null, [Validators.required]],
      price: [null, [Validators.required]],
      discount: [0, [Validators.required]],
      paymentType: [null, [Validators.required]],
      cash: [null, [Validators.required, isObjectValidator]],
      dni: [null, [Validators.required]],
      phone: [null, [Validators.required]],
    });
  }

  showDocument(document: Document): string | null {
    return document ? document.name : null;
  }

  showCash(cash: Cash): string | null {
    return cash ? cash.name : null;
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
        dni: this.dataFormGroup.value['dni'],
        phone: this.dataFormGroup.value['phone'],
        source: 'store',
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
              console.log(store);
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

      const transaction = {
        id: '',
        regDate: Date.now(),
        type: 'VENTA',
        description: this.dataFormGroup.value['document']['name']
          + ', Serie ' + this.dataFormGroup.value['documentSerial']
          + ', Correlativo ' + this.dataFormGroup.value['documentCorrelative']
          + ', DNI ' + this.dataFormGroup.value['dni']
          + ', Celular ' + this.dataFormGroup.value['phone']
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
          ref.update({id : ref.id});
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
