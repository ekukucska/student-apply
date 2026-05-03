import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IFormField {
  name: string
  label: string
  type: 'text' | 'email' | 'number' | 'select' | 'textarea' | 'file'
  required: boolean
  options?: string[]
}

export interface IDynamicForm extends Document {
  programId: string
  programType: 'BACHELOR' | 'MASTER' | 'CERTIFICATE'
  fields: IFormField[]
}

const FormFieldSchema = new Schema<IFormField>(
  {
    name: { type: String, required: true },
    label: { type: String, required: true },
    type: {
      type: String,
      enum: ['text', 'email', 'number', 'select', 'textarea', 'file'],
      required: true,
    },
    required: { type: Boolean, default: false },
    options: [{ type: String }],
  },
  { _id: false }
)

const DynamicFormSchema = new Schema<IDynamicForm>(
  {
    programId: { type: String, required: true, index: true },
    programType: {
      type: String,
      enum: ['BACHELOR', 'MASTER', 'CERTIFICATE'],
      required: true,
    },
    fields: [FormFieldSchema],
  },
  { timestamps: true }
)

export const DynamicForm: Model<IDynamicForm> =
  mongoose.models.DynamicForm ??
  mongoose.model<IDynamicForm>('DynamicForm', DynamicFormSchema)
