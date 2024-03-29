import { Injectable } from '@angular/core'
import { SwUpdate } from '@angular/service-worker'

@Injectable({
  providedIn: 'root'
})
export class PwaService {
  constructor(private swUpdate: SwUpdate) {
    console.log('PwaService')
    swUpdate.versionUpdates.subscribe(() => {
      window.location.reload()
    })
  }
}
