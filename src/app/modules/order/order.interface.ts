import { Document, Schema } from 'mongoose';

export interface IOrder extends Document {
  userId: Schema.Types.ObjectId;
  productName: string;
  quantity: number;
  price: number;
  totalPrice: number;
  customerName: string;
  email: string;
  phoneNumber: string;
  address: string;
  paymentStatus: string;
  deliveryStatus: string;
  checkoutSessionId: string;
  paymentIntentId: string;
}
