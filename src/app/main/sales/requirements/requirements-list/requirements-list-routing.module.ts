import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RequirementsListComponent } from './requirements-list.component';

const routes: Routes = [
  {
    path: '',
    component: RequirementsListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequirementsListRoutingModule { }
