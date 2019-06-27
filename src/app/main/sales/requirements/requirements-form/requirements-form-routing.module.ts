import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RequirementsFormComponent } from './requirements-form.component';

const routes: Routes = [
  {
    path: '',
    component: RequirementsFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequirementsFormRoutingModule { }
