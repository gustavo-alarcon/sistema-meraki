import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProdRequirementsRoutingModule } from './prod-requirements-routing.module';
import { ProdRequirementsComponent } from './prod-requirements.component';
import { ProdRequirementsRejectConfirmComponent } from './prod-requirements-reject-confirm/prod-requirements-reject-confirm.component';
import { ProdRequirementsRestoreConfirmComponent } from './prod-requirements-restore-confirm/prod-requirements-restore-confirm.component';
import { ProdRequirementsApproveConfirmComponent } from './prod-requirements-approve-confirm/prod-requirements-approve-confirm.component';
import { MatFormFieldModule, MatIconModule, MatInputModule, MatButtonModule, MatAutocompleteModule, MatCheckboxModule, MatTooltipModule, MatDividerModule, MatTableModule, MatPaginatorModule, MatSortModule, MatDialogModule, MatSnackBarModule, MatProgressSpinnerModule, MatProgressBarModule, MatMenuModule } from '@angular/material';

@NgModule({
  declarations: [
    ProdRequirementsComponent,
    ProdRequirementsRejectConfirmComponent,
    ProdRequirementsRestoreConfirmComponent,
    ProdRequirementsApproveConfirmComponent
  ],
  imports: [
    CommonModule,
    ProdRequirementsRoutingModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatDividerModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatMenuModule
  ],
  entryComponents: [
    ProdRequirementsRejectConfirmComponent,
    ProdRequirementsRestoreConfirmComponent,
    ProdRequirementsApproveConfirmComponent
  ]
})
export class ProdRequirementsModule { }
