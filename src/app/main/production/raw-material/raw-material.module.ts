import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RawMaterialRoutingModule } from './raw-material-routing.module';
import { RawMaterialComponent } from './raw-material.component';
import { RawMaterialCreateDialogComponent } from './raw-material-create-dialog/raw-material-create-dialog.component';

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
          MatProgressBarModule} from '@angular/material';


@NgModule({
  declarations: [
    RawMaterialComponent,
    RawMaterialCreateDialogComponent
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
    MatProgressBarModule
  ],
  entryComponents: [
    RawMaterialCreateDialogComponent
  ]
})
export class RawMaterialModule { }
