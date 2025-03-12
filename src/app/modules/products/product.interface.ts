import mongoose, { Document } from 'mongoose';
export interface IReview {
  userId: mongoose.Schema.Types.ObjectId;
  rating: number;
  reviewText: string;
  date: Date;
}

export interface IProduct extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  name: string;
  description: string;
  price: number;
  quality: string;
  quantity: number;
  moodTag: string[];
  potency: string;
  genetics: string;
  origin: string;
  type: string;
  scent: string;
  image: string[];
  reviews: IReview[];
  isDeleted: boolean;
}
