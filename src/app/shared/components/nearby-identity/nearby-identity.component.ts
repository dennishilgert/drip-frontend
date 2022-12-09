import { Component, Input, OnInit, ViewChild } from '@angular/core';
import * as Joi from 'joi';
import { SendingService } from 'src/app/core/services/sending.service';
import { ToastService, ToastType } from 'src/app/core/services/toast.service';
import { IInputValidation } from 'src/app/models/input-validation.model';
import { randomString } from '../../helpers/stringHelper';
import { InputComponent } from '../input/input.component';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-nearby-identity',
  templateUrl: './nearby-identity.component.html',
  styleUrls: ['./nearby-identity.component.css']
})
export class NearbyIdentityComponent implements OnInit {
  @ViewChild('optionsModal') optionsModalComponent!: ModalComponent
  @ViewChild('messageInput') textInputComponent!: InputComponent

  public readonly id: string = randomString(8)
  @Input() name: string = ''
  @Input() distance: string = ''

  private _message: string = ''
  private _messageLoading: boolean = false
  private _messageInputValidation: IInputValidation = {
    valid: true,
    message: '',
    schema: Joi.string().min(1).max(256).required()
  }

  private _fileUploadPlaceholder: string = 'Browse file'
  private _fileUploading: boolean = false

  get messageLoading (): boolean {
    return this._messageLoading
  }

  get messageInputValidation (): IInputValidation {
    return this._messageInputValidation
  }

  get fileUploadPlaceholder (): string {
    return this._fileUploadPlaceholder
  }

  get fileUploading (): boolean {
    return this._fileUploading
  }

  constructor (
    private sendingService: SendingService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
  }

  toggleOptionsModal (event: Event) {
    event.preventDefault()
    this.optionsModalComponent.toggleModal(event)
  }

  updateMessage (message: string) {
    this._message = message
  }

  updateValidation (validation: IInputValidation) {
    this._messageInputValidation = validation
  }

  isValid (): boolean {
    return this._messageInputValidation.valid
  }

  async validate () {
    this.textInputComponent.validate()
  }

  async sendMessage (event: Event) {
    // disable the default form submit behaviour
    event.preventDefault()

    // force the validation of the input elements to check if the form data is ready to be submitted
    // await is needed because otherways the validation might not be done until it will be checked for validity
    await this.validate()
    if (!this.isValid()) {
      return
    }

    this._messageLoading = true

    this.sendingService.sendMessage(this.name, this._message)
      .then(() => {
        this.resetTextInput()

        this.toastService.showToast({
          title: 'Message was sent to ' + this.name,
          type: ToastType.SUCCESS
        })
      })
      .catch(() => {
        this._messageLoading = false
      })
  }

  resetTextInput () {
    this._messageLoading = false
    this.textInputComponent.clearInput(new Event('click'))
  }

  async sendFile (event: Event) {
    // disable the default form submit behaviour
    event.preventDefault()
    
    const fileList: FileList | null = (event.target as HTMLInputElement).files
    console.log(fileList)
    if (!fileList || fileList.length < 1) {
      this._fileUploadPlaceholder = 'Browse file'
      return
    }
    const file: File = fileList[0]
    this._fileUploadPlaceholder = file.name
    this._fileUploading = true

    let formData: FormData = new FormData()
    formData.append('toName', this.name)
    formData.append('fileToSend', file)

    this.sendingService.sendFile(this.name, formData)
      .then(() => {
        this.resetFileUpload(event)
        
        this.toastService.showToast({
          title: 'File was sent to ' + this.name,
          type: ToastType.SUCCESS
        })
      })
      .catch(() => {
        this.resetFileUpload(event)
      })
  }

  resetFileUpload (event: Event) {
    (event.target as HTMLInputElement).value = ''
    this._fileUploading = false
    this._fileUploadPlaceholder = 'Browse file'
  }
}
