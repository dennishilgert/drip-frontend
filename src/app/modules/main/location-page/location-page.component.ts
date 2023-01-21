import { Component, OnInit } from '@angular/core'
import { IdentityService } from 'src/app/core/services/identity.service'
import { NearbyService } from 'src/app/core/services/nearby.service'
import { SocketEvent, SocketService } from 'src/app/core/services/socket.service'
import { StateService } from 'src/app/core/services/state.service'
import { ToastService, ToastType } from 'src/app/core/services/toast.service'
import { IUpdateIdentityLocationData } from 'src/app/models/identity.model'
import { INearbyIdentity } from 'src/app/models/nearby-identity.model'

@Component({
  selector: 'app-location-page',
  templateUrl: './location-page.component.html',
  styleUrls: ['./location-page.component.css']
})
export class LocationPageComponent implements OnInit {
  private _loading = true

  get loading(): boolean {
    return this._loading
  }

  get hasGeolocationAccess(): boolean {
    return this.stateService.hasGeolocationAccess
  }

  get nearbyIdentities(): Array<INearbyIdentity> {
    return this.nearbyService.nearbyGeolocationIdentities
  }

  get nearbyExisting(): boolean {
    return this.nearbyService.nearbyGeolocationIdentities.length > 0
  }

  constructor(
    private identityService: IdentityService,
    private nearbyService: NearbyService,
    private socketService: SocketService,
    private toastService: ToastService,
    private stateService: StateService
  ) {
    navigator.permissions.query({ name: 'geolocation' }).then((permissionStatus: PermissionStatus) => {
      permissionStatus.onchange = () => {
        this.stateService.geolocationAccess = permissionStatus.state === 'granted'
        this.initGeolocation()
        this.toastService.showToast({ title: 'Permission status changed' })
      }
      this.stateService.geolocationAccess = permissionStatus.state === 'granted'
    })
  }

  ngOnInit(): void {
    this.initGeolocation()

    this.toastService.showToast({
      title: 'Variables first',
      content: `Loading: ${this.loading}, Geolocation: ${this.hasGeolocationAccess}`
    })

    setTimeout(() => {
      this.toastService.showToast({
        title: 'Variables second',
        content: `Loading: ${this.loading}, Geolocation: ${this.hasGeolocationAccess}`
      })
    }, 3000)
  }

  initGeolocation(): void {
    if (!this.identityService.isGeolocationSet) {
      console.log('Identity geolocation updating ...')
      this.toastService.showToast({ title: 'Identity geolocation updating' })

      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          // fallback if browsers do not support permission status change event
          this.stateService.geolocationAccess = true

          const input: IUpdateIdentityLocationData = {
            geolocation: {
              longitude: position.coords.longitude,
              latitude: position.coords.latitude
            }
          }
          this.identityService.updateLocation(input).then(() => {
            this.identityService.geolocation = true

            this.socketService.emitEvent(SocketEvent.UPDATED_GEOLOCATION)
            this.updateNearbyIdentities()
          })
        },
        (error: GeolocationPositionError) => {
          this.toastService.showToast({
            title: 'Request to access geolocation has been denied',
            type: ToastType.INFO
          })

          console.log('Geolocation access failed', error)
        }
      )
      return
    }

    this.updateNearbyIdentities()
  }

  updateNearbyIdentities(): void {
    if (this.identityService.isGeolocationSet) {
      console.log('Nearby geolocation identities updating ...')
      this.toastService.showToast({ title: 'Nearby geolocation identities updating' })

      this.nearbyService
        .updateNearbyGeolocationIdentities()
        .then(() => {
          this._loading = false
        })
        .catch(() => {
          this._loading = false
        })
    }
  }
}
