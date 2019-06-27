import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RequirementsRoutingModule } from './requirements-routing.module';
import { RequirementsComponent } from './requirements.component';
import { RequirementsListComponent } from './requirements-list/requirements-list.component';
import { RequirementsFormComponent } from './requirements-form/requirements-form.component';

@NgModule({
  declarations: [
    RequirementsComponent
  ],
  imports: [
    CommonModule,
    RequirementsRoutingModule,
  ],
  exports: [
    RequirementsComponent
  ]
})
export class RequirementsModule { }
