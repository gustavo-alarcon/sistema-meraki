import { Component, OnInit, OnDestroy } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router, RouteConfigLoadStart, RouteConfigLoadEnd, NavigationStart } from '@angular/router';
import { AuthService } from 'src/app/core/auth.service';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Permit } from 'src/app/core/types';
import { distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styles: []
})
export class MenuComponent implements OnInit, OnDestroy {

  deviceFormat: string = 'web';

  openedMenu: boolean = false;
  openedNotifications: boolean = false;
  salesOpenedFlag: boolean = false;
  productionOpenedFlag: boolean = false;
  logisticOpenedFlag: boolean = false;
  cashOpenedFlag: boolean = false;


  loadingRouteConfig: boolean;

  selectedTab = new FormControl(0);

  buttonOptions = {
    sales: {
      requirements: false,
      orders: false,
      quotations: false,
      sales: false,
      stores: false,
      checkStock: false
    },
    production: {
      requirements: false,
      orders: false,
      production: false,
      quotations: false,
      materials: false,
      finishedProducts: false
    },
    logistic: {
      transfers: false,
      receptions: false
    },
    cash: {
      actual: false,
      previous: false,
      manage: false
    },
    purchases: {
      registerDocuments: false,
    }

  }

  permits: Permit =
    {
      id: '',
      name: '',
      salesSection: false,
      salesRequirementsButton: false,
      requirementsCompleteList: false,
      salesOrdersButton: false,
      ordersCompleteList: false,
      salesQuotationsButton: false,
      quotationsCompleteList: false,
      salesShoppingButton: false,
      salesStoresButton: false,
      salesCheckStockButton: false,
      productionSection: false,
      productionRequirementsButton: false,
      productionOrdersButton: false,
      productionProductionOrdersButton: false,
      productionQuotationsButton: false,
      productionRawMaterialsButton: false,
      productionFinishedProductsButton: false,
      productionFinishedProductsTableSale: false,
      logisticSection: false,
      logisticTransfersButton: false,
      logisticTransfersCompleteList: false,
      logisticReceptionsButton: false,
      cashSection: false,
      cashActualButton: false,
      cashPreviousButton: false,
      cashManageButton: false,
      cashTransactionApproveAction: false,
      cashTransactionEditAction: false,
      cashTransactionCancelAction: false,
      cashActualOpeningBalanceAction: false,
      cashActualOpeningDateAction: false,
      cashActualPrintAction: false,
      cashActualExportAction: false,
      cashManageSettingsAction: false,
      cashManageReportsAction: false,
      cashManageEditAction: false,
      cashManageDeleteAction: false,
      cashManageCreateButton: false,
      purchasesSection: false,
      purchasesRegisterDocumentsButton: false,
      purchasesRegisterDocumentsCreateButton: false,
      purchasesVerifyAction: false,
      purchasesEditAction: false,
      purchasesDeleteAction: false,
      regDate: 0
    };

  subscriptions: Array<Subscription> = [];

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
    const permit$ =
      this.auth.currentDataPermit.subscribe(res => {
        if (res.name) {
          this.permits = res;
          this.checkRoute(this.router.url);
        }
      });

    this.subscriptions.push(permit$);

