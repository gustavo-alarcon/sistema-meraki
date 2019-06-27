import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RequirementsComponent } from './requirements.component';
import { RequirementsListComponent } from './requirements-list/requirements-list.component';

const routes: Routes = [
  {
    path: '',
    component: RequirementsComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./requirements-form/requirements-form.module').then(mod => mod.RequirementsFormModule)
      },
      {
        path: 'form',
        loadChildren: () => import('./requirements-form/requirements-form.module').then(mod => mod.RequirementsFormModule)
      },
      {
        path: 'list',
        loadChildren: () => import('./requirements-list/requirements-list.module').then(mod => mod.RequirementsListModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequirementsRoutingModule { }
