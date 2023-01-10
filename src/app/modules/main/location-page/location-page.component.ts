import { Component, OnInit } from '@angular/core'
import { IdentityService } from 'src/app/core/services/identity.service'
import { NearbyService } from 'src/app/core/services/nearby.service'
import { SocketEvent, SocketService } from 'src/app/core/services/socket.service'
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
  private _geolocationAccess = false

  get loading(): boolean {
    return this._loading
  }

  get hasGeolocationAccess(): boolean {
    return this._geolocationAccess
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
    private toastService: ToastService
  ) {
    navigator.permissions.query({ name: 'geolocation' }).then((permissionStatus: PermissionStatus) => {
      permissionStatus.onchange = () => {
        this._geolocationAccess = permissionStatus.state === 'granted'
        this.initGeolocation()
      }
      this._geolocationAccess = permissionStatus.state === 'granted'
    })
  }

  ngOnInit(): void {
    this.initGeolocation()
  }

  initGeolocation(): void {
    if (!this.identityService.isGeolocationSet) {
      console.log('Identity geolocation updating ...')

      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
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
