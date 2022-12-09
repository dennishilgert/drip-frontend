import { ISendingRequest } from "./sending.model"

export interface IPopup {
  id?: string
  title: string
  sendingRequest: ISendingRequest
  leftButtonCallback?: Function
  rightButtonCallback?: Function
  triggeredAt?: Date
}