import { Injectable } from '@angular/core'
import { IToast } from 'src/app/models/toast.model'
import { randomString } from 'src/app/shared/helpers/stringHelper'

export enum ToastType {
  INFO = 'info',
  SUCCESS = 'success',
  ERROR = 'error'
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private _toasts: Map<string, IToast> = new Map<string, IToast>()

  get toasts(): Array<IToast> {
    return Array.from(this._toasts.values()).sort((a: IToast, b: IToast) => {
      if ((a.triggeredAt as Date) < (b.triggeredAt as Date)) return 1 // b's timestamp is bigger
      if ((a.triggeredAt as Date) > (b.triggeredAt as Date)) return -1 // a's timestamp is bigger
      return 0
    })
  }

  async showToast(toast: IToast): Promise<string> {
    if (this._toasts.size >= 5) {
      this._toasts.delete((this.toasts.pop() as IToast).id as string)
    }
    toast.id = randomString(8)
    toast.triggeredAt = new Date()
    if (!toast.type) toast.type = ToastType.INFO
    this._toasts.set(toast.id, toast)

    this.animateToast(toast.id)

    setTimeout(() => {
      this.dismissToast(toast.id as string)
    }, 8000)

    return toast.id
  }

  async dismissToast(id: string): Promise<void> {
    if (!this._toasts.has(id)) return

    this.animateToast(id)

    setTimeout(() => {
      this._toasts.delete(id)
    }, 200)
  }

  animateToast(id: string): void {
    let animated = false
    let toastElement: HTMLElement | null = document.getElementById(id)
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        if (toastElement && !animated) {
          toastElement.classList.toggle('opacity-0')
          toastElement.classList.toggle('opacity-100')
          animated = true
          return
        }
        if (animated) return
        toastElement = document.getElementById(id)
      }, i * 100)
    }
  }
}
