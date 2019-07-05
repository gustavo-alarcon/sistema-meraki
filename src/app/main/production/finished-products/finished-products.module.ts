import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FinishedProductsRoutingModule } from './finished-products-routing.module';
import { FinishedProductsComponent } from './finished-products.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatIconModule, MatInputModule, MatButtonModule, MatAutocompleteModule, MatCheckboxModule, MatTooltipModule, MatDividerModule, MatTableModule, MatPaginatorModule, MatSortModule, MatDialogModule, MatSnackBarModule, MatProgressSpinnerModule, MatProgressBarModule, MatMenuModule } from '@angular/material';

@NgModule({
  declarations: [
    FinishedProductsComponent
  ],
  imports: [
    CommonModule,
    FinishedProductsRoutingModule,
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
export class FinishedProductsModule { }
