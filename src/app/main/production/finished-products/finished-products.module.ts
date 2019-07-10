import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FinishedProductsRoutingModule } from './finished-products-routing.module';
import { FinishedProductsComponent } from './finished-products.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatIconModule, MatInputModule, MatButtonModule, MatAutocompleteModule, MatCheckboxModule, MatTooltipModule, MatDividerModule, MatTableModule, MatPaginatorModule, MatSortModule, MatDialogModule, MatSnackBarModule, MatProgressSpinnerModule, MatProgressBarModule, MatMenuModule } from '@angular/material';
import { FinishedProductsCreateDialogComponent } from './finished-products-create-dialog/finished-products-create-dialog.component';
import { FinishedProductsCreateConfirmComponent } from './finished-products-create-confirm/finished-products-create-confirm.component';
import { FinishedProductsShowSerieDialogComponent } from './finished-products-show-serie-dialog/finished-products-show-serie-dialog.component';
import { FinishedProductsChangeStatusConfirmComponent } from './finished-products-change-status-confirm/finished-products-change-status-confirm.component';
import { FinishedProductsAddStockDialogComponent } from './finished-products-add-stock-dialog/finished-products-add-stock-dialog.component';
import { FinishedProductsDeleteConfirmComponent } from './finished-products-delete-confirm/finished-products-delete-confirm.component';
import { FinishedProductsAddStockConfirmComponent } from './finished-products-add-stock-confirm/finished-products-add-stock-confirm.component';
import { FinishedProductsEditDialogComponent } from './finished-products-edit-dialog/finished-products-edit-dialog.component';
import { FinishedProductsEditConfirmComponent } from './finished-products-edit-confirm/finished-products-edit-confirm.component';

@NgModule({
  declarations: [
    FinishedProductsComponent,
    FinishedProductsCreateDialogComponent,
    FinishedProductsCreateConfirmComponent,
    FinishedProductsShowSerieDialogComponent,
    FinishedProductsChangeStatusConfirmComponent,
    FinishedProductsAddStockDialogComponent,
    FinishedProductsDeleteConfirmComponent,
    FinishedProductsAddStockConfirmComponent,
    FinishedProductsEditDialogComponent,
    FinishedProductsEditConfirmComponent
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
  ],
  entryComponents: [
    FinishedProductsCreateDialogComponent,
    FinishedProductsCreateConfirmComponent,
    FinishedProductsShowSerieDialogComponent,
    FinishedProductsChangeStatusConfirmComponent,
    FinishedProductsAddStockDialogComponent,
    FinishedProductsDeleteConfirmComponent,
    FinishedProductsAddStockConfirmComponent
  ]
})
export class FinishedProductsModule { }
