import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatabaseService } from 'src/app/core/database.service';
import { AuthService } from 'src/app/core/auth.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { Product, Store, SerialNumber, DepartureProduct, Document } from 'src/app/core/types';
import { debounceTime, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

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
          disc = 100 - (res * 100) / this.data.product.sale ;
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
  }

  createForm(): void {
    this.dataFormGroup = this.fb.group({
      document: [null, [Validators.required]],
      documentSerial: [null, [Validators.required]],
      documentCorrelative: [null, [Validators.required]],
      price: [null, [Validators.required]],
      discount: [0, [Validators.required]],
      paymentType: [null, [Validators.required]],
      dni: [null, [Validators.required]],
      phone: [null, [Validators.required]],
    });
  }

  showDocument(document: Document): string | null {
    return document ? document.name : null;
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

      console.log(data);

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
    }

  }

}