    this.router.events
      .subscribe(event => {
        if (event instanceof RouteConfigLoadStart) {
          this.loadingRouteConfig = true;
        } else if (event instanceof RouteConfigLoadEnd) {
          this.loadingRouteConfig = false;
        } else if (event instanceof NavigationStart) {

          if (event.url !== '/main') {
            this.auth.saveLastRoute(event.url);
            this.checkRoute(event.url);
          }

        }
      });

  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  cleanButtons(): void {
    this.buttonOptions = {
      sales: {
        requirements: false,
        orders: false,
        quotations: false,
        sales: false,
        stores: false,
        checkStock: false
      },
      production: {
        requirements: false,
        orders: false,
        production: false,
        quotations: false,
        materials: false,
        finishedProducts: false
      },
      logistic: {
        transfers: false,
        receptions: false
      },
      cash: {
        actual: false,
        previous: false,
        manage: false
      },
      purchases: {
        registerDocuments: false
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

  logisticOpened(): void {
    this.logisticOpenedFlag = true;
  }

  logisticClosed(): void {
    this.logisticOpenedFlag = false;
  }

  cashOpened(): void {
    this.cashOpenedFlag = true;
  }

  cashClosed(): void {
    this.cashOpenedFlag = false;
  }

  checkRoute(route: string): void {
    let coincidence = false;

    if (this.permits.salesSection) {
      switch (route) {
        case '/main/sales/requirements/form':
          this.selectedTab.setValue(0);
          this.cleanButtons();
          this.buttonOptions.sales.requirements = true;
          coincidence = true;
          break;

        case '/main/sales/requirements/list':
          this.selectedTab.setValue(0);
          this.cleanButtons();
          this.buttonOptions.sales.requirements = true;
          coincidence = true;
          break;

        case '/main/sales/quotations':
          this.selectedTab.setValue(0);
          this.cleanButtons();
          this.buttonOptions.sales.quotations = true;
          coincidence = true;
          break;

        case '/main/sales/orders/form':
          this.selectedTab.setValue(0);
          this.cleanButtons();
          this.buttonOptions.sales.orders = true;
          coincidence = true;
          break;

        case '/main/sales/orders/list':
          this.selectedTab.setValue(0);
          this.cleanButtons();
          this.buttonOptions.sales.orders = true;
          coincidence = true;
          break;

        case '/main/sales/sales':
          this.selectedTab.setValue(0);
          this.cleanButtons();
          this.buttonOptions.sales.sales = true;
          coincidence = true;
          break;

        case '/main/sales/check-stock':
          this.selectedTab.setValue(0);
          this.cleanButtons();
          this.buttonOptions.sales.checkStock = true;
          coincidence = true;
          break;

        case '/main/sales/stores':
          this.selectedTab.setValue(0);
          this.cleanButtons();
          this.buttonOptions.sales.stores = true;
          coincidence = true;
          break;
      }
    }

    if (this.permits.productionSection) {
      switch (route) {
        case '/main/production/requirements':
          this.selectedTab.setValue(1);
          this.cleanButtons();
          this.buttonOptions.production.requirements = true;
          coincidence = true;
          break;

        case '/main/production/orders':
          this.selectedTab.setValue(1);
          this.cleanButtons();
          this.buttonOptions.production.orders = true;
          coincidence = true;
          break;

        case '/main/production/production':
          this.selectedTab.setValue(1);
          this.cleanButtons();
          this.buttonOptions.production.production = true;
          coincidence = true;
          break;

        case '/main/production/quotations':
          this.selectedTab.setValue(1);
          this.cleanButtons();
          this.buttonOptions.production.quotations = true;
          coincidence = true;
          break;

        case '/main/production/raw-material':
          this.selectedTab.setValue(1);
          this.cleanButtons();
          this.buttonOptions.production.materials = true;
          coincidence = true;
          break;

        case '/main/production/finished-products':
          this.selectedTab.setValue(1);
          this.cleanButtons();
          this.buttonOptions.production.finishedProducts = true;
          coincidence = true;
          break;
      }
    }

    if (this.permits.logisticSection) {
      switch (route) {
        case '/main/logistic/transfers':
          this.selectedTab.setValue(2);
          this.cleanButtons();
          this.buttonOptions.logistic.transfers = true;
          coincidence = true;
          break;

        case '/main/logistic/receptions':
          this.selectedTab.setValue(2);
          this.cleanButtons();
          this.buttonOptions.logistic.receptions = true;
          coincidence = true;
          break;
      }
    }

    if (this.permits.cashSection) {
      switch (route) {
        case '/main/cash/actual':
          this.selectedTab.setValue(3);
          this.cleanButtons();
          this.buttonOptions.cash.actual = true;
          coincidence = true;
          break;

        case '/main/cash/previous':
          this.selectedTab.setValue(3);
          this.cleanButtons();
          this.buttonOptions.cash.previous = true;
          coincidence = true;
          break;

        case '/main/cash/manage':
          this.selectedTab.setValue(3);
          this.cleanButtons();
          this.buttonOptions.cash.manage = true;
          coincidence = true;
          break;
      }
    }

    if (this.permits.purchasesSection) {
      switch (route) {
        case '/main/purchases/register-documents':
          this.selectedTab.setValue(4);
          this.cleanButtons();
          this.buttonOptions.purchases.registerDocuments = true;
          coincidence = true;
          break;
      }
    }

    if (!coincidence) {
      this.selectedTab.setValue(0);
      this.router.navigate(['/main']);
    }
  }

}
