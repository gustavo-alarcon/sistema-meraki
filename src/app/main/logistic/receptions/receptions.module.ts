import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReceptionsRoutingModule } from './receptions-routing.module';
import { ReceptionsComponent } from './receptions.component';
import { MatFormFieldModule, MatIconModule, MatInputModule, MatButtonModule, MatAutocompleteModule, MatCheckboxModule, MatTooltipModule, MatDividerModule, MatTableModule, MatPaginatorModule, MatSortModule, MatDialogModule, MatSnackBarModule, MatProgressSpinnerModule, MatProgressBarModule, MatMenuModule, MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import { ReceptionsShowSerialListComponent } from './receptions-show-serial-list/receptions-show-serial-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ReceptionsComponent,
    ReceptionsShowSerialListComponent
  ],
  imports: [
    CommonModule,
    ReceptionsRoutingModule,
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
    MatDatepickerModule,
    MatNativeDateModule
  ],
  entryComponents: [
    ReceptionsShowSerialListComponent
  ]
})
export class ReceptionsModule { }
