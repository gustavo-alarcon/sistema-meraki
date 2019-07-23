import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProdQuotationsComponent } from './prod-quotations.component';

const routes: Routes = [
  {
    path: '',
    component: ProdQuotationsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProdQuotationsRoutingModule { }
