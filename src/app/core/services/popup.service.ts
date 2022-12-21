/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable } from '@angular/core'
import { IPopup } from 'src/app/models/popup.model'
import { ISocketRequest } from 'src/app/models/socket.model'
import { randomString } from 'src/app/shared/helpers/stringHelper'
import { RequestType } from './socket.service'

export class PopupBuilder {
  private _title = 'No title'
  private _content = 'No content'
  private _socketRequest: ISocketRequest = { requestType: RequestType.MESSAGE_TRANSMISSION, requestUuid: '' }
  private _leftButtonCallback: () => void = () => {}
  private _rightButtonCallback: () => void = () => {}

  title (title: string): PopupBuilder {
    this._title = title
    return this
  }

  content (content: string): PopupBuilder {
    this._content = content
    return this
  }

  request (socketRequest: ISocketRequest): PopupBuilder {
    this._socketRequest = socketRequest
    return this
  }

  leftButton (leftButtonCallback: () => void): PopupBuilder {
    this._leftButtonCallback = leftButtonCallback
    return this
  }

  rightButton (rightButtonCallback: () => void): PopupBuilder {
    this._rightButtonCallback = rightButtonCallback
    return this
  }

  build (): IPopup {
    return {
      title: this._title,
      content: this._content,
      socketRequest: this._socketRequest,
      leftButtonCallback: this._leftButtonCallback,
      rightButtonCallback: this._rightButtonCallback
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export class PopupService {

  private _popups: Array<IPopup> = new Array<IPopup>()
  private _currentPopup: IPopup | undefined = undefined

  get popups (): Array<IPopup> {
    return this._popups.sort((a: IPopup, b: IPopup) => {
      if ((a.triggeredAt as Date) < (b.triggeredAt as Date)) return 1 // b's timestamp is bigger
      if ((a.triggeredAt as Date) > (b.triggeredAt as Date)) return -1 // a's timestamp is bigger
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
    if (!this._currentPopup) return
    this.animatePopup(this._currentPopup.id as string)
    
    setTimeout(() => {
      this._currentPopup = undefined
      this.nextPopup()
    }, 200)
  }

  async retractPopup (requestUuid: string): Promise<void> {
    if (this._currentPopup?.socketRequest.requestUuid === requestUuid) {
      this.dismissPopup()
      return
    }
    this._popups.forEach((popup: IPopup, index: number) => {
      if (popup.socketRequest.requestUuid === requestUuid) {
        this._popups.splice(index, 1)
        return
      }
    })
  }

  nextPopup (): void {
    if (!this.currentPopup && this.popups.length > 0) {
      const popup: IPopup = this.popups.pop() as IPopup
      this._currentPopup = popup

      this.animatePopup(popup.id as string)
    }
  }

  animatePopup (id: string): void {
    let animated = false
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
