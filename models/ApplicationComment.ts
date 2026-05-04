import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IApplicationComment extends Document {
  applicationStatusId: string
  reviewerName: string
  body: string
  createdAt: Date
  updatedAt: Date
}

const ApplicationCommentSchema = new Schema<IApplicationComment>(
  {
    applicationStatusId: { type: String, required: true, index: true },
    reviewerName: { type: String, required: true },
    body: { type: String, required: true },
  },
  { timestamps: true }
)

export const ApplicationComment: Model<IApplicationComment> =
  mongoose.models.ApplicationComment ??
  mongoose.model<IApplicationComment>('ApplicationComment', ApplicationCommentSchema)
