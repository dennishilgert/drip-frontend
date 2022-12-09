import { ToastType } from "../core/services/toast.service"

export interface IToast {
  id?: string
  title: string
  content?: string
  show?: boolean
  type?: ToastType
  triggeredAt?: Date
}