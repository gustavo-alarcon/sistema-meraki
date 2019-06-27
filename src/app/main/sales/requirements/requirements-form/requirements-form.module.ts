import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RequirementsFormRoutingModule } from './requirements-form-routing.module';
import { RequirementsFormComponent } from './requirements-form.component';

@NgModule({
  declarations: [
    RequirementsFormComponent
  ],
  imports: [
    CommonModule,
    RequirementsFormRoutingModule
  ],
  exports: [
    RequirementsFormComponent
  ]
})
export class RequirementsFormModule { }
