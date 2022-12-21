import { HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { ICombinedTransmission, IFileTransmission, IMessageTransmission, ITransmission, ITransmissionConfirmation } from 'src/app/models/transmission.model'
import { ApiService } from './api.service'
import { IdentityService } from './identity.service'
import { ToastService, ToastType } from './toast.service'
import { saveAs } from 'file-saver'
import { SocketEvent, SocketService } from './socket.service'

@Injectable({
  providedIn: 'root'
})
export class TransmissionService {
  private _inbox: ICombinedTransmission[] = []
  private _unreadTransmissions = false

  get inbox (): ICombinedTransmission[] {
    return this._inbox.sort((a: ICombinedTransmission, b: ICombinedTransmission) => {
      if ((a.receivedAt as Date) < (b.receivedAt as Date)) return 1 // b's timestamp is bigger
      if ((a.receivedAt as Date) > (b.receivedAt as Date)) return -1 // a's timestamp is bigger
      return 0
    })
  }

  get unreadTransmissions (): boolean {
    return this._unreadTransmissions
  }

  set unreadTransmissions (unreadTransmissions: boolean) {
    this._unreadTransmissions = unreadTransmissions
  }

  constructor (
    private apiService: ApiService,
    private identityService: IdentityService,
    private socketService: SocketService,
    private toastService: ToastService
  ) {
    this.listenForTransmissions()
  }

  listenForTransmissions (): void {
    this.socketService.injectListener(SocketEvent.MESSAGE_TRANSMISSION, (data: string) => {
      const messageTransmission: IMessageTransmission = JSON.parse(data)
      this.retrieveMessageTransmission(messageTransmission)
        .then((message: string) => {
          messageTransmission.message = message
          this.addTransmissionToInbox(messageTransmission)
        })
    })

    this.socketService.injectListener(SocketEvent.FILE_TRANSMISSION, (data: string) => {
      const fileTransmission: IFileTransmission = JSON.parse(data)
      this.retrieveFileTransmission(fileTransmission)
        .then(() => {
          this.addTransmissionToInbox(fileTransmission)
        })
    })
  }

  addTransmissionToInbox (transmission: ITransmission): void {
    transmission.receivedAt = new Date()
    this._inbox.push(transmission)

    this._unreadTransmissions = true
  }

  clearInbox (): void {
    this._inbox = []
  }

  async transmitMessage (toName: string, message: string): Promise<ITransmissionConfirmation> {
    const requestPromise: Promise<ITransmissionConfirmation> = this.apiService.doPostRequest('/transmissions/message', { toName, message }, new HttpHeaders({ 'Authorization': `Bearer ${this.identityService.getIdentityUuid}` }))
    requestPromise
      .catch((error: Error) => {
        console.log(error)

        this.toastService.showToast({
          title: 'Failed to transmit message to ' + toName,
          type: ToastType.ERROR
        })
      })
    return requestPromise
  }

  async transmitFile (toName: string, formData: FormData): Promise<ITransmissionConfirmation> {
    const requestPromise: Promise<ITransmissionConfirmation> = this.apiService.doPostRequest('/transmissions/file', formData, new HttpHeaders({ 'Authorization': `Bearer ${this.identityService.getIdentityUuid}` }))
    requestPromise
      .catch((error: Error) => {
        console.log(error)

        this.toastService.showToast({
          title: 'Failed to transmit file to ' + toName,
          type: ToastType.ERROR
        })
      })
    return requestPromise
  }

  async retrieveMessageTransmission (messageTransmission: IMessageTransmission): Promise<string> {
    const requestPromise: Promise<string> = this.apiService.doGetRequest<string>(`/transmissions/message/${messageTransmission.uuid}`, {
      headers: new HttpHeaders({ 'Authorization': `Bearer ${this.identityService.getIdentityUuid}` }),
      responseType: 'text' as 'arraybuffer'
    })
    requestPromise
      .then((message: string) => {
        return message
      })
      .catch((error: Error) => {
        console.log(error)
        this.toastService.showToast({
          title: 'Failed to retrieve message transmission from ' + messageTransmission.fromName,
          type: ToastType.ERROR
        })
      })
    return requestPromise
  }

  async retrieveFileTransmission (fileTransmission: IFileTransmission): Promise<Blob> {
    const requestPromise: Promise<Blob> = this.apiService.doGetRequest<Blob>(`/transmissions/file/${fileTransmission.uuid}`, { 
      headers: new HttpHeaders({ 'Authorization': `Bearer ${this.identityService.getIdentityUuid}` }),
      responseType: 'blob' as 'arraybuffer'
    })
    requestPromise
      .then((blob: Blob) => {
        saveAs(blob, fileTransmission.fileOriginalName)
      })
      .catch((error: Error) => {
        console.log(error)
        this.toastService.showToast({
          title: 'Failed to retrieve file transmission from ' + fileTransmission.fromName,
          type: ToastType.ERROR
        })
      })
    return requestPromise
  }
}
