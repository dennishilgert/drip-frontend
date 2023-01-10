import { Injectable } from '@angular/core'
import { io, Socket } from 'socket.io-client'
import { IIdentity } from 'src/app/models/identity.model'
import { IPopup } from 'src/app/models/popup.model'
import { ITransmissionRequest, ITransmissionResponse } from 'src/app/models/transmission.model'
import { ISocketRequest, ISocketResponse } from 'src/app/models/socket.model'
import { NearbyService } from './nearby.service'
import { PopupBuilder, PopupService } from './popup.service'
import { StateService } from './state.service'
import { ToastService, ToastType } from './toast.service'
import { environment } from 'src/environments/environment'

export enum SocketEvent {
  CONNECT = 'connect',
  CONNECT_ERROR = 'connect_error',
  DISCONNECT = 'disconnect',
  IDENTIFY = 'identify',
  REQUEST = 'request',
  REQUEST_TIMEOUT = 'request:timeout',
  REQUEST_RETRACTED = 'request:retracted',
  RESPONSE = 'response',
  UPDATED_GEOLOCATION = 'updated:geolocation',
  UPDATE_NEARBY_GEOLOCATION = 'update:nearby-geolocation',
  UPDATE_NEARBY_IP = 'update:nearby-ip',
  MESSAGE_TRANSMISSION = 'transmission:message',
  FILE_TRANSMISSION = 'transmission:file'
}

export enum RequestType {
  MESSAGE_TRANSMISSION = 'message-transmission',
  FILE_TRANSMISSION = 'file-transmission'
}

export class SocketRequestTimeoutError extends Error {}

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private readonly url: string = environment.socket.url
  private readonly socket: Socket

  constructor(
    private stateService: StateService,
    private nearbyService: NearbyService,
    private toastService: ToastService,
    private popupService: PopupService
  ) {
    this.socket = io(this.url, {
      autoConnect: false
    })
  }

  async init(identity: IIdentity) {
    this.socket.connect()

    this.socket.on(SocketEvent.CONNECT, () => {
      console.log('Socket connected')

      this.stateService.socketReady = true
      this.emitEvent(SocketEvent.IDENTIFY, identity.uuid)
    })

    this.socket.on(SocketEvent.DISCONNECT, (reason: Socket.DisconnectReason) => {
      console.log('Socket disconnected', reason)
    })

    this.socket.on(SocketEvent.CONNECT_ERROR, (error: Error) => {
      console.log('Socket connection failed. Attempting again ...', error)
      setTimeout(() => {
        this.socket.connect()
      }, 3000)
    })

    this.socket.on(SocketEvent.UPDATE_NEARBY_IP, () => {
      this.nearbyService.updateNearbyIpIdentities()
    })

    this.socket.on(SocketEvent.UPDATE_NEARBY_GEOLOCATION, () => {
      this.nearbyService.updateNearbyGeolocationIdentities()
    })

    this.socket.on(SocketEvent.REQUEST, (request: string) => {
      const socketRequest: ISocketRequest = JSON.parse(request)

      if (
        socketRequest.requestType === RequestType.MESSAGE_TRANSMISSION ||
        socketRequest.requestType === RequestType.FILE_TRANSMISSION
      ) {
        const transmissionRequest: ITransmissionRequest = socketRequest as ITransmissionRequest
        this.showRequestPopup(transmissionRequest)
      }
    })

    this.socket.on(SocketEvent.REQUEST_RETRACTED, (data: string) => {
      const socketResponse: ISocketResponse = JSON.parse(data)
      this.popupService.retractPopup(socketResponse.requestUuid)
    })
  }

  emitEvent(event: string, data?: string): void {
    if (!this.socket.connected) {
      this.toastService.showToast({
        title: 'Failed to emit event - socket not connected',
        type: ToastType.ERROR
      })

      console.log('Cannot emit event - socket not connected')
      return
    }
    this.socket.emit(event, data)
  }

  sendResponse(requestUuid: string, data?: any): void {
    const socketResponse: ISocketResponse = {
      requestUuid,
      ...data
    }
    this.emitEvent(SocketEvent.RESPONSE, JSON.stringify(socketResponse))
  }

  injectListener(event: string, listener: (...args: any[]) => void): void {
    this.socket.on(event, listener)
  }

  removeListener(event: string, listener: (...args: any[]) => void): void {
    this.socket.removeListener(event, listener)
  }

  private showRequestPopup(socketRequest: ISocketRequest): void {
    switch (socketRequest.requestType) {
      case RequestType.MESSAGE_TRANSMISSION: {
        const transmissionRequest: ITransmissionRequest = socketRequest as ITransmissionRequest
        const popup: IPopup = new PopupBuilder()
          .title(`${transmissionRequest.fromName} would like to share a message`)
          .content('Message')
          .request(socketRequest)
          .leftButton(() => {
            this.sendResponse(socketRequest.requestUuid, { accepted: false } as ITransmissionResponse)
          })
          .rightButton(() => {
            this.sendResponse(socketRequest.requestUuid, { accepted: true } as ITransmissionResponse)
          })
          .build()
        this.popupService.showPopup(popup)
        break
      }
      case RequestType.FILE_TRANSMISSION: {
        const transmissionRequest: ITransmissionRequest = socketRequest as ITransmissionRequest
        const popup: IPopup = new PopupBuilder()
          .title(`${transmissionRequest.fromName} would like to share a file`)
          .content(transmissionRequest.fileOriginalName as string)
          .request(socketRequest)
          .leftButton(() => {
            this.sendResponse(socketRequest.requestUuid, { accepted: false } as ITransmissionResponse)
          })
          .rightButton(() => {
            this.sendResponse(socketRequest.requestUuid, { accepted: true } as ITransmissionResponse)
          })
          .build()
        this.popupService.showPopup(popup)
        break
      }
      default: {
        const popup: IPopup = new PopupBuilder()
          .title(socketRequest.requestType)
          .content(socketRequest.requestType)
          .request(socketRequest)
          .leftButton(() => {
            console.log('Unknown request type')
          })
          .rightButton(() => {
            console.log('Unknown request type')
          })
          .build()
        this.popupService.showPopup(popup)
        break
      }
    }
  }
}
