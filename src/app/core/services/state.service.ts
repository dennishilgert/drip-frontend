import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private _identityReady = false
  private _socketReady = false
  private _geolocationAccess = false

  get isReady(): boolean {
    return this._identityReady && this._socketReady
  }

  get isIdentityReady(): boolean {
    return this._identityReady
  }

  set identityReady(isIdentityReady: boolean) {
    this._identityReady = isIdentityReady
  }

  get isSocketReady(): boolean {
    return this._socketReady
  }

  set socketReady(isSocketReady: boolean) {
    this._socketReady = isSocketReady
  }

  get hasGeolocationAccess(): boolean {
    return this._geolocationAccess
  }

  set geolocationAccess(hasGeolocationAccess: boolean) {
    this._geolocationAccess = hasGeolocationAccess
  }
}
