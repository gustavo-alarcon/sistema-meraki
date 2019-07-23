import { SerialNumber, Product, DepartureProduct, Store } from './../../../../core/types';
import { Component, OnInit, Inject } from '@angular/core';
import { DatabaseService } from 'src/app/core/database.service';
import { AuthService } from 'src/app/core/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-stores-sell-dialog',
  templateUrl: './stores-sell-dialog.component.html',
  styles: []
})
export class StoresSellDialogComponent implements OnInit {

  loading: boolean = false;

  dataFormGroup: FormGroup;

  paymentTypes = [
    'TARJETA VISA',
    'TARJETA MASTERCARD',
    'TARJETA ESTILOS',
    'EFECTIVO'
  ]

  constructor(
    public dbs: DatabaseService,
    public auth: AuthService,
    public fb: FormBuilder,
    private dialogRef: MatDialogRef<StoresSellDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { product: Product, store: Store, serial: SerialNumber },
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
  }

  createForm(): void {
    this.dataFormGroup = this.fb.group({
      document: [null, [Validators.required]],
      documentCorrelative: [null, [Validators.required]],
      price: [null, [Validators.required]],
      discount: [0, [Validators.required]],
      customerType: [null, [Validators.required]],
      dni: [null, [Validators.required]],
      phone: [null, [Validators.required]],
    });
  }

  save(): void {
    this.loading = true;
    if (this.dataFormGroup.valid) {
      const data: DepartureProduct = {
        id: '',
        document: this.dataFormGroup.value['document'],
        documentCorrelative: this.dataFormGroup.value['documentCorrelative'],
        product: this.data.product,
        serie: this.data.serial.serie,
        color: this.data.serial.color,
        quantity: 1,
        price: this.dataFormGroup.value['price'],
        discount: (this.dataFormGroup.value['price'] / this.data.product.sale) * 100,
        customerType: this.dataFormGroup.value['customerType'],
        dni: this.dataFormGroup.value['dni'],
        phone: this.dataFormGroup.value['phone'],
        source: 'store',
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
              this.dbs.storesCollection
                .doc(this.data.store.id)
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
