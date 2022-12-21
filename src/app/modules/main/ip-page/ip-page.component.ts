import { Component, OnInit } from '@angular/core'
import { NearbyService } from 'src/app/core/services/nearby.service'
import { INearbyIdentity } from 'src/app/models/nearby-identity.model'

@Component({
  selector: 'app-ip-page',
  templateUrl: './ip-page.component.html',
  styleUrls: ['./ip-page.component.css']
})
export class IpPageComponent implements OnInit {
  private _loading = true

  get loading(): boolean {
    return this._loading
  }

  get nearbyIdentities(): Array<INearbyIdentity> {
    return this.nearbyService.nearbyIpIdentities
  }

  get nearbyExisting(): boolean {
    return this.nearbyService.nearbyIpIdentities.length > 0
  }

  constructor(private nearbyService: NearbyService) {}

  ngOnInit(): void {
    this.updateNearbyIdentities()
  }

  updateNearbyIdentities(): void {
    console.log('Nearby ip identities updating ...')

    this.nearbyService
      .updateNearbyIpIdentities()
      .then(() => {
        this._loading = false
      })
      .catch(() => {
        this._loading = false
      })
  }
}
