import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { RequirementsRoutingModule } from './requirements-routing.module';
import { RequirementsComponent } from './requirements.component';

import {MatTabsModule} from '@angular/material/tabs';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
  declarations: [
    RequirementsComponent
  ],
  imports: [
    CommonModule,
    RequirementsRoutingModule,
    RouterModule,
    MatTabsModule,
    MatGridListModule,
    MatIconModule
  ],
  exports: [
    RequirementsComponent
  ]
})
export class RequirementsModule { }
