import express from 'express';
import { UserRouter } from '../app/modules/user/user.route';
import { AuthRouter } from '../app/modules/auth/auth.route';
import { VendorRouter } from '../app/modules/vendor/vendors/vendor.route';
import { ProductRoutes } from '../app/modules/products/products.route';
import SettingsRouter from '../app/modules/sattings/sattings.route';
import { OrderRoutes } from '../app/modules/order/order.route';
import { AdminDashboardRoute } from '../app/modules/admin/dashboard/dashboard.route';
import { EarningRoute } from '../app/modules/admin/earning/earning.route';

const router = express.Router();
const routes = [
  {
    path: '/auth',
    route: AuthRouter,
  },
  {
    path: '/users',
    route: UserRouter,
  },
  {
    path: '/vendor',
    route: VendorRouter,
  },
  {
    path: '/product',
    route: ProductRoutes,
  },
  {
    path: '/settings',
    route: SettingsRouter,
  },
  {
    path: '/orders',
    route: OrderRoutes,
  },
  {
    path: '/admin',
    route: AdminDashboardRoute,
  },
  {
    path: '/admin',
    route: EarningRoute,
  },
];

routes.forEach((element) => {
  if (element?.path && element?.route) {
    router.use(element?.path, element?.route);
  }
});

export default router;
