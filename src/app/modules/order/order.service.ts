import { StatusCodes } from 'http-status-codes';
import stripe from '../../../config/stripe';
import AppError from '../../../errors/AppError';
import { Order } from './order.model';
import { Product } from '../products/product.model';
import { User } from '../user/user.model';

const createPaymentIntent = async (amount: number, email: string) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Number(amount),
    currency: 'usd',
    receipt_email: email,
  });
  return paymentIntent.client_secret;
};

const createOrder = async (payload: any) => {
  const result = await Order.create(payload);
  if (!result) {
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Failed to create order',
    );
  }
  return result;
};

const createCheckoutSession = async (
  productId: string,
  userId: string,
  quantity: number,
) => {
  const isUserExist = await User.findById(userId);
  if (!isUserExist) {
    throw new Error('User not found');
  }
  const isExistProduct = await Product.findById(productId);
  if (!isExistProduct) {
    throw new Error('product not found');
  }

  const product = await stripe.products.create({
    name: isExistProduct.name,
  });
  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: isExistProduct.price * 100,
    currency: 'usd',
  });
  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    success_url: 'http://localhost:3000',
    cancel_url: 'http://localhost:3000',
    line_items: [
      {
        price: price.id,
        quantity: quantity,
      },
    ],
    shipping_address_collection: {
      allowed_countries: ['US', 'CA', 'GB', 'BD'], // List allowed countries for shipping address (you can add others)
    },
    metadata: {
      productId: product.id,
    },
    phone_number_collection: {
      enabled: true,
    },
  });
  const order = new Order({
    userId,
    productName: isExistProduct.name,
    quantity: quantity,
    price: isExistProduct.price,
    totalPrice: isExistProduct.price * quantity,
    customerName: isUserExist.name,
    email: isUserExist.email,
    phoneNumber: '123-456-7890',
    address: 'Customer Address',
    paymentStatus: 'pending',
    deliveryStatus: 'pending',
    checkoutSessionId: checkoutSession.id,
    paymentIntentId: '',
  });

  await order.save(); // Sa

  return {
    url: checkoutSession.url,
    paymentIntentId: checkoutSession.payment_intent,
  };
};

// Handle failed payment
export const handlePaymentIntentFailed = async (event: any) => {
  const paymentIntent = event.data.object;
  const orderId = paymentIntent.metadata.orderId;

  //   // Find the order by orderId
  //   const order = await Order.findById(orderId);
  //   if (!order) {
  //     throw new AppError(404, 'Order not found');
  //   }

  //   // Update the order status to 'failed'
  //   order.status = 'failed';
  //   await order.save();

  console.log(`Payment for Order ID ${orderId} failed`);
};
export const OrderServcies = {
  createPaymentIntent,
  createOrder,
  createCheckoutSession,
};
