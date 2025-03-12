import { StatusCodes } from 'http-status-codes';
import { Order } from '../../order/order.model';
import { User } from '../../user/user.model';
import AppError from '../../../../errors/AppError';
// Function to calculate monthly growth
const calculateMonthlyGrowth = (salesData: { totalSales: number }[]) => {
  let growth = 0;
  const firstMonthSales = salesData[0].totalSales;
  const lastMonthSales = salesData[salesData.length - 1].totalSales;

  // Calculate growth percentage between the first and last month of the data
  if (firstMonthSales !== 0) {
    growth = ((lastMonthSales - firstMonthSales) / firstMonthSales) * 100;
  }

  return growth.toFixed(2); // Return as percentage with two decimal places
};
const getTotalUser = async () => {
  const totalShops = await User.countDocuments();
  return totalShops;
};

// total admin revenue
const totalRevenue = async (): Promise<number> => {
  const result = await Order.aggregate([
    {
      $match: { paymentStatus: 'paid' },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: { $multiply: ['$totalPrice', 0.1] } },
      },
    },
  ]);

  return result.length > 0 ? result[0].totalRevenue : 0;
};
// Get Total Revenue Chart Data for monthly

const productOverview = async (year: number) => {
  const startDate = new Date(`${year}-01-01T00:00:00Z`);
  const endDate = new Date(`${year + 1}-01-01T00:00:00Z`);

  // Aggregate revenue data for the year
  const revenueChart = await Order.aggregate([
    {
      $match: {
        paymentStatus: 'paid',
        createdAt: { $gte: startDate, $lt: endDate },
      },
    },
    {
      $group: {
        _id: { $month: '$createdAt' },
        totalRevenue: { $sum: '$totalPrice' },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Months of the year
  const monthsOfYear = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];


  
};

export const AdminDashboardService = {
  getTotalUser,
  totalRevenue,
  productOverview,
};
