import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { OrderServcies } from './order.service';

// Create a new order
const createOrder = catchAsync(async (req, res) => {
  const { id }: any = req.user;
  const { productId, quantity } = req.body;

  const result = await OrderServcies.createCheckoutSession(
    productId,
    id,
    quantity,
  );

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Checkout session created successfully',
    data: result,
  });
});
// Create a new order
const getOrders = catchAsync(async (req, res) => {
  const { id }: any = req.user;
  const query = req.query;
  const result = await OrderServcies.getOrders(id, query);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Orders retrieved successfully',
    data: result,
  });
});
const getSingleOrder = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await OrderServcies.getOrderById(id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Order retrieved successfully',
    data: result,
  });
});
const updateOrderStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const result = await OrderServcies.updateOrderStatus(id, status);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Order status updated successfully',
    data: result,
  });
});

export const OrderController = {
  createOrder,
  getOrders,
  getSingleOrder,
  updateOrderStatus
};
