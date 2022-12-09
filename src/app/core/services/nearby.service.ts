import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { INearbyIdentity, INearbyIdentityList } from 'src/app/models/nearby-identity.model';
import { ApiService } from './api.service';
import { IdentityService } from './identity.service';
import { ToastService, ToastType } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class NearbyService {

  public nearbyIpIdentities: Array<INearbyIdentity> = []
  public nearbyGeolocationIdentities: Array<INearbyIdentity> = []

  constructor(
    private apiService: ApiService,
    private identityService: IdentityService,
    private toastService: ToastService
  ) { }

  async updateNearbyIpIdentities (): Promise<INearbyIdentityList> {
    const requestPromise: Promise<INearbyIdentityList> = this.apiService.doGetRequest<INearbyIdentityList>('/nearby', {
      headers: new HttpHeaders({ 'Authorization': `Bearer ${this.identityService.getIdentityUuid}` }),
      responseType: 'json' as 'arraybuffer'
    })
    requestPromise
      .then((nearbyIdentityList: INearbyIdentityList) => {
        this.nearbyIpIdentities = nearbyIdentityList.nearbyIdentities
        console.log('Nearby ip identities updated: ', nearbyIdentityList)
      })
      .catch((error: Error) => {
        this.toastService.showToast({
          title: 'Failed to update nearby ip identities',
          type: ToastType.ERROR
        })

        console.log('Error thrown while updating nearby ip identities: ', error)
      })
    return requestPromise
  }

  async updateNearbyGeolocationIdentities (): Promise<INearbyIdentityList> {
    if (!this.identityService.isGeolocationSet) {
      return new Promise((resolve) => {
        return resolve({ nearbyIdentities: [] })
      })
    }
    const requestPromise: Promise<INearbyIdentityList> = this.apiService.doGetRequest<INearbyIdentityList>('/nearby/geolocation', {
      headers: new HttpHeaders({ 'Authorization': `Bearer ${this.identityService.getIdentityUuid}` }),
      responseType: 'json' as 'arraybuffer'
    })
    requestPromise
      .then((nearbyIdentityList: INearbyIdentityList) => {
        this.nearbyGeolocationIdentities = nearbyIdentityList.nearbyIdentities
        console.log('Nearby geolocation identities updated: ', nearbyIdentityList)
      })
      .catch((error: Error) => {
        this.toastService.showToast({
          title: 'Failed to update nearby geolocation identities',
          type: ToastType.ERROR
        })

        console.log('Error thrown while updating nearby geolocation identities: ', error)
      })
    return requestPromise
  }
}
