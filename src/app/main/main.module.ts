import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { MenuModule } from './menu/menu.module';
import { RequirementsModule } from './sales/requirements/requirements.module';
import { OrdersModule } from './sales/orders/orders.module';
import { ShoppingModule } from './sales/shopping/shopping.module';

@NgModule({
  declarations: [
    MainComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    MenuModule
  ]
})
export class MainModule { }
