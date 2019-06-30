import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersFormRoutingModule } from './orders-form-routing.module';
import { OrdersFormSaveDialogComponent } from './orders-form-save-dialog/orders-form-save-dialog.component';

@NgModule({
  declarations: [OrdersFormSaveDialogComponent],
  imports: [
    CommonModule,
    OrdersFormRoutingModule
  ]
})
export class OrdersFormModule { }
