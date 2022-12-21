import { Component, EventEmitter, Input, Output } from '@angular/core'
import * as Joi from 'joi'
import { IInputValidation } from 'src/app/models/input-validation.model'
import { randomString } from '../../helpers/stringHelper'
import { isSupported } from '../../utils/mimeTypeUtil'

@Component({
  selector: 'app-file-input',
  templateUrl: './file-input.component.html',
  styleUrls: ['./file-input.component.css']
})
export class FileInputComponent {
  readonly id: string = randomString(8)
  @Input() placeholder = ''
  @Input() name = ''
  @Input() value = ''
  @Input() validation: IInputValidation = { valid: true, message: '', schema: Joi.any() }
  @Input() loading = false
  @Input() disabled = false
  @Output() inputChange: EventEmitter<Event> = new EventEmitter<Event>()
  @Output() validationChange: EventEmitter<IInputValidation> = new EventEmitter<IInputValidation>()

  previousValue = ''

  get isValid (): boolean {
    return this.validation.valid
  }

  validate (): void {
    // return if the value hasn't changed since the last validation
    if (this.previousValue && this.previousValue === this.value) {
      return
    }

    const fileList: FileList | null = (document.getElementById(this.id) as HTMLInputElement).files
    // return if the event emitting element does not contain a file - should not happen!
    if (!fileList || fileList.length < 1) return
    const file: File = fileList[0]

    // validate the file type
    if (!isSupported(file.type)) {
      this.updateValidation(false, 'This type of file is not supported')
      return
    }
    // valite the file size
    if (file.size > 5242880) {
      this.updateValidation(false, 'The file exceeds the max file size of 5 MB')
      return
    }
    // validate the value against the defined schema
    const { error } = this.validation.schema.validate(file.name)
    // if the validation fails, update the validity and message
    if (error) {
      this.updateValidation(false, error.details[0].message)
      return
    }
    this.updateValidation(true, '')
  }

  private updateValidation (valid: boolean, message: string): void {
    // emit the validation updaten event to update the validation object in the parent as well
    // this will display the validation result to the user
    this.validation = { valid: valid, message: message, schema: this.validation.schema }
    this.validationChange.emit(this.validation)
    this.previousValue = this.value || ''
  }

  reset (): void {
    this.value = ''
  }

  onInputChange (event: Event): void {
    event.preventDefault()

    this.validate()

    if (!this.isValid) {
      this.reset()
      return
    }

    this.inputChange.emit(event)
  }
}
