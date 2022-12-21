import { NgModule } from '@angular/core'
import { MainRoutingModule } from './main-routing.module'
import { SharedModule } from 'src/app/shared/shared.module'
import { LocationPageComponent } from './location-page/location-page.component'
import { DirectPageComponent } from './direct-page/direct-page.component'
import { IpPageComponent } from './ip-page/ip-page.component'


@NgModule({
  declarations: [
    IpPageComponent,
    LocationPageComponent,
    DirectPageComponent
  ],
  imports: [
    SharedModule,
    MainRoutingModule
  ]
})
export class MainModule { }
