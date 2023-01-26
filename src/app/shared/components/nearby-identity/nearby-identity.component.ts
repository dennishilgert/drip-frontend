import { Component, Input, ViewChild } from '@angular/core'
import * as Joi from 'joi'
import { CommunicationService } from 'src/app/core/services/communication.service'
import { TransmissionService } from 'src/app/core/services/transmission.service'
import { SocketRequestTimeoutError } from 'src/app/core/services/socket.service'
import { ToastService, ToastType } from 'src/app/core/services/toast.service'
import { ICommunicationRequest } from 'src/app/models/communication.model'
import { IInputValidation } from 'src/app/models/input-validation.model'
import { ITransmissionConfirmation, ITransmissionResponse } from 'src/app/models/transmission.model'
import { ISocketResponse } from 'src/app/models/socket.model'
import { randomString } from '../../helpers/stringHelper'
import { InputComponent } from '../input/input.component'
import { ModalComponent } from '../modal/modal.component'

@Component({
  selector: 'app-nearby-identity',
  templateUrl: './nearby-identity.component.html',
  styleUrls: ['./nearby-identity.component.css']
})
export class NearbyIdentityComponent {
  @ViewChild('optionsModal') optionsModalComponent!: ModalComponent
  @ViewChild('messageInput') textInputComponent!: InputComponent

  public readonly id: string = randomString(8)
  @Input() name = ''
  @Input() distance = ''

  private _message = ''
  private _messageLoading = false
  private _messageInputValidation: IInputValidation = {
    valid: true,
    message: '',
    schema: Joi.string().max(256).required().messages({
      'string.max': 'The message should not exceed the length of {#limit} characters'
    })
  }

  private _filePlaceholder = 'Browse file'
  private _fileLoading = false
  private _fileInputValidation: IInputValidation = {
    valid: true,
    message: '',
    schema: Joi.string().min(3).max(128).required().messages({
      'string.empty': 'A file is required',
      'string.min': 'The filename must be at least {#limit} characters long',
      'string.max': 'The filename should not exceed the length of {#limit} characters'
    })
  }

  get messageLoading(): boolean {
    return this._messageLoading
  }

  get messageInputValidation(): IInputValidation {
    return this._messageInputValidation
  }

  get filePlaceholder(): string {
    return this._filePlaceholder
  }

  get fileLoading(): boolean {
    return this._fileLoading
  }

  get fileInputValidation(): IInputValidation {
    return this._fileInputValidation
  }

  constructor(
    private transmissionService: TransmissionService,
    private communicationService: CommunicationService,
    private toastService: ToastService
  ) {}

  toggleOptionsModal(event: Event) {
    event.preventDefault()
    this.optionsModalComponent.toggleModal(event)
  }

  updateMessage(message: string) {
    this._message = message
  }

  updateMessageValidation(validation: IInputValidation) {
    this._messageInputValidation = validation
  }

  updateFileValidation(validation: IInputValidation) {
    this._fileInputValidation = validation
  }

  isValid(): boolean {
    return this._messageInputValidation.valid
  }

  async validate() {
    this.textInputComponent.validate()
  }

  resetTextInput() {
    this._messageLoading = false
    this.textInputComponent.clearInput(new Event('click'))
  }

  resetFileUpload(event: Event) {
    ;(event.target as HTMLInputElement).value = ''
    this._fileLoading = false
    this._filePlaceholder = 'Browse file'
  }

  async sendMessage(event: Event) {
    // disable the default form submit behaviour
    event.preventDefault()

    // force the validation of the input elements to check if the form data is ready to be submitted
    // await is needed because otherways the validation might not be done until it will be checked for validity
    await this.validate()
    if (!this.isValid()) {
      return
    }
    this._messageLoading = true

    this.transmissionService
      .transmitMessage(this.name, this._message)
      .then((transmissionConfirmation: ITransmissionConfirmation) => {
        const communicationRequest: ICommunicationRequest = {
          requestUuid: transmissionConfirmation.requestUuid,
          toName: this.name
        }
        return this.communicationService.openRequest(communicationRequest)
      })
      .then((socketResponse: ISocketResponse) => {
        const transmissionResponse: ITransmissionResponse = socketResponse as ITransmissionResponse
        this.resetTextInput()

        if (transmissionResponse.accepted) {
          this.toastService.showToast({
            title: `${this.name} accepted your message transmission`,
            type: ToastType.SUCCESS
          })
          return
        }
        this.toastService.showToast({
          title: `${this.name} has declined your message transmission`,
          type: ToastType.ERROR
        })
      })
      .catch((error: Error) => {
        if (error instanceof SocketRequestTimeoutError) {
          this.toastService.showToast({
            title: `${this.name} has not responded to your message transmission`,
            type: ToastType.ERROR
          })
        }
        this._messageLoading = false
      })
  }

  async sendFile(event: Event) {
    // disable the default form submit behaviour
    event.preventDefault()

    const file: File = ((event.target as HTMLInputElement).files as FileList)[0]
    this._filePlaceholder = file.name
    this._fileLoading = true

    const formData: FormData = new FormData()
    formData.append('toName', this.name)
    formData.append('fileToTransmit', file)

    this.transmissionService
      .transmitFile(this.name, formData)
      .then((transmissionConfirmation: ITransmissionConfirmation) => {
        const communicationRequest: ICommunicationRequest = {
          requestUuid: transmissionConfirmation.requestUuid,
          toName: this.name
        }
        return this.communicationService.openRequest(communicationRequest)
      })
      .then((socketResponse: ISocketResponse) => {
        const transmissionResponse: ITransmissionResponse = socketResponse as ITransmissionResponse
        this.resetFileUpload(event)

        if (transmissionResponse.accepted) {
          this.toastService.showToast({
            title: `${this.name} accepted your file transmission`,
            type: ToastType.SUCCESS
          })
          return
        }
        this.toastService.showToast({
          title: `${this.name} has declined your file transmission`,
          type: ToastType.ERROR
        })
      })
      .catch((error: Error) => {
        if (error instanceof SocketRequestTimeoutError) {
          this.toastService.showToast({
            title: `${this.name} has not responded to your file transmission`,
            type: ToastType.ERROR
          })
        }
        this.resetFileUpload(event)
      })
  }
}
