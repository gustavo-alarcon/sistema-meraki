import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { MatSnackBar, MatDialogRef } from '@angular/material';
import { AuthService } from 'src/app/core/auth.service';
import { DatabaseService } from 'src/app/core/database.service';
import { Quotation, Document } from 'src/app/core/types';
import { AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-quotations-create-dialog',
  templateUrl: './quotations-create-dialog.component.html',
  styles: []
})
export class QuotationsCreateDialogComponent implements OnInit, OnDestroy {

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
    private dialogRef: MatDialogRef<QuotationsCreateDialogComponent>,
  ) { }

  ngOnInit() {
    this.createForm();

    const storage$ =
      this.currentStorageUploading.subscribe(res => {
        if (res) {
          this.filesCount++;
          if (this.filesCount === this.totalFiles) {
            this.uploading = false;
            this.snackbar.open(`Cotización #${this.currentCorrelative} enviada`, 'Cerrar', {
              duration: 10000
            });
            this.dialogRef.close(true);
          }
        }
      });

    this.subscriptions.push(storage$);

  }

  ngOnDestroy() : void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  createForm(): void {
    this.dataFormGroup = this.fb.group({
      description: [null, [Validators.required]],
      quantity: [null, [Validators.required]],
      deliveryDate: [null, [Validators.required]],
    });
  }

  save(): void {
    if (this.dataFormGroup.valid) {
      
      this.checkNumberOfFiles();

      this.uploading = true;

      let transaction =
        this.af.firestore.runTransaction(t => {
          return t.get(this.dbs.quotationsCorrelativeDocument.ref)
            .then(doc => {
              let newCorrelative = doc.data().correlative + 1;
              this.currentCorrelative = newCorrelative;
              this.quotationRef = this.dbs.quotationsCollection.doc<Quotation>(`COT${newCorrelative}`);

              let data = {
                id: `COT${newCorrelative}`,
                correlative: newCorrelative,
                deliveryDate: this.dataFormGroup.value['deliveryDate'].valueOf(),
                quantity: this.dataFormGroup.value['quantity'],
                description: this.dataFormGroup.value['description'],
                status: 'Enviado',
                orderReference: null,
                recommendations: '',
                proposedDate: null,
                import: null,
                image1: '',
                image2: '',
                file1: '',
                file2: '',
                quotationPDF: '',
                regDate: Date.now(),
                createdBy: this.auth.userInteriores.displayName,
                createdByUid: this.auth.userInteriores.uid,
                approvedBy: '',
                approvedByUid: '',
                approvedDate: null
              };

              t.set(this.quotationRef.ref, data);
              t.update(this.dbs.quotationsCorrelativeDocument.ref, { correlative: newCorrelative });
            });
        }).then(() => {
          this.storageUploading.next(true);

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
                    this.quotationRef
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
                    this.quotationRef
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
                    this.quotationRef
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
                    this.quotationRef
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

        }).catch(err => {
          console.log('Transaction failure:', err);
        });
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
