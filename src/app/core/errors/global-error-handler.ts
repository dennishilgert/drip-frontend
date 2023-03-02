import { HttpErrorResponse } from '@angular/common/http'
import { ErrorHandler, Injectable, NgZone } from '@angular/core'
import { ToastService, ToastType } from '../services/toast.service'

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private zone: NgZone, private toastService: ToastService) {}

  handleError(error: any) {
    // Check if it's an error from an HTTP response
    if (!(error instanceof HttpErrorResponse)) {
      error = error.rejection // get the error object
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
