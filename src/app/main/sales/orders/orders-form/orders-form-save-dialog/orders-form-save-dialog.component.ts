import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from 'src/app/core/auth.service';
import { DatabaseService } from 'src/app/core/database.service';
import { AngularFirestoreDocument } from '@angular/fire/firestore';
import { Correlative, Order, Quotation, Transaction } from './../../../../../core/types';
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-orders-form-save-dialog',
  templateUrl: './orders-form-save-dialog.component.html',
  styles: []
})
export class OrdersFormSaveDialogComponent implements OnInit, OnDestroy {

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
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.checkNumberOfFiles();

    const storage$ =
      this.currentStorageUploading.subscribe(res => {
        if (res) {
          this.filesCount++;
          if (this.filesCount === this.totalFiles) {
            this.uploading = false;
            this.snackbar.open(`Order de Pedido #${this.currentCorrelative} creada`, 'Cerrar', {
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
        return t.get(this.dbs.orderCorrelativeDocument.ref)
          .then(doc => {
            let newCorrelative = doc.data().correlative + 1;
            this.currentCorrelative = newCorrelative;
            this.orderRef = this.dbs.ordersCollection.doc<Order>(`OPe${newCorrelative}`);

            const cashPath = this.dbs.cashListCollection.doc(this.data['form']['cash'].id).ref.path;
            const currentOpeningId = this.data['form']['cash']['currentOpening'];
            let transactionDoc = this.af.firestore.collection(cashPath + '/openings/' + currentOpeningId + '/transactions').doc();

            if (this.data['form']['quotation']) {
              let quoteRef = this.dbs.quotationsCollection.doc<Quotation>(this.data['form']['quotation']['id']).ref;
              t.update(quoteRef, { status: 'Referenciada', orderReference: newCorrelative });
            }

            let data = {
              id: `OPe${newCorrelative}`,
              correlative: newCorrelative,
              status: 'Enviado',
              quotationCorrelative: this.data['form']['quotation'] ? this.data['form']['quotation']['correlative'] : '',
              orderNote: this.data['form']['orderNote'],
              document: this.data['form']['document'],
              documentSerial: this.data['form']['documentSerial'],
              documentCorrelative: this.data['form']['documentCorrelative'],
              deliveryDate: this.data['form']['deliveryDate'].valueOf(),
              color: '',
              quantity: this.data['form']['quantity'],
              totalImport: this.data['form']['totalImport'],
              paidImport: this.data['form']['paidImport'],
              indebtImport: this.data['form']['indebtImport'],
              cash: this.data['form']['cash'],
              description: this.data['form']['description'],
              image1: this.data['imageSrc1'],
              image2: this.data['imageSrc2'],
              file1: this.data['pdf1'],
              file2: this.data['pdf2'],
              regDate: Date.now(),
              createdBy: this.auth.userInteriores.displayName,
              createdByUid: this.auth.userInteriores.uid
            };

            let cashData = {
              id: transactionDoc.id,
              type: 'PEDIDO',
              description: `${this.data['form']['document'].name}-${this.data['form']['documentSerial']}-${this.data['form']['documentCorrelative']} #Pedido: ${this.data['form']['orderNote']}`,
              import: this.data['form']['paidImport'],
              debt: this.data['form']['indebtImport'],
              user: this.auth.userInteriores,
              verified: false,
              status: 'Grabado',
              ticketType: 'PEDIDO',
              paymentType: 'EFECTIVO',
              lastEditBy: null,
              lastEditUid: null,
              lastEditDate: null,
              approvedBy: null,
              approvedByUid: null,
              approvedDate: null,
              regDate: Date.now()
            }

            t.set(transactionDoc, cashData)
            t.set(this.orderRef.ref, data);
            t.update(this.dbs.orderCorrelativeDocument.ref, { correlative: newCorrelative });

          });
      }).then(() => {
        this.flags.created = true;
        this.storageUploading.next(true);

        if (this.data['image1']) {
          this.uploading1 = true;
          const file = this.data['image1'];
          const filePath = `/Ordenes de pedido/imágenes/${Date.now()}_${file.name}`;
          const fileRef = this.storage.ref(filePath);
          const task = this.storage.upload(filePath, file);

          this.uploadPercent1 = task.percentageChanges();

          task.snapshotChanges().pipe(
            finalize(() => {
              const downloadURL = fileRef.getDownloadURL();

              downloadURL.subscribe(url => {
                if (url) {
                  this.orderRef
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
          const filePath = `/Ordenes de pedido/imágenes/${Date.now()}_${file.name}`;
          const fileRef = this.storage.ref(filePath);
          const task = this.storage.upload(filePath, file);

          this.uploadPercent2 = task.percentageChanges();

          task.snapshotChanges().pipe(
            finalize(() => {
              const downloadURL = fileRef.getDownloadURL();

              downloadURL.subscribe(url => {
                if (url) {
                  this.orderRef
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
          const filePath = `/Ordenes de pedido/pdf/${Date.now()}_${file.name}`;
          const fileRef = this.storage.ref(filePath);
          const task = this.storage.upload(filePath, file);

          this.uploadPercent3 = task.percentageChanges();

          task.snapshotChanges().pipe(
            finalize(() => {
              const downloadURL = fileRef.getDownloadURL();

              downloadURL.subscribe(url => {
                if (url) {
                  this.orderRef
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
          const filePath = `/Ordenes de pedido/pdf/${Date.now()}_${file.name}`;
          const fileRef = this.storage.ref(filePath);
          const task = this.storage.upload(filePath, file);

          this.uploadPercent4 = task.percentageChanges();

          task.snapshotChanges().pipe(
            finalize(() => {
              const downloadURL = fileRef.getDownloadURL();

              downloadURL.subscribe(url => {
                if (url) {
                  this.orderRef
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
        this.snackbar.open('Hubo un error creando el pedido!', 'Cerrar', {
          duration: 6000
        });
        console.log('Transaction failure:', err);
      });
  }

}
