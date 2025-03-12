import { Schema, model } from 'mongoose';
import { IOrder } from './order.interface';

const orderSchema = new Schema<IOrder>({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },  
  productName: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  customerName: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  address: { type: String, required: true },
  paymentStatus: { type: String, default: 'pending' }, 
  deliveryStatus: { type: String, default: 'pending' },
  checkoutSessionId: { type: String, required: true },
  paymentIntentId: { type: String}, 
  
}, { timestamps: true });

export const Order = model<IOrder>('Order', orderSchema);
