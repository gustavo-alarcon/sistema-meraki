import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DatabaseService } from 'src/app/core/database.service';
import { AuthService } from 'src/app/core/auth.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { Quotation } from 'src/app/core/types';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-quotations-edit-dialog',
  templateUrl: './quotations-edit-dialog.component.html',
  styles: []
})
export class QuotationsEditDialogComponent implements OnInit, OnDestroy {

  uploading: boolean = false;

  dataFormGroup: FormGroup;

  selectedFile1 = null;
  imageSrc1: string | ArrayBuffer;

  selectedFile2 = null;
  imageSrc2: string | ArrayBuffer;

  selectedFile3 = null;
  selectedFile4 = null;

  minDate: Date = new Date();

  currentCorrelative: number = null;

  storageUploading = new BehaviorSubject<boolean>(false);
  currentStorageUploading = this.storageUploading.asObservable();
  totalFiles: number = 1;
  filesCount: number = 0;

  quotationRef: AngularFirestoreDocument;

  subscriptions: Array<Subscription> = [];

  constructor(
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
    public dbs: DatabaseService,
    public auth: AuthService,
    private storage: AngularFireStorage,
    private af: AngularFirestore,
    private dialogRef: MatDialogRef<QuotationsEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Quotation
  ) { }

  ngOnInit() {
    this.createForm();

    const storage$ =
      this.currentStorageUploading.subscribe(res => {
        if (res) {
          this.filesCount++;
          if (this.filesCount === this.totalFiles) {
            this.uploading = false;
            this.snackbar.open(`Cotización #${this.data.correlative} enviada`, 'Cerrar', {
              duration: 10000
            });
            this.dialogRef.close(true);
          }
        }
      });

    this.subscriptions.push(storage$);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  createForm(): void {
    this.dataFormGroup = this.fb.group({
      description: [this.data.description, [Validators.required]],
      quantity: [this.data.quantity, [Validators.required]],
      deliveryDate: [new Date(this.data.deliveryDate), [Validators.required]],
    });

    this.imageSrc1 = this.data.image1;
    this.imageSrc2 = this.data.image2;
  }

  save(): void {
    if (this.dataFormGroup.valid) {

      this.checkNumberOfFiles();

      this.uploading = true;

      const data = {
        description: this.dataFormGroup.value['description'],
        quantity: this.dataFormGroup.value['quantity'],
        deliveryDate: this.dataFormGroup.value['deliveryDate'].valueOf()
      }

      this.dbs.quotationsCollection
        .doc(this.data.id)
        .update(data)
        .then(() => {
          this.storageUploading.next(true);
        })

      if (this.selectedFile1) {
        const file = this.selectedFile1;
        const filePath = `/Cotizaciones/${Date.now()}_${file.name}`;
        const fileRef = this.storage.ref(filePath);
        const task = this.storage.upload(filePath, file);

        task.snapshotChanges().pipe(
          finalize(() => {
            const downloadURL = fileRef.getDownloadURL();

            downloadURL.subscribe(url => {
              if (url) {
                this.dbs.quotationsCollection
                  .doc(this.data.id)
                  .update({ image1: url })
                  .then(() => {
                    this.storageUploading.next(true);
                  })
              }
            })
          })
        )
          .subscribe()
      }

      if (this.selectedFile2) {
        const file = this.selectedFile2;
        const filePath = `/Cotizaciones/${Date.now()}_${file.name}`;
        const fileRef = this.storage.ref(filePath);
        const task = this.storage.upload(filePath, file);

        task.snapshotChanges().pipe(
          finalize(() => {
            const downloadURL = fileRef.getDownloadURL();

            downloadURL.subscribe(url => {
              if (url) {
                this.dbs.quotationsCollection
                  .doc(this.data.id)
                  .update({ image2: url })
                  .then(() => {
                    this.storageUploading.next(true);
                  })
              }
            })
          })
        )
          .subscribe()
      }

      if (this.selectedFile3) {
        const file = this.selectedFile3;
        const filePath = `/Cotizaciones/${Date.now()}_${file.name}`;
        const fileRef = this.storage.ref(filePath);
        const task = this.storage.upload(filePath, file);

        task.snapshotChanges().pipe(
          finalize(() => {
            const downloadURL = fileRef.getDownloadURL();

            downloadURL.subscribe(url => {
              if (url) {
                this.dbs.quotationsCollection
                  .doc(this.data.id)
                  .update({ file1: url })
                  .then(() => {
                    this.storageUploading.next(true);
                  })
              }
            })
          })
        )
          .subscribe()
      }

      if (this.selectedFile4) {
        const file = this.selectedFile4;
        const filePath = `/Cotizaciones/${Date.now()}_${file.name}`;
        const fileRef = this.storage.ref(filePath);
        const task = this.storage.upload(filePath, file);

        task.snapshotChanges().pipe(
          finalize(() => {
            const downloadURL = fileRef.getDownloadURL();

            downloadURL.subscribe(url => {
              if (url) {
                this.dbs.quotationsCollection
                  .doc(this.data.id)
                  .update({ file2: url })
                  .then(() => {
                    this.storageUploading.next(true);
                  })
              }
            })
          })
        )
          .subscribe()
      }
    } else {
      this.snackbar.open('Revisar campos requeridos', 'Cerrar', {
        duration: 6000
      });
    }
  }

  checkNumberOfFiles(): void {
    this.totalFiles = 1;
    if (this.selectedFile1) {
      this.totalFiles++;
    }

    if (this.selectedFile2) {
      this.totalFiles++;
    }

    if (this.selectedFile3) {
      this.totalFiles++;
    }

    if (this.selectedFile4) {
      this.totalFiles++;
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
