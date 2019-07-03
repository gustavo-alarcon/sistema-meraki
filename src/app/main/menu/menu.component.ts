import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router, RouteConfigLoadStart, RouteConfigLoadEnd, NavigationStart } from '@angular/router';
import { AuthService } from 'src/app/core/auth.service';
import { FormControl } from '@angular/forms';

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

  selectedTab = new FormControl(0);

  buttonOptions = {
    sales: {
      requirements: false,
      orders: false,
      sales: false,
      stores: false,
    },
    production: {
      requirements: false,
      orders: false,
      production: false,
      materials: false,
    }
  }

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
      } else if (event instanceof NavigationStart) {
        console.log(event.url);
        switch (event.url) {
          case '/main/sales/requirements/form':
            this.selectedTab.setValue(0);
            this.cleanButtons();
            this.buttonOptions.sales.requirements = true;
            break;

          case '/main/sales/requirements/list':
            this.selectedTab.setValue(0);
            this.cleanButtons();
            this.buttonOptions.sales.requirements = true;
            break;

          case '/main/sales/orders/form':
            this.selectedTab.setValue(0);
            this.cleanButtons();
            this.buttonOptions.sales.orders = true;
            break;

          case '/main/sales/orders/list':
            this.selectedTab.setValue(0);
            this.cleanButtons();
            this.buttonOptions.sales.orders = true;
            break;

          case '/main/sales/sales':
            this.selectedTab.setValue(0);
            this.cleanButtons();
            this.buttonOptions.sales.sales = true;
            break;

          case '/main/sales/stores':
            this.selectedTab.setValue(0);
            this.cleanButtons();
            this.buttonOptions.sales.stores = true;
            break;

          case '/main/production/requirements':
            this.selectedTab.setValue(1);
            this.cleanButtons();
            this.buttonOptions.production.requirements = true;
            break;
          
          case '/main/production/orders':
            this.selectedTab.setValue(1);
            this.cleanButtons();
            this.buttonOptions.production.orders = true;
            break;
            
          case '/main/production/production':
            this.selectedTab.setValue(1);
            this.cleanButtons();
            this.buttonOptions.production.production = true;
            break;

          case '/main/production/raw-material':
            this.selectedTab.setValue(1);
            this.cleanButtons();
            this.buttonOptions.production.materials = true;
            break;

          default:
            this.selectedTab.setValue(0);
            break;
        }
      }
    });

    switch (this.router.url) {
      case '/main/sales/requirements/form':
        this.selectedTab.setValue(0);
        this.cleanButtons();
        this.buttonOptions.sales.requirements = true;
        break;

      case '/main/sales/requirements/list':
        this.selectedTab.setValue(0);
        this.cleanButtons();
        this.buttonOptions.sales.requirements = true;
        break;

      case '/main/sales/orders/form':
        this.selectedTab.setValue(0);
        this.cleanButtons();
        this.buttonOptions.sales.orders = true;
        break;

      case '/main/sales/orders/list':
        this.selectedTab.setValue(0);
        this.cleanButtons();
        this.buttonOptions.sales.orders = true;
        break;

      case '/main/sales/sales':
        this.selectedTab.setValue(0);
        this.cleanButtons();
        this.buttonOptions.sales.sales = true;
        break;

      case '/main/sales/stores':
        this.selectedTab.setValue(0);
        this.cleanButtons();
        this.buttonOptions.sales.stores = true;
        break;

      case '/main/production/requirements':
        this.selectedTab.setValue(1);
        this.cleanButtons();
        this.buttonOptions.production.requirements = true;
        break;

      case '/main/production/orders':
        this.selectedTab.setValue(1);
        this.cleanButtons();
        this.buttonOptions.production.orders = true;
        break;

      case '/main/production/production':
        this.selectedTab.setValue(1);
        this.cleanButtons();
        this.buttonOptions.production.production = true;
        break;

      case '/main/production/raw-material':
        this.selectedTab.setValue(1);
        this.cleanButtons();
        this.buttonOptions.production.materials = true;
        break;

      default:
        this.selectedTab.setValue(0);
        break;
    }


  }

  cleanButtons(): void {
    this.buttonOptions = {
      sales: {
        requirements: false,
        orders: false,
        sales: false,
        stores: false,
      },
      production: {
        requirements: false,
        orders: false,
        production: false,
        materials: false,
      }
    }
  }

  toggleSideMenu(): void {
    this.openedMenu = !this.openedMenu;
  }

  toggleSideNotifications(): void {
    this.openedNotifications = !this.openedNotifications
  }

  salesOpened(): void {
    this.salesOpenedFlag = true;
  }

  salesClosed(): void {
    this.salesOpenedFlag = false;
  }

  productionOpened(): void {
    this.productionOpenedFlag = true;
  }

  productionClosed(): void {
    this.productionOpenedFlag = false;
  }



}
