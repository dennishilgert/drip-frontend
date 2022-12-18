import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as Joi from 'joi';
import { IInputValidation } from 'src/app/models/input-validation.model';
import { randomString } from '../../helpers/stringHelper';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent implements OnInit {
  readonly id: string = randomString(8)
  @Input() placeholder: string = ''
  @Input() name: string = ''
  @Input() inputType: string = 'text'
  @Input() value: string = ''
  @Input() validation: IInputValidation = { valid: true, message: '', schema: Joi.any() }
  @Input() forceValidation: number = 0
  @Input() disabled: boolean = false
  @Output() onInputChange: EventEmitter<string> = new EventEmitter<string>()
  @Output() onValidationChange: EventEmitter<IInputValidation> = new EventEmitter<IInputValidation>()

  previousValue: string = ''
  initialInputType: string = 'text'
  visible: boolean = false

  get isValid (): boolean {
    return this.validation.valid
  }

  get isVisible (): boolean {
    return this.visible
  }

  constructor () { }

  ngOnInit (): void {
    this.initialInputType = this.inputType
  }

  validate (): void {
    // return if the value hasn't changed since the last validation
    if (this.previousValue && this.previousValue === this.value) {
      return
    }
    let valid = true
    let message = ''
    // define custom validation messages that will be displayed to the user instead of the predefined ones
    const schema = this.validation.schema.messages({
      'any.empty': 'This field is required',
      'string.empty': 'This field is required'
    })
    // validate the value against the defined schema
    const { error } = schema.validate(this.value)
    // if the validation fails, update the validity and message
    if (error) {
      valid = false
      message = error.details[0].message
    }
    // emit the validation updaten event to update the validation object in the parent as well
    // this will display the validation result to the user
    this.validation = { valid: valid, message: message, schema: this.validation.schema }
    this.onValidationChange.emit(this.validation)
    this.previousValue = this.value || ''
  }

  clearInput (event: Event): void {
    event.preventDefault()
    this.value = ''
    this.onInputChange.emit(this.value)
  }

  changeInputVisibility (event: Event): void {
    event.preventDefault()
    this.visible = !this.visible
    if (this.visible) {
      this.inputType = 'text'
      return
    }
    this.inputType = this.initialInputType
  }
}
