import { RequestType } from "../core/services/socket.service"

export interface ISocketRequest {
  requestType: RequestType
  requestUuid: string
}

export interface ISocketResponse {
  requestUuid: string
}