import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ProductionListRoutingModule } from './production-list-routing.module';
import { ProductionListComponent } from './production-list.component';

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
    ProductionListComponent
  ],
  imports: [
    CommonModule,
    ProductionListRoutingModule,
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
  ]
})
export class ProductionListModule { }
