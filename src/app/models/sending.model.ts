import { SendingType } from "../core/services/sending.service"

export interface ISendingRequest {
  fromName: string
  type: SendingType
  fileOriginalName?: string
  fileMimeType?: string
}

export interface ISendingResponse {
  accepted: boolean
}

export interface ISending {
  fromName: string
  receivedAt?: Date
}

export interface ICombinedSending extends ISending {
  message?: string
  uuid?: string
  fileOriginalName?: string
  fileName?: string
  fileMimeType?: string
}

export interface IMessageSending extends ISending {
  message: string
}

export interface IFileSending extends ISending {
  uuid: string
  fromName: string
  fileOriginalName: string
  fileMimeType: string
}