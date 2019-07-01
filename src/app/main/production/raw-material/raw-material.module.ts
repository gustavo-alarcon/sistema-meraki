import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RawMaterialRoutingModule } from './raw-material-routing.module';
import { RawMaterialComponent } from './raw-material.component';
import { RawMaterialCreateDialogComponent } from './raw-material-create-dialog/raw-material-create-dialog.component';
import { RawMaterialAddStockDialogComponent } from './raw-material-add-stock-dialog/raw-material-add-stock-dialog.component';
import { RawMaterialAddStockConfirmComponent } from './raw-material-add-stock-confirm/raw-material-add-stock-confirm.component';
import { RawMaterialEditDialogComponent } from './raw-material-edit-dialog/raw-material-edit-dialog.component';
import { RawMaterialEditConfirmComponent } from './raw-material-edit-confirm/raw-material-edit-confirm.component';
import { RawMaterialDeleteConfirmComponent } from './raw-material-delete-confirm/raw-material-delete-confirm.component';

import {  MatInputModule,
          MatButtonModule,
          MatAutocompleteModule,
          MatCheckboxModule,
          MatTooltipModule,
          MatDividerModule,
          MatTableModule,
          MatPaginatorModule,
          MatSortModule,
          MatFormFieldModule,
          MatIconModule,
          MatDialogModule,
          MatSnackBarModule,
          MatProgressSpinnerModule,
          MatProgressBarModule,
          MatMenuModule} from '@angular/material';



@NgModule({
  declarations: [
    RawMaterialComponent,
    RawMaterialCreateDialogComponent,
    RawMaterialAddStockDialogComponent,
    RawMaterialAddStockConfirmComponent,
    RawMaterialEditDialogComponent,
    RawMaterialEditConfirmComponent,
    RawMaterialDeleteConfirmComponent
  ],
  imports: [
    CommonModule,
    RawMaterialRoutingModule,
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
    MatMenuModule
  ],
  entryComponents: [
    RawMaterialCreateDialogComponent,
    RawMaterialAddStockDialogComponent,
    RawMaterialAddStockConfirmComponent,
    RawMaterialEditDialogComponent,
    RawMaterialEditConfirmComponent,
    RawMaterialDeleteConfirmComponent
  ]
})
export class RawMaterialModule { }
