import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IDocumentRef {
  fieldName: string
  fileName: string
  fileUrl: string
  uploadedAt: Date
}

export interface ISubmissionData extends Document {
  applicationStatusId: string
  userId: string
  programId: string
  answers: Record<string, unknown>
  documents: IDocumentRef[]
  submittedAt: Date
}

const DocumentRefSchema = new Schema<IDocumentRef>(
  {
    fieldName: { type: String, required: true },
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: false }
)

const SubmissionDataSchema = new Schema<ISubmissionData>(
  {
    applicationStatusId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    programId: { type: String, required: true },
    answers: { type: Schema.Types.Mixed, default: {} },
    documents: [DocumentRefSchema],
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

export const SubmissionData: Model<ISubmissionData> =
  mongoose.models.SubmissionData ??
  mongoose.model<ISubmissionData>('SubmissionData', SubmissionDataSchema)
