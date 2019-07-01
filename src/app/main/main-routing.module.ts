import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
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
        path: 'production/raw-material',
        loadChildren: () => import('./production/raw-material/raw-material.module').then(mod => mod.RawMaterialModule)
      },
      
    ]
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
