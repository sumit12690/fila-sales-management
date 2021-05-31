import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';

const salesModule = () =>
  import('./sales/sales.module').then(x => x.SalesModule);

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'sales', loadChildren: salesModule },

  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
