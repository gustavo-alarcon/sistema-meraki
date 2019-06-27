import { Component, OnInit } from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styles: []
})
export class MenuComponent implements OnInit {

  deviceFormat: string = 'web';

  openedMenu: boolean = false;
  openedNotifications: boolean = false;
  salesOpenedFlag: boolean = false;
  productionOpenedFlag: boolean = false;

  constructor(
    breakpointObserver: BreakpointObserver
  ) {
    breakpointObserver.observe([
      Breakpoints.HandsetLandscape,
      Breakpoints.HandsetPortrait,
    ]).subscribe(res => {
      if (res.matches) {
        this.deviceFormat = 'mobile';
        console.log(this.deviceFormat);
      }
    });

    breakpointObserver.observe([
      Breakpoints.WebPortrait,
      Breakpoints.WebLandscape,
    ]).subscribe(res => {
      if (res.matches) {
        this.deviceFormat = 'web';
        console.log(this.deviceFormat);
      }
    });

    breakpointObserver.observe([
      Breakpoints.TabletPortrait,
    ]).subscribe(res => {
      if (res.matches) {
        this.deviceFormat = 'tablet';
        console.log(this.deviceFormat);
      }
    });
  }

  ngOnInit() {
    console.log(this.deviceFormat);
  }

  toggleSideMenu(): void {
    this.openedMenu = !this.openedMenu;
    console.log(this.openedMenu);
  }

  toggleSideNotifications(): void{
    this.openedNotifications = !this.openedNotifications    
  }

  salesOpened(): void{
    this.salesOpenedFlag = true;
  }

  salesClosed(): void{
    this.salesOpenedFlag = false;
  }

  productionOpened(): void{
    this.productionOpenedFlag = true;
  }

  productionClosed(): void{
    this.productionOpenedFlag = false;
  }

  

}
