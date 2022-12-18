import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IIdentity, ILookupIdentity, ILookupIdentityData, IUpdateIdentityLocationData } from 'src/app/models/identity.model';
import { ApiService } from './api.service';
import { SocketService } from './socket.service';
import { StateService } from './state.service';
import { ToastService, ToastType } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class IdentityService {

  private _identityUuid: string = ''
  private _identityName: string = 'Waiting ...'
  private _identityLocationSet: boolean = false

  get getIdentityUuid (): string {
    return this._identityUuid
  }

  get getIdentityName (): string {
    return this._identityName
  }

  get isGeolocationSet (): boolean {
    return this._identityLocationSet
  }

  set geolocation (locationSet: boolean) {
    this._identityLocationSet = locationSet
  }

  constructor (
    private stateService: StateService,
    private apiService: ApiService,
    private toastService: ToastService
  ) { }

  async init (): Promise<IIdentity> {
    console.log('Identity creation ...')

    const identityPromise: Promise<IIdentity> = this.createIdentity()
    identityPromise
      .then((identity: IIdentity) => {
        this._identityUuid = identity.uuid
        this._identityName = identity.name

        this.stateService.identityReady = true
      })
    return identityPromise
  }

  async createIdentity (): Promise<IIdentity> {
    const requestPromise: Promise<IIdentity> = this.apiService.doPostRequest<IIdentity>('/identities', {})
    requestPromise
      .then((identity: IIdentity) => {
        console.log('Identity created: ', identity)
      })
      .catch((error: Error) => {
        this.toastService.showToast({
          title: 'Failed to create identity',
          type: ToastType.ERROR
        })
        
        console.log('Error thrown while identity creation: ', error)
      })
    return requestPromise
  }

  async lookupIdentity (input: ILookupIdentityData): Promise<ILookupIdentity> {
    const requestPromise: Promise<ILookupIdentity> = this.apiService.doGetRequest<ILookupIdentity>(`/identities/${input.name}`, {
      headers: new HttpHeaders({ 'Authorization': `Bearer ${this.getIdentityUuid}` }),
      responseType: 'json' as 'arraybuffer'
    })
    return requestPromise
  }

  async updateLocation (input: IUpdateIdentityLocationData): Promise<IUpdateIdentityLocationData> {
    const requestPromise: Promise<IUpdateIdentityLocationData> = this.apiService.doPatchRequest<IUpdateIdentityLocationData>('/identities/geolocation', input, new HttpHeaders({ 'Authorization': `Bearer ${this.getIdentityUuid}` }))
    requestPromise
      .then(() => {
        console.log('Identity geolocation updated')
      })
      .catch((error: Error) => {
        this.toastService.showToast({
          title: 'Failed to update geolocation',
          type: ToastType.ERROR
        })

        console.log('Error thrown while updating identity geolocation: ', error)
      })
    return requestPromise
  }
}
