import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { DirectPageComponent } from './direct-page/direct-page.component'
import { IpPageComponent } from './ip-page/ip-page.component'
import { LocationPageComponent } from './location-page/location-page.component'

const routes: Routes = [
  { path: '', component: IpPageComponent, title: 'Drip - Nearby IP-Address' },
  { path: 'location', component: LocationPageComponent, title: 'Drip - Nearby Geolocation' },
  { path: 'direct', component: DirectPageComponent, title: 'Drip - Direct' }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule {}
