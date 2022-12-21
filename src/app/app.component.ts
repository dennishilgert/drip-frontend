import { Component, OnInit } from '@angular/core'
import { IdentityService } from './core/services/identity.service'
import { SocketService } from './core/services/socket.service'
import { StateService } from './core/services/state.service'
import { IIdentity } from './models/identity.model'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  get ready (): boolean {
    return this.stateService.isReady
  }

  constructor (
    private stateService: StateService,
    private identityService: IdentityService,
    private socketService: SocketService
  ) { }

  ngOnInit (): void {
    this.identityService.init()
      .then((identity: IIdentity) => {
        this.socketService.init(identity)
      })
  }
}
