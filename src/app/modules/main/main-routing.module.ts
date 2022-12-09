import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DirectPageComponent } from './direct-page/direct-page.component';
import { IpPageComponent } from './ip-page/ip-page.component';
import { LocationPageComponent } from './location-page/location-page.component';

const routes: Routes = [
  { path: '', component: IpPageComponent },
  { path: 'location', component: LocationPageComponent },
  { path: 'direct', component: DirectPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
