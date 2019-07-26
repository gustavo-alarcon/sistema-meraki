import { Component, OnInit } from '@angular/core';
import { Product, Color } from 'src/app/core/types';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { RequirementFormSaveDialogComponent } from './requirement-form-save-dialog/requirement-form-save-dialog.component';
import { startWith, map } from 'rxjs/operators';
import { DatabaseService } from 'src/app/core/database.service';
import { Ng2ImgMaxService } from 'ng2-img-max';

@Component({
  selector: 'app-requirements-form',
  templateUrl: './requirements-form.component.html',
  styles: []
})
export class RequirementsFormComponent implements OnInit {

  dataFormGroup: FormGroup;

  selectedFile1 = null;
  imageSrc1: string | ArrayBuffer;
  resizingImage1: boolean = false;

  selectedFile2 = null;
  imageSrc2: string | ArrayBuffer;
  resizingImage2: boolean = false;

  selectedFile3 = null;
  selectedFile4 = null;

  filteredFinishedProducts: Observable<Product[]>;

  constructor(
    private fb: FormBuilder,
    public dbs: DatabaseService,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
    private ng2ImgMax: Ng2ImgMaxService
  ) { }

  ngOnInit() {
    this.createForm();

    this.filteredFinishedProducts =
      this.dataFormGroup.get('product').valueChanges
        .pipe(
          startWith<any>(''),
          map(value => typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase()),
          map(name => name ? this.dbs.finishedProducts.filter(option => option.name.toLowerCase().includes(name)) : this.dbs.finishedProducts)
        )
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

      if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];

        const reader = new FileReader();
        reader.onload = e => this.imageSrc1 = reader.result;

        reader.readAsDataURL(file);
      }

      this.resizingImage1 = true;
      this.ng2ImgMax.resizeImage(event.target.files[0], 10000, 426).subscribe(
        result => {
          this.selectedFile1 = new File([result], result.name);
          console.log('Oh si!');
          this.resizingImage1 = false;
        },
        error => {
          console.log('😢 Oh no!', error);
          this.resizingImage1 = false;
        }
      );

    } else {
      this.snackbar.open("Seleccione una imagen en formato png o jpeg", "Cerrar", {
        duration: 6000
      })
    }

  }

  onFileSelected2(event): void {
    if (event.target.files[0].type === 'image/png' || event.target.files[0].type === 'image/jpeg') {

      if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];

        const reader = new FileReader();
        reader.onload = e => this.imageSrc2 = reader.result;

        reader.readAsDataURL(file);
      }

      this.resizingImage2 = true;
      this.ng2ImgMax.resizeImage(event.target.files[0], 10000, 426).subscribe(
        result => {
          this.selectedFile2 = new File([result], result.name);
          console.log('Oh si!');
          this.resizingImage2 = false;
        },
        error => {
          console.log('😢 Oh no!', error);
          this.resizingImage2 = false;
        }
      );
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
