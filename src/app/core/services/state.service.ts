import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  private _identityReady: boolean = false
  private _socketReady: boolean = false

  get isReady (): boolean {
    return this._identityReady && this._socketReady
  }

  get isIdentityReady (): boolean {
    return this._identityReady
  }

  get isSocketReady (): boolean {
    return this._socketReady
  }

  set identityReady (isIdentityReady: boolean) {
    this._identityReady = isIdentityReady
  }

  set socketReady (isSocketReady: boolean) {
    this._socketReady = isSocketReady
  }

  constructor() { }
}
