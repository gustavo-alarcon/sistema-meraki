import { Component, OnInit } from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import { Router, RouteConfigLoadStart, RouteConfigLoadEnd } from '@angular/router';
import { AuthService } from 'src/app/core/auth.service';

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

  loadingRouteConfig: boolean;

  constructor(
    breakpointObserver: BreakpointObserver,
    private router: Router,
    public auth: AuthService
  ) {
    breakpointObserver.observe([
      Breakpoints.HandsetLandscape,
      Breakpoints.HandsetPortrait,
    ]).subscribe(res => {
      if (res.matches) {
        this.deviceFormat = 'mobile';
      }
    });

    breakpointObserver.observe([
      Breakpoints.WebPortrait,
      Breakpoints.WebLandscape,
    ]).subscribe(res => {
      if (res.matches) {
        this.deviceFormat = 'web';
      }
    });

    breakpointObserver.observe([
      Breakpoints.TabletPortrait,
    ]).subscribe(res => {
      if (res.matches) {
        this.deviceFormat = 'tablet';
      }
    });
  }

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof RouteConfigLoadStart) {
          this.loadingRouteConfig = true;
      } else if (event instanceof RouteConfigLoadEnd) {
          this.loadingRouteConfig = false;
      }
  });
  }

  toggleSideMenu(): void {
    this.openedMenu = !this.openedMenu;
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
