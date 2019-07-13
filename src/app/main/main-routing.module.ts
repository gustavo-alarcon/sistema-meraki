import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./dashboard/dashboard.module').then(mod => mod.DashboardModule)
      },
      {
        path: 'sales/requirements',
        loadChildren: () => import('./sales/requirements/requirements.module').then(mod => mod.RequirementsModule)
      },
      {
        path: 'sales/orders',
        loadChildren: () => import('./sales/orders/orders.module').then(mod => mod.OrdersModule)
      },
      {
        path: 'sales/shopping',
        loadChildren: () => import('./sales/shopping/shopping.module').then(mod => mod.ShoppingModule)
      },
      {
        path: 'sales/stores',
        loadChildren: () => import('./sales/stores/stores.module').then(mod => mod.StoresModule)
      },
      {
        path: 'production/requirements',
        loadChildren: () => import('./production/prod-requirements/prod-requirements.module').then(mod => mod.ProdRequirementsModule)
      },
      {
        path: 'production/orders',
        loadChildren: () => import('./production/prod-orders/prod-orders.module').then(mod => mod.ProdOrdersModule)
      },
      {
        path: 'production/raw-material',
        loadChildren: () => import('./production/raw-material/raw-material.module').then(mod => mod.RawMaterialModule)
      },
      {
        path: 'production/production',
        loadChildren: () => import('./production/production-list/production-list.module').then(mod => mod.ProductionListModule)
      },
      {
        path: 'production/finished-products',
        loadChildren: () => import('./production/finished-products/finished-products.module').then(mod => mod.FinishedProductsModule)
      },
      {
        path: 'logistic/transfers',
        loadChildren: () => import('./logistic/transfers/transfers.module').then(mod => mod.TransfersModule)
      },
      
    ]
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
