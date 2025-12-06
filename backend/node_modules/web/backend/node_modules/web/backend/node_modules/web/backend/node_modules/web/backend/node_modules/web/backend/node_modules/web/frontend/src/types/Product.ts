export type Product = {
    _id?: string; 
    name: string;
    slug: string;
    image: string;
    category: string;
    description: string;
    price: number;
    brand: string;
    rating: number;
    countInStock: number;
    variants: Variant[];
    numReviews: number;
}

export type Variant = {
  _id?: string;
  color: string;
  storage: string;
  ram: string;
  price: number;
  countInStock: number;
  image?: string;
}