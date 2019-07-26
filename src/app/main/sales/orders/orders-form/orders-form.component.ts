import { Document, Quotation } from './../../../../core/types';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { OrdersFormSaveDialogComponent } from './orders-form-save-dialog/orders-form-save-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { map, startWith } from 'rxjs/operators';
import { DatabaseService } from 'src/app/core/database.service';
import { Ng2ImgMaxService } from 'ng2-img-max';

@Component({
  selector: 'app-orders-form',
  templateUrl: './orders-form.component.html',
  styles: []
})
export class OrdersFormComponent implements OnInit {

  dataFormGroup: FormGroup;

  selectedFile1 = null;
  imageSrc1: string | ArrayBuffer;
  resizingImage1: boolean = false;

  selectedFile2 = null;
  imageSrc2: string | ArrayBuffer;
  resizingImage2: boolean = false;

  selectedFile3 = null;
  selectedFile4 = null;

  pdf1 = null;
  pdf2 = null;

  minDate: Date = new Date();

  filteredDocuments: Observable<Document[]>;

  approvedQuotations: Array<Quotation> = [];
  filteredQuotations: Observable<Quotation[]>;

  constructor(
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
    public dbs: DatabaseService,
    private ng2ImgMax: Ng2ImgMaxService
  ) { }

  ngOnInit() {
    this.createForm();

    this.dbs.currentDataQuotations
      .pipe(
        map(res => {
          let approved: Array<Quotation> = [];
          if (res) {
            res.forEach(option => {
              if (option.status !== 'Referenciada') {
                approved.push(option);
              }
            })
          }
          return approved;
        })
      )
      .subscribe(res => {
        if (res) {
          this.approvedQuotations = res;
        }
      })

    this.filteredQuotations =
      this.dataFormGroup.get('quotation').valueChanges
        .pipe(
          startWith<any>(''),
          map(value => typeof value === 'string' ? value : value.correlative),
          map(corr => corr ? this.approvedQuotations.filter(option => option.correlative.toString().includes(corr)) : this.approvedQuotations)
        )

    this.filteredDocuments =
          this.dataFormGroup.get('document').valueChanges
          .pipe(
            map(value => typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase()),
            map(name => name ? this.dbs.documents.filter(option => option.name.toLowerCase().includes(name)) : this.dbs.documents)
          )

  }

  createForm(): void {
    this.dataFormGroup = this.fb.group({
      quotation: null,
      orderNote: [null, [Validators.required]],
      document: [null, [Validators.required]],
      documentSerial: [null, [Validators.required]],
      documentCorrelative: [null, [Validators.required]],
      quantity: [null, [Validators.required]],
      deliveryDate: [null, [Validators.required]],
      description: null
    })
  }

  showDocument(document: Document): string | null {
    return document ? document.name : null;
  }

  showQuotation(quote: Quotation): string | null {
    return quote ? 'COT' + quote.correlative : null
  }

  selectedQuotation(event): void {
    if(event){
      const quote: Quotation = event.option.value;

      this.dataFormGroup.get('description').setValue(quote.description);
      this.dataFormGroup.get('quantity').setValue(quote.quantity);
      this.dataFormGroup.get('deliveryDate').setValue(new Date(quote.deliveryDate));

      this.imageSrc1 = quote.image1;
      this.imageSrc2 = quote.image2;
      this.pdf1 = quote.file1;
      this.pdf2 = quote.file2;

    }
    
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
          file2: this.selectedFile4,
          imageSrc1: this.imageSrc1,
          imageSrc2: this.imageSrc2,
          pdf1: this.pdf1,
          pdf2: this.pdf2
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
          console.log(':smiley: Oh si!');
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
