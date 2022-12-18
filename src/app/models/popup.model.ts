import { ISocketRequest } from "./socket.model"

export interface IPopup {
  id?: string
  title: string
  content: string
  socketRequest: ISocketRequest
  leftButtonCallback?: Function
  rightButtonCallback?: Function
  triggeredAt?: Date
}