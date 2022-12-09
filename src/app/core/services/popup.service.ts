import { Injectable } from '@angular/core';
import { IPopup } from 'src/app/models/popup.model';
import { randomString } from 'src/app/shared/helpers/stringHelper';

@Injectable({
  providedIn: 'root'
})
export class PopupService {

  private _popups: Array<IPopup> = new Array<IPopup>()
  private _currentPopup: IPopup | undefined = undefined

  get popups (): Array<IPopup> {
    return this._popups.sort((a: IPopup, b: IPopup) => {
      if (a.triggeredAt! < b.triggeredAt!) return 1 // b's timestamp is bigger
      if (a.triggeredAt! > b.triggeredAt!) return -1 // a's timestamp is bigger
      return 0
    })
  }

  get currentPopup (): IPopup | undefined {
    return this._currentPopup
  } 

  constructor () { }

  async showPopup (popup: IPopup): Promise<void> {
    popup.id = randomString(8)
    popup.triggeredAt = new Date()
    this._popups.push(popup)

    this.nextPopup()
  }

  async dismissPopup (): Promise<void> {
    this.animatePopup(this._currentPopup!.id!)
    
    setTimeout(() => {
      this._currentPopup = undefined
      this.nextPopup()
    }, 200)
  }

  nextPopup (): void {
    if (!this.currentPopup && this.popups.length > 0) {
      const popup: IPopup = this.popups.pop() as IPopup
      this._currentPopup = popup

      this.animatePopup(popup.id!)
    }
  }

  animatePopup (id: string): void {
    let animated: boolean = false
    let popupContainer: HTMLElement | null = document.getElementById('container-' + id)
    let popupBackground: HTMLElement | null = document.getElementById('background-' + id)
    let popup: HTMLElement | null = document.getElementById(id)
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        if (popupContainer && popupBackground && popup && !animated) {
          popupContainer.classList.toggle('invisible')
          popupBackground.classList.toggle('opacity-0')
          popupBackground.classList.toggle('opacity-50')
          popup.classList.toggle('opacity-0')
          popup.classList.toggle('opacity-100')
          animated = true
          return
        }
        if (animated) return
        popupContainer = document.getElementById('container-' + id)
        popupBackground = document.getElementById('background-' + id)
        popup = document.getElementById(id)
      }, i * 100)
    }
  }
}
