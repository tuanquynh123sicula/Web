import { modelOptions, prop } from '@typegoose/typegoose'
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import { getModelForClass } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { timestamps: true } })
export class Review extends TimeStamps {
  public _id?: string

  @prop({ required: true, index: true })
  public productId!: string

  @prop({ required: true })
  public userId!: string

  @prop({ required: true })
  public userName!: string

  @prop({ required: true })
  public userEmail!: string

  @prop({ required: true, min: 1, max: 5 })
  public rating!: number

  @prop({ required: true })
  public title!: string

  @prop({ required: true })
  public comment!: string

  @prop({ default: false })
  public isVerifiedPurchase!: boolean

  @prop({ default: 0 })
  public helpful!: number
}

export const ReviewModel = getModelForClass(Review)