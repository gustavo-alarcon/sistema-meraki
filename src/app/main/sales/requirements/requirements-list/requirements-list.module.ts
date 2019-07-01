import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RequirementsListRoutingModule } from './requirements-list-routing.module';
import { RequirementsListComponent } from './requirements-list.component';
import { RequirementsListEditDialogComponent } from './requirements-list-edit-dialog/requirements-list-edit-dialog.component';
import { RequirementsListDeleteConfirmComponent } from './requirements-list-delete-confirm/requirements-list-delete-confirm.component';
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
          MatMenuModule} from '@angular/material';

@NgModule({
  declarations: [
    RequirementsListComponent,
    RequirementsListEditDialogComponent,
    RequirementsListDeleteConfirmComponent,
    RequirementsListEditConfirmComponent
  ],
  imports: [
    CommonModule,
    RequirementsListRoutingModule,
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
    MatMenuModule
  ],
  exports: [
    RequirementsListComponent,
    RequirementsListEditDialogComponent,
    RequirementsListDeleteConfirmComponent,
    RequirementsListEditConfirmComponent
  ]
})
export class RequirementsListModule { }
