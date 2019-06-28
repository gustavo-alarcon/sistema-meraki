import { Component, OnInit } from '@angular/core';
import { Product, Color } from 'src/app/core/types';
import { of, Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  products: Array<Product> = [
    {id: 'aaa', name: 'Antare', code: '1010100', regDate: 0},
    {id: 'bbb', name: 'Aleman', code: '1010200', regDate: 0},
    {id: 'ccc', name: 'Egipto', code: '1010300', regDate: 0}
  ]

  colors: Array<Color> = [
    {id: 'aaa', name: 'Wengue', regDate: 0},
    {id: 'aaa', name: 'Caramelo', regDate: 0},
    {id: 'aaa', name: 'Nogal', regDate: 0},
  ]

  productList: Observable<Product[]> = of(this.products);
  colorList: Observable<Color[]> = of(this.colors);

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.createForm();
  }

  createForm(): void {
    this.dataFormGroup = this.fb.group({
      product: ['', [Validators.required]],
      color: ['', [Validators.required]],
      details: ''
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

  onFileSelected1(event): void {
    this.selectedFile1 = event.target.files[0];

    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      const reader = new FileReader();
      reader.onload = e => this.imageSrc1 = reader.result;

      reader.readAsDataURL(file);
    }
  }

  onFileSelected2(event): void {
    this.selectedFile2 = event.target.files[0];

    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      const reader = new FileReader();
      reader.onload = e => this.imageSrc2 = reader.result;

      reader.readAsDataURL(file);
    }
  }

}
