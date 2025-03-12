import { StatusCodes } from 'http-status-codes';
import stripe from '../../../config/stripe';
import AppError from '../../../errors/AppError';
import { Order } from './order.model';
import { Product } from '../products/product.model';
import { User } from '../user/user.model';
import QueryBuilder from '../../builder/QueryBuilder';
import generateOrderNumber from '../../../utils/genarateOrderNumber';
import { OrderStatus } from './order.interface';

// create cheakout session
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
      allowed_countries: ['US', 'CA', 'GB', 'BD'],
    },
    metadata: {
      productId: product.id,
    },
    phone_number_collection: {
      enabled: true,
    },
  });
  const order = new Order({
    customerId: userId,
    userId: isExistProduct.userId,
    orderNumber: generateOrderNumber(),
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
// get all the orders
const getOrders = async (userId: string, query: Record<string, unknown>) => {
  const queryBuilder = new QueryBuilder(
    Order.find({ userId, paymentStatus: 'paid' }),
    query,
  );
  const orders = await queryBuilder
    .filter()
    .sort()
    .paginate()
    .fields()
    .modelQuery.exec();

  const pagination = await queryBuilder.countTotal();
  return { orders, pagination };
};
const getOrderById = async (id: string) => {
  const order = await Order.findById(id);
  if (!order) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Order not found');
  }
  return order;
};
// update the order status
const updateOrderStatus = async (id: string, payload: OrderStatus) => {
  const order = await Order.findById(id).select('deliveryStatus');
  if (!order) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Order not found');
  }
  const currentStatus = order?.deliveryStatus;

  if (currentStatus === 'canceled') {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'Order is canceled. No more status changes are allowed',
    );
  }

  if (currentStatus === 'delivered') {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'Cannot update status. Order is already delivered',
    );
  }

  if (currentStatus === 'pending' && payload !== 'proseccing') {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'Order can only be moved from pending to proseccing',
    );
  }
  if (currentStatus === 'proseccing' && payload !== 'delivered') {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'Order can only be moved from proseccing to delivered',
    );
  }
  order.deliveryStatus = payload;
  await order.save();
  return order;
};
export const OrderServcies = {
  createCheckoutSession,
  getOrders,
  getOrderById,
  updateOrderStatus,
};
