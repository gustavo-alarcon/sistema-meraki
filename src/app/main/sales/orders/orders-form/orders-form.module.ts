import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { OrdersFormRoutingModule } from './orders-form-routing.module';
import { OrdersFormComponent } from './orders-form.component';
import { OrdersFormSaveDialogComponent } from './orders-form-save-dialog/orders-form-save-dialog.component';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatNativeDateModule } from '@angular/material';
import { MatDatepickerModule } from '@angular/material/datepicker';


@NgModule({
  declarations: [
    OrdersFormComponent,
    OrdersFormSaveDialogComponent
  ],
  imports: [
    CommonModule,
    OrdersFormRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatSnackBarModule,
    MatDialogModule,
    MatProgressBarModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  exports: [
    OrdersFormComponent
  ],
  entryComponents: [
    OrdersFormSaveDialogComponent
  ]
})
export class OrdersFormModule { }
