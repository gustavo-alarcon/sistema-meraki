import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DebtsToPayRoutingModule } from './debts-to-pay-routing.module';
import { DebtsToPayComponent } from './debts-to-pay.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatIconModule, MatInputModule, MatButtonModule, MatAutocompleteModule, MatCheckboxModule, MatTooltipModule, MatDividerModule, MatTableModule, MatPaginatorModule, MatSortModule, MatDialogModule, MatSnackBarModule, MatProgressSpinnerModule, MatProgressBarModule, MatMenuModule, MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import { DebtsToPayShowItemsDialogComponent } from './debts-to-pay-show-items-dialog/debts-to-pay-show-items-dialog.component';
import { DebtsToPayPayDialogComponent } from './debts-to-pay-pay-dialog/debts-to-pay-pay-dialog.component';
import { DebtsToPayPartialPayDialogComponent } from './debts-to-pay-partial-pay-dialog/debts-to-pay-partial-pay-dialog.component';

@NgModule({
  declarations: [
    DebtsToPayComponent,
    DebtsToPayShowItemsDialogComponent,
    DebtsToPayPayDialogComponent,
    DebtsToPayPartialPayDialogComponent
  ],
  imports: [
    CommonModule,
    DebtsToPayRoutingModule,
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
    DebtsToPayShowItemsDialogComponent,
    DebtsToPayPayDialogComponent,
    DebtsToPayPartialPayDialogComponent
  ]
})
export class DebtsToPayModule { }
