import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DeclarePage } from './declare.page';

const routes: Routes = [
  {
    path: '',
    component: DeclarePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeclarePageRoutingModule {}
