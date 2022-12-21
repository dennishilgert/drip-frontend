import { ISocketRequest, ISocketResponse } from './socket.model'

export interface ITransmissionRequest extends ISocketRequest {
  fromName: string
  fileOriginalName?: string
  fileMimeType?: string
}

export interface ITransmissionConfirmation {
  requestUuid: string
}

export interface ITransmissionResponse extends ISocketResponse {
  accepted: boolean
}

export interface ITransmission {
  uuid: string
  fromName: string
  receivedAt?: Date
}

export interface ICombinedTransmission extends ITransmission {
  message?: string
  fileOriginalName?: string
  fileName?: string
  fileMimeType?: string
}

export interface IMessageTransmission extends ITransmission {
  message: string
}

export interface IFileTransmission extends ITransmission {
  uuid: string
  fromName: string
  fileOriginalName: string
  fileMimeType: string
}