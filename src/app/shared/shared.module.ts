import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { ButtonComponent } from './components/button/button.component'
import { InputComponent } from './components/input/input.component'
import { RadioButtonComponent } from './components/radio-button/radio-button.component'
import { NavItemComponent } from './components/nav-item/nav-item.component'
import { RouterModule } from '@angular/router'
import { LoadingComponent } from './components/loading/loading.component'
import { NearbyIdentityComponent } from './components/nearby-identity/nearby-identity.component'
import { ModalComponent } from './components/modal/modal.component'
import { ToastComponent } from './components/toast/toast.component'
import { PopupComponent } from './components/popup/popup.component'
import { FileInputComponent } from './components/file-input/file-input.component'
import { SearchInputComponent } from './components/search-input/search-input.component'

@NgModule({
  declarations: [
    ButtonComponent,
    InputComponent,
    RadioButtonComponent,
    NavItemComponent,
    LoadingComponent,
    NearbyIdentityComponent,
    ModalComponent,
    ToastComponent,
    PopupComponent,
    FileInputComponent,
    SearchInputComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ButtonComponent,
    InputComponent,
    FileInputComponent,
    SearchInputComponent,
    RadioButtonComponent,
    ModalComponent,
    PopupComponent,
    ToastComponent,
    NavItemComponent,
    LoadingComponent,
    NearbyIdentityComponent
  ]
})
export class SharedModule {
}
