import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoresRoutingModule } from './stores-routing.module';
import { StoresComponent } from './stores.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatIconModule, MatInputModule, MatButtonModule, MatAutocompleteModule, MatCheckboxModule, MatTooltipModule, MatDividerModule, MatTableModule, MatPaginatorModule, MatSortModule, MatDialogModule, MatSnackBarModule, MatProgressSpinnerModule, MatProgressBarModule, MatMenuModule, MatSelectModule } from '@angular/material';
import { StoresCreateConfirmComponent } from './stores-create-confirm/stores-create-confirm.component';
import { StoresShowSerialsComponent } from './stores-show-serials/stores-show-serials.component';
import { StoresChangeStatusConfirmComponent } from './stores-change-status-confirm/stores-change-status-confirm.component';
import { StoresSellDialogComponent } from './stores-sell-dialog/stores-sell-dialog.component';

@NgModule({
  declarations: [
    StoresComponent,
    StoresCreateConfirmComponent,
    StoresShowSerialsComponent,
    StoresChangeStatusConfirmComponent,
    StoresSellDialogComponent
  ],
  imports: [
    CommonModule,
    StoresRoutingModule,
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
    MatSelectModule
  ],
  entryComponents: [
    StoresCreateConfirmComponent,
    StoresShowSerialsComponent,
    StoresChangeStatusConfirmComponent,
    StoresSellDialogComponent
  ]
})
export class StoresModule { }
