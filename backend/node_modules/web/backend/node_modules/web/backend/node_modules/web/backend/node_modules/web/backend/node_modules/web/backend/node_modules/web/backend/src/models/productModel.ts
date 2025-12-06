import { modelOptions, prop, getModelForClass } from '@typegoose/typegoose'

class Variant {
  @prop({ required: true })
  public color!: string

  @prop({ required: true })
  public storage!: string

  @prop({ required: true })
  public ram!: string

  @prop({ required: true })
  public price!: number

  @prop({ required: true })
  public countInStock!: number

  @prop()
  public image?: string
}

@modelOptions({ schemaOptions: { timestamps: true } })
export class Product {
  public _id?: string

  @prop({ required: true })
  public name!: string

  @prop({ required: true, unique: true })
  public slug!: string

  @prop({ required: true })
  public brand!: string

  @prop({ required: true })
  public category!: string

  @prop({ required: true })
  public description!: string

  @prop({ required: true, default: 0 })
  public rating!: number

  @prop({ required: true, default: 0 })
  public numReviews!: number

   @prop()
  public image?: string;

  @prop({ default: 0 })
  public price?: number;

  @prop({ default: 0 })
  public countInStock?: number;

  // 🆕 Mảng biến thể
  @prop({ type: () => [Variant], required: true })
  public variants!: Variant[]
}

export const ProductModel = getModelForClass(Product)
