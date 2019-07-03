import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProdOrdersRoutingModule } from './prod-orders-routing.module';
import { ProdOrdersComponent } from './prod-orders.component';
import { ProdOrdersGenerateOPConfirmComponent } from './prod-orders-generate-op-confirm/prod-orders-generate-op-confirm.component';
import { MatFormFieldModule, MatIconModule, MatInputModule, MatButtonModule, MatAutocompleteModule, MatCheckboxModule, MatTooltipModule, MatDividerModule, MatTableModule, MatPaginatorModule, MatSortModule, MatDialogModule, MatSnackBarModule, MatProgressSpinnerModule, MatProgressBarModule, MatMenuModule } from '@angular/material';

@NgModule({
  declarations: [
    ProdOrdersComponent,
    ProdOrdersGenerateOPConfirmComponent
  ],
  imports: [
    CommonModule,
    ProdOrdersRoutingModule,
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
    ProdOrdersGenerateOPConfirmComponent
  ]
})
export class ProdOrdersModule { }
