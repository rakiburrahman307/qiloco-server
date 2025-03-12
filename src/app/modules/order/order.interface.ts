import { Document, Schema } from 'mongoose';

export interface IOrder extends Document {
  customerId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  orderNumber: string;
  productName: string;
  quantity: number;
  price: number;
  totalPrice: number;
  customerName: string;
  email: string;
  phoneNumber: string;
  address: string;
  paymentStatus: string;
  deliveryStatus: 'pending' | 'proseccing' | 'delivered' | 'canceled';
  checkoutSessionId: string;
  paymentIntentId: string;
}
export type OrderStatus = 'pending' | 'proseccing' | 'delivered' | 'canceled';
