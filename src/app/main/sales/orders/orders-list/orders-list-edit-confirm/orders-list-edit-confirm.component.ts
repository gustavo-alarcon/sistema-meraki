import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { Correlative, Order } from 'src/app/core/types';
import { AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { DatabaseService } from 'src/app/core/database.service';
import { AuthService } from 'src/app/core/auth.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { OrdersFormSaveDialogComponent } from '../../orders-form/orders-form-save-dialog/orders-form-save-dialog.component';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-orders-list-edit-confirm',
  templateUrl: './orders-list-edit-confirm.component.html',
  styles: []
})
export class OrdersListEditConfirmComponent implements OnInit, OnDestroy {

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

  documentCorrelative$: Correlative;
  orderCorrelative$: Correlative;
  currentCorrelative: number = null;

  storageUploading = new BehaviorSubject<boolean>(false);
  currentStorageUploading = this.storageUploading.asObservable();
  totalFiles: number = 1;
  filesCount: number = 0;

  orderRef: AngularFirestoreDocument;

  subscriptions: Array<Subscription> = [];

  constructor(
    public dbs: DatabaseService,
    public auth: AuthService,
    private storage: AngularFireStorage,
    private af: AngularFirestore,
    private dialogRef: MatDialogRef<OrdersFormSaveDialogComponent>,
    private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { form: any, order: Order, image1: any, image2: any, file1: any, file2: any }
  ) { }

  ngOnInit() {
    this.checkNumberOfFiles();

    const storage$ =
      this.currentStorageUploading.subscribe(res => {
        if (res) {
          this.filesCount++;
          if (this.filesCount === this.totalFiles) {
            this.uploading = false;
            this.snackbar.open(`Order de Pedido #${this.data.order.correlative} editada!`, 'Cerrar', {
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

    let data = {
      document: this.data['form']['document'],
      documentCorrelative: this.data['form']['documentCorrelative'],
      deliveryDate: this.data['form']['deliveryDate'].valueOf(),
      quantity: this.data['form']['quantity'],
      description: this.data['form']['description']
    };

    this.dbs.ordersCollection
      .doc(this.data.order.id)
      .update(data)
      .then(() => {
        this.flags.created = true;
        this.storageUploading.next(true);
      })
      .catch(err => {
        this.snackbar.open(`Hubo un error actualizando el documento`, 'Cerrar', {
          duration: 6000
        });
        console.log(err);
      });

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
              this.dbs.ordersCollection
                .doc(this.data.order.id)
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
              this.dbs.ordersCollection
                .doc(this.data.order.id)
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
              this.dbs.ordersCollection
                .doc(this.data.order.id)
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
              this.dbs.ordersCollection
                .doc(this.data.order.id)
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
  }

}
