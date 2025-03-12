import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { OrderServcies } from './order.service';

const createPaymentIntent = catchAsync(async (req, res) => {
  const { amount, email } = req.body;
  const paymentIntent = await OrderServcies.createPaymentIntent(amount, email);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Payment intent created successfully',
    data: paymentIntent,
  });
});
// Create a new order
const createOrder = catchAsync(async (req, res) => {
  const { id }: any = req.user;
  const { productId, quantity } = req.body;

  const result = await OrderServcies.createCheckoutSession(
    productId,
    id,
    quantity,
  );
  res.status(200).json({
    success: true,
    message: 'Checkout session created successfully',
    data: result,
  });
});
// Create a new order
// const createChackOutSession = catchAsync(async (req, res) => {
//   const {
//     productId,
//     quantity,
//     userId,
//     customerName,
//     email,
//     phoneNumber,
//     address,
//   } = req.body;
//   const orderData = {
//     quantity,
//     customerName,
//     email,
//     phoneNumber,
//     address,
//   };

//   const order = await OrderServcies.createCheckoutSession(orderData);

//   sendResponse(res, {
//     success: true,
//     statusCode: StatusCodes.CREATED,
//     message: 'Order created successfully',
//     data: order,
//   });
// });

// // Get order details
// const getOrderById = catchAsync(async (req, res) => {
//   const { orderId } = req.params;
//   const order = await OrderServcies.getOrderById(orderId);
//   sendResponse(res, {
//     success: true,
//     statusCode: StatusCodes.OK,
//     message: 'Order retrieved successfully',
//     data: order,
//   });
// });

export const OrderController = {
  //   createOrder,
  //   getOrderById,
  createPaymentIntent,
  createOrder,
};
