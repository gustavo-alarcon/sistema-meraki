import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrdersFormComponent } from './orders-form.component';

const routes: Routes = [
  {
    path: '',
    component: OrdersFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersFormRoutingModule { }
