import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReceptionsRoutingModule } from './receptions-routing.module';
import { ReceptionsComponent } from './receptions.component';
import { MatFormFieldModule, MatIconModule, MatInputModule, MatButtonModule, MatAutocompleteModule, MatCheckboxModule, MatTooltipModule, MatDividerModule, MatTableModule, MatPaginatorModule, MatSortModule, MatDialogModule, MatSnackBarModule, MatProgressSpinnerModule, MatProgressBarModule, MatMenuModule } from '@angular/material';
import { TransfersShowSerialListComponent } from '../transfers/transfers-show-serial-list/transfers-show-serial-list.component';
import { ReceptionsShowSerialListComponent } from './receptions-show-serial-list/receptions-show-serial-list.component';

@NgModule({
  declarations: [
    ReceptionsComponent,
    ReceptionsShowSerialListComponent
  ],
  imports: [
    CommonModule,
    ReceptionsRoutingModule,
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
    ReceptionsShowSerialListComponent
  ]
})
export class ReceptionsModule { }
