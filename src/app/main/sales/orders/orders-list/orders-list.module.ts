import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { OrdersListRoutingModule } from './orders-list-routing.module';
import { OrdersListEditConfirmComponent } from './orders-list-edit-confirm/orders-list-edit-confirm.component';
import { OrdersListEditDialogComponent } from './orders-list-edit-dialog/orders-list-edit-dialog.component';
import { OrdersListCancelConfirmComponent } from './orders-list-cancel-confirm/orders-list-cancel-confirm.component';
import { OrdersListComponent } from './orders-list.component';
import { OrdersListRestoreConfirmComponent } from './orders-list-restore-confirm/orders-list-restore-confirm.component';

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
  MatMenuModule,
  MatDatepickerModule,
  MatNativeDateModule
} from '@angular/material';


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
    OrdersListEditConfirmComponent,
    OrdersListEditDialogComponent,
    OrdersListCancelConfirmComponent,
    OrdersListRestoreConfirmComponent
  ]
})
export class OrdersListModule { }
