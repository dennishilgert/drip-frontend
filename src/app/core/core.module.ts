import { ErrorHandler, NgModule } from '@angular/core'
import { SharedModule } from '../shared/shared.module'
import { GlobalErrorHandler } from './errors/global-error-handler'
import { FooterComponent } from './footer/footer.component'
import { HeaderComponent } from './header/header.component'

@NgModule({
  declarations: [HeaderComponent, FooterComponent],
  imports: [SharedModule],
  providers: [
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler
    }
  ],
  exports: [HeaderComponent, FooterComponent]
})
export class CoreModule {}
