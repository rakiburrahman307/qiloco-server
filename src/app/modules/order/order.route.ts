import express from 'express';
import { OrderController } from './order.controller';
import auth from '../../middleware/auth';
import { USER_ROLES } from '../../../enums/user';


const router = express.Router();

// Route to create a payment intent and order
router.post(
  '/create-chaekout-session',
  auth(USER_ROLES.USER),
  OrderController.createOrder,
);

// Webhook route to listen for Stripe events (payment success, failure, etc.)
// router.post('/webhook', bodyParser.raw({ type: 'application/json' }), stripeWebhook);

export const OrderRoutes = router;
