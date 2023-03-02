import { HttpErrorResponse } from '@angular/common/http'
import { ErrorHandler, Injectable, NgZone } from '@angular/core'
import { ToastService, ToastType } from '../services/toast.service'

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private zone: NgZone, private toastService: ToastService) {}

  handleError(error: any) {
    if (error instanceof HttpErrorResponse) {
      return
    }
    this.zone.run(() =>
      this.toastService.showToast({
        title: 'An unhandled error occured',
        content: error?.message,
        type: ToastType.ERROR
      })
    )

    console.error('Error catched by global error handler', error)
  }
}
