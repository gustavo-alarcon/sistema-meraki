import { MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatSnackBar, MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { Order, Document } from 'src/app/core/types';
import { OrdersListEditConfirmComponent } from '../orders-list-edit-confirm/orders-list-edit-confirm.component';

@Component({
  selector: 'app-orders-list-edit-dialog',
  templateUrl: './orders-list-edit-dialog.component.html',
  styles: []
})
export class OrdersListEditDialogComponent implements OnInit {

  dataFormGroup: FormGroup;

  selectedFile1 = null;
  imageSrc1: string | ArrayBuffer;

  selectedFile2 = null;
  imageSrc2: string | ArrayBuffer;

  selectedFile3 = null;
  selectedFile4 = null;

  documents: Array<Document> = [
    { id: 'aaa', name: 'Boleta', serie: 1, correlative: 100, regDate: 0 },
    { id: 'bbb', name: 'Factura', serie: 1, correlative: 100, regDate: 0 },
    { id: 'ccc', name: 'Guía de remisión', serie: 1, correlative: 100, regDate: 0 }
  ]

  minDate: Date = new Date();


  documentList: Observable<Document[]> = of(this.documents);

  constructor(
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: {order: Order},
    private dialogRef: MatDialogRef<OrdersListEditDialogComponent>
  ) { }

  ngOnInit() {
    this.createForm();
  }

  createForm(): void {
    this.dataFormGroup = this.fb.group({
      document: [this.data.order.document, [Validators.required]],
      documentCorrelative: [this.data.order.documentCorrelative, [Validators.required]],
      quantity: [this.data.order.quantity, [Validators.required]],
      deliveryDate: [new Date(this.data.order.deliveryDate), [Validators.required]],
      description: this.data.order.description
    });

    this.imageSrc1 = this.data.order.image1;
    this.imageSrc2 = this.data.order.image2;
  }

  showDocument(document: Document): string | null {
    return document ? document.name : null;
  }

  save(): void {
    if (this.dataFormGroup.valid) {
      this.dialog.open(OrdersListEditConfirmComponent, {
        data: {
          form: this.dataFormGroup.value,
          order: this.data.order,
          image1: this.selectedFile1,
          image2: this.selectedFile2,
          file1: this.selectedFile3,
          file2: this.selectedFile4
        }
      }).afterClosed().subscribe(res => {
        if (res) {
          this.dialogRef.close(true);
        }
      })
    } else {
      this.snackbar.open('Revisar campos requeridos', 'Cerrar', {
        duration: 6000
      });
    }
  }

  onFileSelected1(event): void {
    if (event.target.files[0].type === 'image/png' || event.target.files[0].type === 'image/jpeg') {
      this.selectedFile1 = event.target.files[0];

      if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];

        const reader = new FileReader();
        reader.onload = e => this.imageSrc1 = reader.result;

        reader.readAsDataURL(file);
      }
    } else {
      this.snackbar.open("Seleccione una imagen en formato png o jpeg", "Cerrar", {
        duration: 6000
      })
    }

  }

  onFileSelected2(event): void {
    if (event.target.files[0].type === 'image/png' || event.target.files[0].type === 'image/jpeg') {
      this.selectedFile2 = event.target.files[0];

      if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];

        const reader = new FileReader();
        reader.onload = e => this.imageSrc2 = reader.result;

        reader.readAsDataURL(file);
      }
    } else {
      this.snackbar.open("Seleccione una imagen en formato png o jpeg", "Cerrar", {
        duration: 6000
      })
    }
  }

  onFileSelected3(event): void {
    if (event.target.files[0].type === 'application/pdf') {
      this.selectedFile3 = event.target.files[0];
    } else {
      this.snackbar.open("Seleccione un archivo PDF", "Cerrar", {
        duration: 6000
      })
    }
  }

  onFileSelected4(event): void {
    if (event.target.files[0].type === 'application/pdf') {
      this.selectedFile4 = event.target.files[0];
    } else {
      this.snackbar.open("Seleccione un archivo PDF", "Cerrar", {
        duration: 6000
      })
    }
  }

}
