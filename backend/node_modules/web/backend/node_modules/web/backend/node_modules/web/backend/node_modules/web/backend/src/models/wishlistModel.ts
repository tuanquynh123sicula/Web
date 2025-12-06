import { modelOptions, prop } from '@typegoose/typegoose'
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import { getModelForClass } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { timestamps: true } })
export class Wishlist extends TimeStamps {
  public _id?: string

  @prop({ required: true, index: true })
  public userId!: string

  @prop({ required: true, index: true })
  public productId!: string

  @prop({ required: true })
  public productName!: string

  @prop({ required: true })
  public productImage!: string

  @prop({ required: true })
  public productPrice!: number

  @prop({ required: true })
  public productSlug!: string
}

export const WishlistModel = getModelForClass(Wishlist)