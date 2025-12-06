import { modelOptions, prop } from '@typegoose/typegoose'
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import { getModelForClass } from '@typegoose/typegoose'

class ProductVariant {
  @prop()
  color?: string

  @prop()
  storage?: string

  @prop()
  ram?: string

  @prop()
  price?: number

  @prop()
  countInStock?: number

  @prop()
  image?: string
}

@modelOptions({ schemaOptions: { timestamps: true } })
export class Compare extends TimeStamps {
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

  @prop({ required: true })
  public productBrand!: string

  @prop({ required: true })
  public productCategory!: string

  @prop({ required: true })
  public productRating!: number

  @prop({ required: true })
  public productNumReviews!: number

  // ✅ Thêm variant details
  @prop({ type: () => ProductVariant })
  public selectedVariant?: ProductVariant

  @prop({ type: () => [ProductVariant] })
  public allVariants?: ProductVariant[]
}

export const CompareModel = getModelForClass(Compare)