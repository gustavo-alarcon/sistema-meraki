import { AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFirestore } from '@angular/fire/firestore';
import { Requirement } from './../../../../../core/types';
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Observable, Subscription, BehaviorSubject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { DatabaseService } from 'src/app/core/database.service';
import { AuthService } from 'src/app/core/auth.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-requirement-form-save-dialog',
  templateUrl: './requirement-form-save-dialog.component.html',
  styles: []
})
export class RequirementFormSaveDialogComponent implements OnInit, OnDestroy {

  uploading: boolean = false;

  uploadPercent1: Observable<number>;
  uploading1: boolean = false;

  uploadPercent2: Observable<number>;
  uploading2: boolean = false;

  uploadPercent3: Observable<number>;
  uploading3: boolean = false;

  uploadPercent4: Observable<number>;
  uploading4: boolean = false;

  flags = {
    created: false,
    upload1: false,
    upload2: false,
    upload3: false,
    upload4: false
  }

  currentCorrelative: number = null;

  storageUploading = new BehaviorSubject<boolean>(false);
  currentStorageUploading = this.storageUploading.asObservable();
  totalFiles: number = 1;
  filesCount: number = 0;

  requirementRef: AngularFirestoreDocument;

  subscriptions: Array<Subscription> = [];

  constructor(
    public dbs: DatabaseService,
    public auth: AuthService,
    private storage: AngularFireStorage,
    private af: AngularFirestore,
    private dialogRef: MatDialogRef<RequirementFormSaveDialogComponent>,
    private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

  }

  ngOnInit() {
    this.checkNumberOfFiles();

    const storage$ =
      this.currentStorageUploading.subscribe(res => {
        if (res) {
          this.filesCount++;
          if (this.filesCount === this.totalFiles) {
            this.uploading = false;
            this.snackbar.open(`Order de Requerimiento #${this.currentCorrelative} creada`, 'Cerrar', {
              duration: 10000
            });
            this.dialogRef.close(true);
          }
        }
      });

    this.subscriptions.push(storage$);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  checkNumberOfFiles(): void {
    this.totalFiles = 1;
    if (this.data['image1']) {
      this.totalFiles++;
    }

    if (this.data['image2']) {
      this.totalFiles++;
    }

    if (this.data['file1']) {
      this.totalFiles++;
    }

    if (this.data['file2']) {
      this.totalFiles++;
    }
  }

  save(): void {
    this.uploading = true;

    let transaction =
      this.af.firestore.runTransaction(t => {
        return t.get(this.dbs.requirementCorrelativeDocument.ref)
          .then(doc => {
            let newCorrelative = doc.data().correlative + 1;
            this.currentCorrelative = newCorrelative;
            this.requirementRef = this.dbs.requirementsCollection.doc<Requirement>(`OR${newCorrelative}`);

            let data = {
              id: `OR${newCorrelative}`,
              correlative: newCorrelative,
              status: 'Enviado',
              product: this.data['form']['product'],
              color: this.data['form']['color'],
              quantity: this.data['form']['quantity'],
              description: this.data['form']['description'],
              image1: '',
              image2: '',
              file1: '',
              file2: '',
              regDate: Date.now(),
              createdBy: this.auth.userInteriores.displayName,
              createdByUid: this.auth.userInteriores.uid
            };

            t.set(this.requirementRef.ref, data);
            t.update(this.dbs.requirementCorrelativeDocument.ref, { correlative: newCorrelative });
          });
      }).then(() => {
        this.flags.created = true;
        this.storageUploading.next(true);
        
        if (this.data['image1']) {
          this.uploading1 = true;
          const file = this.data['image1'];
          const filePath = `/Ordenes de requerimiento/imágenes/${Date.now()}_${file.name}`;
          const fileRef = this.storage.ref(filePath);
          const task = this.storage.upload(filePath, file);

          this.uploadPercent1 = task.percentageChanges();

          task.snapshotChanges().pipe(
            finalize(() => {
              const downloadURL = fileRef.getDownloadURL();

              downloadURL.subscribe(url => {
                if (url) {
                  this.requirementRef
                    .update({ image1: url })
                    .then(() => {
                      this.flags.upload1 = true;
                      this.storageUploading.next(true);
                    })
                }
              })
            })
          )
            .subscribe()
        }

        if (this.data['image2']) {
          this.uploading2 = true;
          const file = this.data['image2'];
          const filePath = `/Ordenes de requerimiento/imágenes/${Date.now()}_${file.name}`;
          const fileRef = this.storage.ref(filePath);
          const task = this.storage.upload(filePath, file);

          this.uploadPercent2 = task.percentageChanges();

          task.snapshotChanges().pipe(
            finalize(() => {
              const downloadURL = fileRef.getDownloadURL();

              downloadURL.subscribe(url => {
                if (url) {
                  this.requirementRef
                    .update({ image2: url })
                    .then(() => {
                      this.flags.upload2 = true;
                      this.storageUploading.next(true);
                    })
                }
              })
            })
          )
            .subscribe()
        }

        if (this.data['file1']) {
          this.uploading3 = true;
          const file = this.data['file1'];
          const filePath = `/Ordenes de requerimiento/pdf/${Date.now()}_${file.name}`;
          const fileRef = this.storage.ref(filePath);
          const task = this.storage.upload(filePath, file);

          this.uploadPercent3 = task.percentageChanges();

          task.snapshotChanges().pipe(
            finalize(() => {
              const downloadURL = fileRef.getDownloadURL();

              downloadURL.subscribe(url => {
                if (url) {
                  this.requirementRef
                    .update({ file1: url })
                    .then(() => {
                      this.flags.upload3 = true;
                      this.storageUploading.next(true);
                    })
                }
              })
            })
          )
            .subscribe()
        }

        if (this.data['file2']) {
          this.uploading4 = true;
          const file = this.data['file2'];
          const filePath = `/Ordenes de requerimiento/pdf/${Date.now()}_${file.name}`;
          const fileRef = this.storage.ref(filePath);
          const task = this.storage.upload(filePath, file);

          this.uploadPercent4 = task.percentageChanges();

          task.snapshotChanges().pipe(
            finalize(() => {
              const downloadURL = fileRef.getDownloadURL();

              downloadURL.subscribe(url => {
                if (url) {
                  this.requirementRef
                    .update({ file2: url })
                    .then(() => {
                      this.flags.upload4 = true;
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

  }

}
