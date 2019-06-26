import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { MenuComponent } from './menu/menu.component';

@NgModule({
  declarations: [MainComponent, MenuComponent],
  imports: [
    CommonModule,
    MainRoutingModule
  ]
})
export class MainModule { }
