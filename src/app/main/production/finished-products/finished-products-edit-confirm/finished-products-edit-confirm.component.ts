import { Component, OnInit, Inject } from '@angular/core';
import { DatabaseService } from 'src/app/core/database.service';
import { AuthService } from 'src/app/core/auth.service';
import { MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Product } from 'src/app/core/types';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-finished-products-edit-confirm',
  templateUrl: './finished-products-edit-confirm.component.html',
  styles: []
})
export class FinishedProductsEditConfirmComponent implements OnInit {

  uploading: boolean = false;

  uploadPercent1: Observable<number>;
  uploading1: boolean = false;

  flags = {
    edited: false,
    image: false,
    serie: false
  }

  constructor(
    public dbs: DatabaseService,
    public auth: AuthService,
    private storage: AngularFireStorage,
    private snackbar: MatSnackBar,
    private dialogRef: MatDialogRef<FinishedProductsEditConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { product: Product, form: any, image: any }
  ) { }

  ngOnInit() {
  }

  save(): void {
    this.uploading = true;

    this.checkForNewCategory(this.data['form']['category']);

    const data = {
      lastUpdateBy: this.auth.userInteriores.displayName,
      lastUpdateByUid: this.auth.userInteriores.uid,
    }

    const finalData = Object.assign(data, this.data['form']);

    this.dbs.finishedProductsCollection.doc(this.data.product.id)
      .update(finalData)
      .then(() => {
        this.uploading = false;
        this.flags.serie = true;
        this.snackbar.open('Producto actualizado!', 'Cerrar', {
          duration: 6000
        });
        this.dialogRef.close(true);
      })
      .catch(err => {
        this.uploading = false;
        this.snackbar.open('Hubo un error actualizando el documento', 'Cerrar', {
          duration: 6000
        });
        console.log(err);
      })

    if (this.data.image) {
      this.uploading1 = true;
      const file = this.data.image;
      const filePath = `/Productos acabados/${Date.now()}_${file.name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, file);

      this.uploadPercent1 = task.percentageChanges();

      task.snapshotChanges().pipe(
        finalize(() => {
          const downloadURL = fileRef.getDownloadURL();

          downloadURL.subscribe(url => {
            if (url) {

              this.dbs.finishedProductsCollection.doc(this.data.product.id)
                .update({ image: url })
                .then(() => {
                  this.flags.image = true;
                  this.uploading = false;
                  this.snackbar.open('Imagen actualizada!', 'Cerrar', {
                    duration: 6000
                  });
                  this.dialogRef.close(true);
                })
            }
          })
        })
      )
        .subscribe()
    }
  }

  checkForNewCategory(category: string): void {
    const ref = typeof category;
    if (ref === 'string') {
      const find = this.dbs.categories.filter(option => option.name === category);

      if (find.length === 0) {
        const data = {
          id: '',
          name: category,
          source: 'product',
          regDate: Date.now()
        }

        this.dbs.categoriesCollection
          .add(data)
          .then(ref => {
            ref.update({ id: ref.id });
            this.snackbar.open('Nueva categoría agregada!', 'Cerrar', {
              duration: 4000
            });
          })
          .catch(err => {
            this.snackbar.open('Error creando nueva categoría', 'Cerrar', {
              duration: 4000
            });
            console.log(err);
          })
      }
    }
  }

}
