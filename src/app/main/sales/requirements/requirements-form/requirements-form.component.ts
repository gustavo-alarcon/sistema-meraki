import { Component, OnInit } from '@angular/core';
import { Product, Color } from 'src/app/core/types';
import { of, Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { RequirementFormSaveDialogComponent } from './requirement-form-save-dialog/requirement-form-save-dialog.component';

@Component({
  selector: 'app-requirements-form',
  templateUrl: './requirements-form.component.html',
  styles: []
})
export class RequirementsFormComponent implements OnInit {

  dataFormGroup: FormGroup;

  selectedFile1 = null;
  imageSrc1: string | ArrayBuffer;

  selectedFile2 = null;
  imageSrc2: string | ArrayBuffer;

  selectedFile3 = null;
  selectedFile4 = null;

  products: Array<Product> = [
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
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.createForm();
  }

  createForm(): void {
    this.dataFormGroup = this.fb.group({
      product: [null, [Validators.required]],
      quantity: [null, [Validators.required]],
      color: [null, [Validators.required]],
      description: null
    })
  }

  showProduct(product: Product): string | null {
    return product ? product.name : null;
  }

  showColor(color: Color): string | null {
    return color ? color.name : null;
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
      this.dialog.open(RequirementFormSaveDialogComponent, {
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
