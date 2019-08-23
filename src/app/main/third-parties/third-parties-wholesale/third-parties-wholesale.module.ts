import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ThirdPartiesWholesaleRoutingModule } from './third-parties-wholesale-routing.module';
import { ThirdPartiesWholesaleComponent } from './third-parties-wholesale.component';

@NgModule({
  declarations: [ThirdPartiesWholesaleComponent],
  imports: [
    CommonModule,
    ThirdPartiesWholesaleRoutingModule
  ]
})
export class ThirdPartiesWholesaleModule { }
