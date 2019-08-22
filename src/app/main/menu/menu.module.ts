
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MenuComponent } from './menu.component';

import {MatTabsModule} from '@angular/material/tabs';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {LayoutModule} from '@angular/cdk/layout';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MenuShowReleaseNotesDialogComponent } from './menu-show-release-notes-dialog/menu-show-release-notes-dialog.component';
import { MatDividerModule, MatDialogModule } from '@angular/material';





@NgModule({
  declarations: [
    MenuComponent,
    MenuShowReleaseNotesDialogComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    LayoutModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule,
    MatExpansionModule,
    MatProgressBarModule,
    MatDividerModule,
    MatDialogModule
  ],
  exports: [
    MenuComponent
  ],
  entryComponents: [
    MenuShowReleaseNotesDialogComponent
  ]
})
export class MenuModule { }
