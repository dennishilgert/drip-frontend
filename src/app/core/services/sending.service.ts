import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICombinedSending, IFileSending, ISending } from 'src/app/models/sending.model';
import { ApiService } from './api.service';
import { IdentityService } from './identity.service';
import { ToastService, ToastType } from './toast.service';
import { saveAs } from 'file-saver'

export enum SendingType {
  MESSAGE = 'message',
  FILE = 'file'
}

@Injectable({
  providedIn: 'root'
})
export class SendingService {
  private _inbox: ICombinedSending[] = []
  private _unreadSendings: boolean = false

  get inbox (): ICombinedSending[] {
    return this._inbox.sort((a: ICombinedSending, b: ICombinedSending) => {
      if (a.receivedAt! < b.receivedAt!) return 1 // b's timestamp is bigger
      if (a.receivedAt! > b.receivedAt!) return -1 // a's timestamp is bigger
      return 0
    })
  }

  get unreadSendings (): boolean {
    return this._unreadSendings
  }

  set unreadSendings (unreadSendings: boolean) {
    this._unreadSendings = unreadSendings
  }

  constructor (private apiService: ApiService, private identityService: IdentityService, private toastService: ToastService) { }

  addSendingToInbox (sending: ISending): void {
    sending.receivedAt = new Date()
    this._inbox.push(sending)

    this._unreadSendings = true
  }

  clearInbox (): void {
    this._inbox = []
  }

  async sendMessage (toName: string, message: string): Promise<void> {
    const requestPromise: Promise<void> = this.apiService.doPostRequest('/sendings/message', { toName, message }, new HttpHeaders({ 'Authorization': `Bearer ${this.identityService.getIdentityUuid}` }))
    requestPromise
      .catch((error: Error) => {
        console.log(error)

        this.toastService.showToast({
          title: 'Failed to send message to ' + toName,
          type: ToastType.ERROR
        })
      })
    return requestPromise
  }

  async sendFile (toName: string, formData: FormData): Promise<void> {
    const requestPromise: Promise<void> = this.apiService.doPostRequest('/sendings/file', formData, new HttpHeaders({ 'Authorization': `Bearer ${this.identityService.getIdentityUuid}` }))
    requestPromise
      .catch((error: Error) => {
        console.log(error)

        this.toastService.showToast({
          title: 'Failed to send file to ' + toName,
          type: ToastType.ERROR
        })
      })
    return requestPromise
  }

  async downloadSending (fileSending: IFileSending): Promise<Blob> {
    const requestPromise: Promise<Blob> = this.apiService.doGetRequest<Blob>(`/sendings/${fileSending.uuid}`, { 
      headers: new HttpHeaders({ 'Authorization': `Bearer ${this.identityService.getIdentityUuid}` }),
      responseType: 'blob' as 'arraybuffer'
    })
    requestPromise
      .then((blob: Blob) => {
        saveAs(blob, fileSending.fileOriginalName)
      })
      .catch((error: Error) => {
        console.log(error)

        this.toastService.showToast({
          title: 'Failed to download sending from ' + fileSending.fromName,
          type: ToastType.ERROR
        })
      })
    return requestPromise
  }
}
