import bcrypt from 'bcryptjs'
import { Product } from "./models/productModel";
import type { User } from "./models/userModel";


export const sampleProducts:Product[] = [
    {
        name: 'Free Shirt1',
        slug: 'free-shirt1',
        image: '/images/p1.jpg',
        category: 'Shirts', 
        description: 'A popular shirt',
        price: 1000000,
        brand: 'Nike',
        rating: 4.5,
        countInStock: 20,
        numReviews: 10,
    },
    {
        name: 'Free Shirt2',
        slug: 'free-shirt2',
        image: '/images/p2.jpg',
        category: 'Shirts', 
        description: 'A popular shirt',
        price: 7000000,
        brand: 'Nike',
        rating: 4.5,
        countInStock: 20,
        numReviews: 10,
    },
    {
        name: 'Free Shirt3',
        slug: 'free-shirt3',
        image: '/images/p3.jpg',
        category: 'Shirts', 
        description: 'A popular shirt',
        price: 7000000,
        brand: 'Nike',
        rating: 4.5,
        countInStock: 20,
        numReviews: 10,
    },
    {
        name: 'Free Shirt4',
        slug: 'free-shirt4',
        image: '/images/p4.jpg',
        category: 'Shirts', 
        description: 'A popular shirt',
        price: 7000000,
        brand: 'Nike',
        rating: 4.5,
        countInStock: 20,
        numReviews: 10,
    },
]

export const sampleUsers: User[] = [
     {
       name: 'Joe',
       email: 'admin@example.com',
       password: bcrypt.hashSync('123456'),
       isAdmin: true,
     },
     {
       name: 'John',
       email: 'user@example.com',
       password: bcrypt.hashSync('123456'),
       isAdmin: false,
     },
   ]