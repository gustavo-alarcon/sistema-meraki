import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransfersRoutingModule } from './transfers-routing.module';
import { TransfersComponent } from './transfers.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatIconModule, MatInputModule, MatButtonModule, MatAutocompleteModule, MatCheckboxModule, MatTooltipModule, MatDividerModule, MatTableModule, MatPaginatorModule, MatSortModule, MatDialogModule, MatSnackBarModule, MatProgressSpinnerModule, MatProgressBarModule, MatMenuModule } from '@angular/material';
import { TransfersCreateDialogComponent } from './transfers-create-dialog/transfers-create-dialog.component';
import { TransfersCreateConfirmComponent } from './transfers-create-confirm/transfers-create-confirm.component';
import { TransfersShowSerialListComponent } from './transfers-show-serial-list/transfers-show-serial-list.component';

@NgModule({
  declarations: [
    TransfersComponent,
    TransfersCreateDialogComponent,
    TransfersCreateConfirmComponent,
    TransfersShowSerialListComponent
  ],
  imports: [
    CommonModule,
    TransfersRoutingModule,
    FormsModule,
    ReactiveFormsModule,
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
    MatMenuModule,
  ],
  entryComponents: [
    TransfersCreateDialogComponent,
    TransfersCreateConfirmComponent,
    TransfersShowSerialListComponent
  ]
})
export class TransfersModule { }
