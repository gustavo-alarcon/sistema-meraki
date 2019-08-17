import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { RequirementsListRoutingModule } from './requirements-list-routing.module';
import { RequirementsListComponent } from './requirements-list.component';
import { RequirementsListEditDialogComponent } from './requirements-list-edit-dialog/requirements-list-edit-dialog.component';
import { RequirementsListCancelConfirmComponent } from './requirements-list-cancel-confirm/requirements-list-cancel-confirm.component';
import { RequirementsListEditConfirmComponent } from './requirements-list-edit-confirm/requirements-list-edit-confirm.component';
import {  MatFormFieldModule,
          MatIconModule,
          MatInputModule,
          MatButtonModule,
          MatAutocompleteModule,
          MatCheckboxModule,
          MatTooltipModule,
          MatDividerModule,
          MatTableModule,
          MatPaginatorModule,
          MatSortModule,
          MatDialogModule,
          MatSnackBarModule,
          MatProgressSpinnerModule,
          MatProgressBarModule,
          MatMenuModule,
          MatDatepickerModule,
          MatNativeDateModule} from '@angular/material';
import { RequirementsListRestoreConfirmComponent } from './requirements-list-restore-confirm/requirements-list-restore-confirm.component';

@NgModule({
  declarations: [
    RequirementsListComponent,
    RequirementsListEditDialogComponent,
    RequirementsListEditConfirmComponent,
    RequirementsListCancelConfirmComponent,
    RequirementsListRestoreConfirmComponent
  ],
  imports: [
    CommonModule,
    RequirementsListRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatDividerModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatMenuModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  entryComponents: [
    RequirementsListEditDialogComponent,
    RequirementsListEditConfirmComponent,
    RequirementsListCancelConfirmComponent,
    RequirementsListRestoreConfirmComponent
  ]
})
export class RequirementsListModule { }
