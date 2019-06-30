import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrdersComponent } from './orders.component';

const routes: Routes = [
  {
    path: '',
    component: OrdersComponent,
    children: [
      {
        path: 'form',
        loadChildren: () => import('./orders-form/orders-form.module').then(mod => mod.OrdersFormModule)
      },
      {
        path: 'list',
        loadChildren: () => import('./orders-list/orders-list.module').then(mod => mod.OrdersListModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersRoutingModule { }
