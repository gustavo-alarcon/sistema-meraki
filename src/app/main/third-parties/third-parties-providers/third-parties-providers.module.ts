import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ThirdPartiesProvidersRoutingModule } from './third-parties-providers-routing.module';
import { ThirdPartiesProvidersComponent } from './third-parties-providers.component';

@NgModule({
  declarations: [ThirdPartiesProvidersComponent],
  imports: [
    CommonModule,
    ThirdPartiesProvidersRoutingModule
  ]
})
export class ThirdPartiesProvidersModule { }
