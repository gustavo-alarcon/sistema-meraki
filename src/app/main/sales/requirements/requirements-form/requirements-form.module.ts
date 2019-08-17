import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RequirementsFormRoutingModule } from './requirements-form-routing.module';
import { RequirementsFormComponent } from './requirements-form.component';
import { RequirementFormSaveDialogComponent } from './requirement-form-save-dialog/requirement-form-save-dialog.component';
import { Ng2ImgMaxModule } from 'ng2-img-max';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@NgModule({
  declarations: [
    RequirementsFormComponent,
    RequirementFormSaveDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RequirementsFormRoutingModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatSnackBarModule,
    MatDialogModule,
    MatProgressBarModule,
    Ng2ImgMaxModule
  ],
  exports: [
    RequirementsFormComponent
  ],
  entryComponents: [
    RequirementFormSaveDialogComponent
  ]
})
export class RequirementsFormModule { }
