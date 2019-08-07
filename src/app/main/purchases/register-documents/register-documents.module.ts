import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegisterDocumentsRoutingModule } from './register-documents-routing.module';
import { RegisterDocumentsComponent } from './register-documents.component';

@NgModule({
  declarations: [RegisterDocumentsComponent],
  imports: [
    CommonModule,
    RegisterDocumentsRoutingModule
  ]
})
export class RegisterDocumentsModule { }
