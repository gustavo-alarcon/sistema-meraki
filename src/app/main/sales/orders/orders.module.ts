import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersRoutingModule } from './orders-routing.module';
import { OrdersComponent } from './orders.component';
import { OrdersFormComponent } from './orders-form/orders-form.component';
import { OrdersListComponent } from './orders-list/orders-list.component';

@NgModule({
  declarations: [OrdersComponent, OrdersFormComponent, OrdersListComponent],
  imports: [
    CommonModule,
    OrdersRoutingModule
  ]
})
export class OrdersModule { }
