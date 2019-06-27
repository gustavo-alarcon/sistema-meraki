import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RequirementsListRoutingModule } from './requirements-list-routing.module';
import { RequirementsListComponent } from './requirements-list.component';

@NgModule({
  declarations: [
    RequirementsListComponent
  ],
  imports: [
    CommonModule,
    RequirementsListRoutingModule
  ],
  exports: [
    RequirementsListComponent
  ]
})
export class RequirementsListModule { }
