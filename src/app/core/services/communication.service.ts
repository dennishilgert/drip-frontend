import { Injectable } from '@angular/core';
import { ICommunicationRequest } from 'src/app/models/communication.model';
import { ISocketResponse } from 'src/app/models/socket.model';
import { SocketEvent, SocketRequestTimeoutError, SocketService } from './socket.service';

export class CommunicationRequest {

  private readonly communicationService: CommunicationService
  readonly requestUuid: string
  readonly toName: string

  constructor (
    communicationService: CommunicationService,
    request: ICommunicationRequest
  ) {
    this.communicationService = communicationService
    this.requestUuid = request.requestUuid
    this.toName = request.toName
  }

  async listenForResponse (): Promise<ISocketResponse> {
    return new Promise<ISocketResponse>((resolve: (socketResponse: ISocketResponse) => void, reject: (error: Error) => void) => {
      const responseListener: (...args: any[]) => void = (data: string) => {
        const socketResponse: ISocketResponse = JSON.parse(data)
        if (socketResponse.requestUuid === this.requestUuid) {
          this.closeRequest(responseListener, timeoutListener)
          return resolve(socketResponse)
        }
      }
      const timeoutListener: (...args: any[]) => void = (data: string) => {
        const socketResponse: ISocketResponse = JSON.parse(data)
        if (socketResponse.requestUuid === this.requestUuid) {
          this.closeRequest(responseListener, timeoutListener)
          return reject(new SocketRequestTimeoutError('Socket Request timed out'))
        }
      }
      this.communicationService.injectListener(SocketEvent.RESPONSE, responseListener)
      this.communicationService.injectListener(SocketEvent.REQUEST_TIMEOUT, timeoutListener)
    })
  }

  private closeRequest (responseListener: (...args: any[]) => void, timeoutListener: (...args: any[]) => void) {
    this.communicationService.removeListener(SocketEvent.RESPONSE, responseListener)
    this.communicationService.removeListener(SocketEvent.REQUEST_TIMEOUT, timeoutListener)
    this.communicationService.closeRequest(this.requestUuid)
  }
}

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {

  private pendingRequests: Map<string, CommunicationRequest> = new Map<string, CommunicationRequest>()

  constructor(
    private socketService: SocketService
  ) { }

  async openRequest (request: ICommunicationRequest): Promise<ISocketResponse> {
    const communicationRequest: CommunicationRequest = new CommunicationRequest(this, request)
    this.pendingRequests.set(request.requestUuid, communicationRequest)
    return communicationRequest.listenForResponse()
  }

  closeRequest (requestUuid: string): void {
    if (this.pendingRequests.has(requestUuid)) {
      this.pendingRequests.delete(requestUuid)
    }
  }

  injectListener (event: string, listener: (...args: any[]) => void): void {
    this.socketService.injectListener(event, listener)
  }

  removeListener (event: string, listener: (...args: any[]) => void): void {
    this.socketService.removeListener(event, listener)
  }
}
