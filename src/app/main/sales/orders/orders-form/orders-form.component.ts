import { Document } from './../../../../core/types';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { OrdersFormSaveDialogComponent } from './orders-form-save-dialog/orders-form-save-dialog.component';

@Component({
  selector: 'app-orders-form',
  templateUrl: './orders-form.component.html',
  styles: []
})
export class OrdersFormComponent implements OnInit {

  dataFormGroup: FormGroup;

  selectedFile1 = null;
  imageSrc1: string | ArrayBuffer;

  selectedFile2 = null;
  imageSrc2: string | ArrayBuffer;

  selectedFile3 = null;
  selectedFile4 = null;

  products: Array<Document> = [
    { id: 'aaa', name: 'Boleta', serie: 1, correlative: 100, regDate: 0 },
    { id: 'bbb', name: 'Factura', serie: 1, correlative: 100, regDate: 0 },
    { id: 'ccc', name: 'Guía de remisión', serie: 1, correlative: 100, regDate: 0 }
  ]

  minDate: Date = new Date();


  documentList: Observable<Document[]> = of(this.products);

  constructor(
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private dialog: MatDialog
  ){}

  ngOnInit() {
    this.createForm();
  }

  createForm(): void {
    this.dataFormGroup = this.fb.group({
      document: [null, [Validators.required]],
      documentCorrelative: [null, [Validators.required]],
      quantity: [null, [Validators.required]],
      deliveryDate: [null, [Validators.required]],
      description: null
    })
  }

  showDocument(document: Document): string | null {
    return document ? document.name : null;
  }

  clean(): void {
    this.createForm();
    this.selectedFile1 = null;
    this.selectedFile2 = null;
    this.selectedFile3 = null;
    this.selectedFile4 = null;
    this.imageSrc1 = null;
    this.imageSrc2 = null;
  }

  save(): void {
    if (this.dataFormGroup.valid) {
      this.dialog.open(OrdersFormSaveDialogComponent, {
        data: {
          form: this.dataFormGroup.value,
          image1: this.selectedFile1,
          image2: this.selectedFile2,
          file1: this.selectedFile3,
          file2: this.selectedFile4
        }
      }).afterClosed().subscribe(res => {
        if (res) {
          this.clean();
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
