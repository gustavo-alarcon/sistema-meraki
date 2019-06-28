import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RequirementsFormRoutingModule } from './requirements-form-routing.module';
import { RequirementsFormComponent } from './requirements-form.component';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    RequirementsFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RequirementsFormRoutingModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ],
  exports: [
    RequirementsFormComponent
  ]
})
export class RequirementsFormModule { }
