import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProdOrdersRoutingModule } from './prod-orders-routing.module';
import { ProdOrdersComponent } from './prod-orders.component';
import { ProdOrdersGenerateOPConfirmComponent } from './prod-orders-generate-op-confirm/prod-orders-generate-op-confirm.component';
import { MatFormFieldModule, MatIconModule, MatInputModule, MatButtonModule, MatAutocompleteModule, MatCheckboxModule, MatTooltipModule, MatDividerModule, MatTableModule, MatPaginatorModule, MatSortModule, MatDialogModule, MatSnackBarModule, MatProgressSpinnerModule, MatProgressBarModule, MatMenuModule, MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ProdOrdersComponent,
    ProdOrdersGenerateOPConfirmComponent
  ],
  imports: [
    CommonModule,
    ProdOrdersRoutingModule,
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
    ProdOrdersGenerateOPConfirmComponent
  ]
})
export class ProdOrdersModule { }
