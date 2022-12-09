import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { IIdentity } from 'src/app/models/identity.model';
import { IFileSending, ISendingRequest, ISendingResponse, IMessageSending } from 'src/app/models/sending.model';
import { NearbyService } from './nearby.service';
import { PopupService } from './popup.service';
import { SendingService } from './sending.service';
import { StateService } from './state.service';

export enum SocketEvent {
  CONNECT = 'connect',
  CONNECT_ERROR = 'connect_error',
  DISCONNECT = 'disconnect',
  IDENTIFY = 'identify',
  UPDATED_GEOLOCATION = 'updated:geolocation',
  UPDATE_NEARBY_GEOLOCATION = 'update:nearby-geolocation',
  UPDATE_NEARBY_IP = 'update:nearby-ip',
  SENDING_REQUEST = 'request:sending',
  SENDING_RESPONSE = 'response:sending',
  MESSAGE_SENDING = 'data:message-sending',
  FILE_SENDING = 'data:file-sending'
}

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private readonly socket: Socket

  constructor (
    private stateService: StateService,
    private nearbyService: NearbyService,
    private sendingService: SendingService,
    private popupService: PopupService
  ) {
    this.socket = io('http://localhost:8082', {
      autoConnect: false
    })
  }

  async init (identity: IIdentity) {
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

    this.socket.on(SocketEvent.SENDING_REQUEST, (request: string) => {
      const sendingRequest: ISendingRequest = JSON.parse(request)

      this.popupService.showPopup({
        title: 'Sending request from ' + sendingRequest.fromName,
        sendingRequest,
        leftButtonCallback: () => {
          const sendingResponse: ISendingResponse = {
            accepted: false
          }
          this.emitEvent(SocketEvent.SENDING_RESPONSE, JSON.stringify(sendingResponse))
          this.popupService.dismissPopup()
        },
        rightButtonCallback: () => {
          const sendingResponse: ISendingResponse = {
            accepted: true
          }
          this.emitEvent(SocketEvent.SENDING_RESPONSE, JSON.stringify(sendingResponse))
          this.popupService.dismissPopup()
        }
      })
    })

    this.socket.on(SocketEvent.MESSAGE_SENDING, (data: string) => {
      const messageSending: IMessageSending = JSON.parse(data)
      this.sendingService.addSendingToInbox(messageSending)
    })

    this.socket.on(SocketEvent.FILE_SENDING, (data: string) => {
      const fileSending: IFileSending = JSON.parse(data)
      this.sendingService.addSendingToInbox(fileSending)
      this.sendingService.downloadSending(fileSending)
    })
  }

  emitEvent (event: string, data?: string): void {
    if (!this.socket.connected) {
      console.log('Cannot emit event - socket not connected')
      return
    }
    this.socket.emit(event, data)
  }
}
