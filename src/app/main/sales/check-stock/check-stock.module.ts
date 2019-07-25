import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CheckStockRoutingModule } from './check-stock-routing.module';
import { CheckStockComponent } from './check-stock.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatIconModule, MatInputModule, MatButtonModule, MatAutocompleteModule, MatCheckboxModule, MatTooltipModule, MatDividerModule, MatTableModule, MatPaginatorModule, MatSortModule, MatDialogModule, MatSnackBarModule, MatProgressSpinnerModule, MatProgressBarModule, MatMenuModule, MatSelectModule } from '@angular/material';
import { CheckStockSellDialogComponent } from './check-stock-sell-dialog/check-stock-sell-dialog.component';
import { CheckStockTransferDialogComponent } from './check-stock-transfer-dialog/check-stock-transfer-dialog.component';

@NgModule({
  declarations: [
    CheckStockComponent,
    CheckStockSellDialogComponent,
    CheckStockTransferDialogComponent
  ],
  imports: [
    CommonModule,
    CheckStockRoutingModule,
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
    MatSelectModule
  ],
  entryComponents: [
    CheckStockSellDialogComponent,
    CheckStockTransferDialogComponent
  ]
})
export class CheckStockModule { }
