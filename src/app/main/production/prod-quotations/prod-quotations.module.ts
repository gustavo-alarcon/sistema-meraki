import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProdQuotationsRoutingModule } from './prod-quotations-routing.module';
import { ProdQuotationsComponent } from './prod-quotations.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatIconModule, MatInputModule, MatButtonModule, MatAutocompleteModule, MatCheckboxModule, MatTooltipModule, MatDividerModule, MatTableModule, MatPaginatorModule, MatSortModule, MatDialogModule, MatSnackBarModule, MatProgressSpinnerModule, MatProgressBarModule, MatMenuModule, MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import { ProdQuotationsEditDialogComponent } from './prod-quotations-edit-dialog/prod-quotations-edit-dialog.component';

@NgModule({
  declarations: [
    ProdQuotationsComponent,
    ProdQuotationsEditDialogComponent
  ],
  imports: [
    CommonModule,
    ProdQuotationsRoutingModule,
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
    
  ]
})
export class ProdQuotationsModule { }
