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
          MatMenuModule,
          MatNativeDateModule,
          MatDatepickerModule} from '@angular/material';
import { ProductionListProduceOpeConfirmComponent } from './production-list-produce-ope-confirm/production-list-produce-ope-confirm.component';
import { ProductionListEditOrderConfirmComponent } from './production-list-edit-order-confirm/production-list-edit-order-confirm.component';


@NgModule({
  declarations: [
    ProductionListComponent,
    ProductionListProduceOpeConfirmComponent,
    ProductionListEditOrderConfirmComponent
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
    MatMenuModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  entryComponents: [
    ProductionListProduceOpeConfirmComponent,
    ProductionListEditOrderConfirmComponent
  ]
})
export class ProductionListModule { }
