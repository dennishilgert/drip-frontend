import * as Joi from "joi"

export interface IInputValidation {
  valid: boolean
  message: string
  schema: Joi.Schema
}