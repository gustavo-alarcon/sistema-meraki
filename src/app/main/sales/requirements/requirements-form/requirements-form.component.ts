import { Component, OnInit } from '@angular/core';
import { Product, Color } from 'src/app/core/types';
import { of, Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    private snackbar: MatSnackBar
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
  }

  save(): void {
    
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

  onFileSelected3(event): void{
    if(event.target.files[0].type === 'application/pdf'){
      this.selectedFile3 = event.target.files[0];
      console.log(this.selectedFile3);
    }else{
      this.snackbar.open("Seleccione un archivo PDF","Cerrar", {
        duration: 6000
      })
    }
  }

  onFileSelected4(event): void{
    if(event.target.files[0].type === 'application/pdf'){
      this.selectedFile4 = event.target.files[0];
    }else{
      this.snackbar.open("Seleccione un archivo PDF","Cerrar", {
        duration: 6000
      })
    }
  }

}
