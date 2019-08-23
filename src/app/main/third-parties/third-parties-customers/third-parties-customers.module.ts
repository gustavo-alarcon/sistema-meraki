import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ThirdPartiesCustomersRoutingModule } from './third-parties-customers-routing.module';
import { ThirdPartiesCustomersComponent } from './third-parties-customers.component';

@NgModule({
  declarations: [ThirdPartiesCustomersComponent],
  imports: [
    CommonModule,
    ThirdPartiesCustomersRoutingModule
  ]
})
export class ThirdPartiesCustomersModule { }
