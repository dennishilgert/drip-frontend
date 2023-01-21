import { Component, OnInit } from '@angular/core'
import { IdentityService } from './core/services/identity.service'
import { SocketService } from './core/services/socket.service'
import { StateService } from './core/services/state.service'
import { ToastService, ToastType } from './core/services/toast.service'
import { IIdentity } from './models/identity.model'
import { IToast } from './models/toast.model'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  get ready(): boolean {
    return this.stateService.isReady
  }

  constructor(
    private stateService: StateService,
    private identityService: IdentityService,
    private socketService: SocketService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.identityService.init().then((identity: IIdentity) => {
      this.socketService.init(identity)
    })

    const errorHandler = (error: ErrorEvent) => {
      const toast: IToast = {
        title: 'An unhandled error has occurred',
        content: error.message,
        type: ToastType.ERROR
      }
      this.toastService.showToast(toast)
    }

    window.addEventListener('error', errorHandler)
  }
}
