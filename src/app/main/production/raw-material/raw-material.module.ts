import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RawMaterialRoutingModule } from './raw-material-routing.module';
import { RawMaterialComponent } from './raw-material.component';
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
          MatSnackBarModule} from '@angular/material';



@NgModule({
  declarations: [
    RawMaterialComponent
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
    MatSnackBarModule
  ]
})
export class RawMaterialModule { }
