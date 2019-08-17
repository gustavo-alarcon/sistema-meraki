import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { User } from 'src/app/core/types';
import { DatabaseService } from 'src/app/core/database.service';
import { AuthService } from 'src/app/core/auth.service';
import { MatSnackBar, MatDialog, MatDialogRef } from '@angular/material';
import { startWith, map, tap, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-stores-create-confirm',
  templateUrl: './stores-create-confirm.component.html',
  styles: []
})
export class StoresCreateConfirmComponent implements OnInit, OnDestroy {

  loading = false;

  dataFormGroup: FormGroup;

  duplicate = {
    name: false,
    nameLoading: false,
  }

  filteredUsers: Observable<User[]>

  subscriptions: Array<Subscription> = [];

  constructor(
    private fb: FormBuilder,
    public dbs: DatabaseService,
    public auth: AuthService,
    private snackbar: MatSnackBar,
    private dialogRef: MatDialogRef<StoresCreateConfirmComponent>
  ) { }

  ngOnInit() {
    this.createForm();

    this.filteredUsers = this.dataFormGroup.get('supervisor').valueChanges
      .pipe(
        startWith<any>(''),
        map(value => typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase()),
        map(name => name ? this.dbs.users.filter(option => option['displayName'].toLowerCase().includes(name)) : this.dbs.users)
      );

    const name$ =
      this.dataFormGroup.get('name').valueChanges
        .pipe(
          tap(() => {
            this.duplicate.nameLoading = true;
          }),
          debounceTime(500),
          tap(res => {

            this.duplicate.name = false;
            const find = this.dbs.stores.filter(option => option.name === res);

            if (find.length > 0) {
              this.duplicate.nameLoading = false;
              this.duplicate.name = true;
              this.snackbar.open('Nombre duplicado', 'Cerrar', {
                duration: 4000
              });
            } else {
              this.duplicate.nameLoading = false;
            }
          })
        ).subscribe()

    this.subscriptions.push(name$);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  showSupervisor(supervisor: User): string | null {
    return supervisor ? supervisor.displayName : null
  }

  createForm(): void {
    this.dataFormGroup = this.fb.group({
      name: [null, [Validators.required]],
      address: [null, [Validators.required]],
      supervisor: [null, [Validators.required]]
    })
  }

  create(): void {
    if (this.dataFormGroup.valid) {
      this.loading = true;

      const data = {
        id: '',
        regDate: Date.now(),
        createdBy: this.auth.userInteriores.displayName,
        createdByUid: this.auth.userInteriores.uid,
        lastUpdateBy: '',
        lastUpdateByUid: ''
      }

      const finalData = Object.assign(this.dataFormGroup.value, data);

      this.dbs.storesCollection
        .add(finalData)
        .then(ref => {
          ref.update({ id: ref.id });
          this.loading = false;
          this.snackbar.open(`Tienda ${this.dataFormGroup.value['name']} creada`, 'Cerrar', {
            duration: 6000
          });
          this.dialogRef.close(true);
        })
        .catch(err => {
          this.loading = false;
          this.snackbar.open('Hubo un error grabando el documento', 'Cerrar', {
            duration: 6000
          });
          console.log(err);
        })
    }

  }

}
