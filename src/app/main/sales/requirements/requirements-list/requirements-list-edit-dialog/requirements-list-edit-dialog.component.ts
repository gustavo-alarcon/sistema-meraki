import { MAT_DIALOG_DATA, MatSnackBar, MatDialog, MatDialogRef } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';
import { RequirementsListEditConfirmComponent } from '../requirements-list-edit-confirm/requirements-list-edit-confirm.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Product, Color, Requirement } from 'src/app/core/types';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-requirements-list-edit-dialog',
  templateUrl: './requirements-list-edit-dialog.component.html',
  styles: []
})
export class RequirementsListEditDialogComponent implements OnInit {

  dataFormGroup: FormGroup;

  selectedFile1 = null;
  imageSrc1: string | ArrayBuffer;

  selectedFile2 = null;
  imageSrc2: string | ArrayBuffer;

  selectedFile3 = null;
  selectedFile4 = null;

  products: Array<Product> = [
    { id: 'aaa', name: 'Antare', code: '1010100', regDate: 0 },
    { id: 'bbb', name: 'Aleman', code: '1010200', regDate: 0 },
    { id: 'ccc', name: 'Egipto', code: '1010300', regDate: 0 }
  ]

  colors: Array<Color> = [
    { id: 'aaa', name: 'Wengue', regDate: 0 },
    { id: 'aaa', name: 'Caramelo', regDate: 0 },
    { id: 'aaa', name: 'Nogal', regDate: 0 },
  ]

  productList: Observable<Product[]> = of(this.products);
  colorList: Observable<Color[]> = of(this.colors);

  constructor(
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: { req: Requirement },
    private dialogRef: MatDialogRef<RequirementsListEditDialogComponent>
  ) { }

  ngOnInit() {
    this.createForm();
  }

  createForm(): void {
    this.dataFormGroup = this.fb.group({
      product: [this.data.req.product, [Validators.required]],
      quantity: [this.data.req.quantity, [Validators.required]],
      color: [this.data.req.color, [Validators.required]],
      description: this.data.req.description
    });

    this.imageSrc1 = this.data.req.image1;
    this.imageSrc2 = this.data.req.image2;
  }

  showProduct(product: Product): string | null {
    return product ? product.name : null;
  }

  showColor(color: Color): string | null {
    return color ? color.name : null;
  }

  save(): void {
    this.dialog.open(RequirementsListEditConfirmComponent, {
      data: {
        form: this.dataFormGroup.value,
        req: this.data.req,
        image1: this.selectedFile1,
        image2: this.selectedFile2,
        file1: this.selectedFile3,
        file2: this.selectedFile4
      }
    }).afterClosed().subscribe(res => {
      if(res) {
        this.dialogRef.close()
      }
    })
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
