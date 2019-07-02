import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersListRoutingModule } from './orders-list-routing.module';
import { OrdersListEditConfirmComponent } from './orders-list-edit-confirm/orders-list-edit-confirm.component';
import { OrdersListEditDialogComponent } from './orders-list-edit-dialog/orders-list-edit-dialog.component';
import { OrdersListCancelConfirmComponent } from './orders-list-cancel-confirm/orders-list-cancel-confirm.component';
import { OrdersListComponent } from './orders-list.component';

import {
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
} from '@angular/material';
import { OrdersListRestoreConfirmComponent } from './orders-list-restore-confirm/orders-list-restore-confirm.component';

@NgModule({
  declarations: [
    OrdersListComponent,
    OrdersListEditConfirmComponent,
    OrdersListEditDialogComponent,
    OrdersListCancelConfirmComponent,
    OrdersListRestoreConfirmComponent
  ],
  imports: [
    CommonModule,
    OrdersListRoutingModule,
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
    OrdersListEditConfirmComponent,
    OrdersListEditDialogComponent,
    OrdersListCancelConfirmComponent,
    OrdersListRestoreConfirmComponent
  ]
})
export class OrdersListModule { }
