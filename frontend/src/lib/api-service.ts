import { pocketbase as pb } from './pocketbase';
import { Order } from './types';

export interface ApiResponse<T> {
	success: boolean;
	data?: T;
	error?: string;
}

// Generic fetch function with error handling
async function fetchWithErrorHandling<T>(
	fetchFn: () => Promise<T>
): Promise<ApiResponse<T>> {
	try {
		const data = await fetchFn();
		return { success: true, data };
	} catch (error) {
		console.error('API Error:', error);
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: 'Unknown error occurred'
		};
	}
}

// Dashboard related API calls
export const DashboardService = {
	// Get revenue data for the dashboard
	getRevenueData: async (period = 6) => {
		return fetchWithErrorHandling(async () => {
			const response = await pb.collection('orders').getList(1, 100, {
				sort: '-created',
				filter: `created >= "${getDateBefore(period)}"`
			});

			// Group by month and calculate revenue and expenses
			const monthlyData = processOrdersForRevenue(response.items as unknown as Order[]);
			return monthlyData;
		});
    },

	// Get orders data for the dashboard
	getOrdersData: async (days = 7) => {
		return fetchWithErrorHandling(async () => {
			// Fetch sales orders
			const salesOrdersResponse = await pb
				.collection('orders')
				.getList(1, 100, {
					sort: '-created',
					filter: `created >= "${getDateBefore(
						days,
						'days'
					)}" && type = "sales"`
				});

			// Fetch purchase orders
			const purchaseOrdersResponse = await pb
				.collection('orders')
				.getList(1, 100, {
					sort: '-created',
					filter: `created >= "${getDateBefore(
						days,
						'days'
					)}" && type = "purchase"`
				});

			// Process data for chart visualization
			return processOrdersForChart(
				salesOrdersResponse.items as unknown as Order[],
				purchaseOrdersResponse.items as unknown as Order[],
				days
			);
		});
	},

	// Get businesses data
	getBusinesses: async () => {
		return fetchWithErrorHandling(async () => {
			const response = await pb.collection('businesses').getList(1, 10, {
				sort: 'name'
			});
			return response.items;
		});
	},

	// Get recent activity for the dashboard
	getRecentActivity: async () => {
		return fetchWithErrorHandling(async () => {
			// Get recent orders
			const recentOrders = await pb.collection('orders').getList(1, 3, {
				sort: '-created',
				expand: 'customer,business'
			});

			// Get low stock alerts
			const lowStockProducts = await pb
				.collection('products')
				.getList(1, 3, {
					sort: 'quantity',
					filter: 'quantity <= min_quantity'
				});

			// Combine into activity items
			return {
				recentOrders: recentOrders.items,
				lowStockProducts: lowStockProducts.items
			};
		});
	},

	// Get summary statistics
	getSummaryStats: async () => {
		return fetchWithErrorHandling(async () => {
			// Fetch total revenue from orders
			const currentMonthOrders = await pb
				.collection('orders')
				.getList(1, 1000, {
					filter: `created >= "${getDateBefore(1, 'months')}"`,
					fields: 'total,type'
				});

			const prevMonthOrders = await pb
				.collection('orders')
				.getList(1, 1000, {
					filter: `created >= "${getDateBefore(
						2,
						'months'
					)}" && created < "${getDateBefore(1, 'months')}"`,
					fields: 'total,type'
				});

			// Fetch product count
			const products = await pb.collection('products').getList(1, 1, {
				fields: 'id'
			});

			// Fetch this week's orders
			const thisWeekOrders = await pb
				.collection('orders')
				.getList(1, 1000, {
					filter: `created >= "${getDateBefore(1, 'weeks')}"`,
					fields: 'id,type'
				});

			const lastWeekOrders = await pb
				.collection('orders')
				.getList(1, 1000, {
					filter: `created >= "${getDateBefore(
						2,
						'weeks'
					)}" && created < "${getDateBefore(1, 'weeks')}"`,
					fields: 'id,type'
				});

			// Calculate revenue and trends
			const currentMonthRevenue = currentMonthOrders.items
				.filter((order) => order.type === 'sales')
				.reduce((sum, order) => sum + Number(order.total), 0);

			const prevMonthRevenue = prevMonthOrders.items
				.filter((order) => order.type === 'sales')
				.reduce((sum, order) => sum + Number(order.total), 0);

			const revenueTrend =
				prevMonthRevenue > 0
					? ((currentMonthRevenue - prevMonthRevenue) /
							prevMonthRevenue) *
					  100
					: 0;

			// Calculate profit
			const currentMonthExpenses = currentMonthOrders.items
				.filter((order) => order.type === 'purchase')
				.reduce((sum, order) => sum + Number(order.total), 0);

			const profit = currentMonthRevenue - currentMonthExpenses;
			const profitMargin =
				currentMonthRevenue > 0
					? (profit / currentMonthRevenue) * 100
					: 0;

			// Order trends
			const thisWeekOrderCount = thisWeekOrders.totalItems;
			const lastWeekOrderCount = lastWeekOrders.totalItems;
			const orderTrend =
				lastWeekOrderCount > 0
					? ((thisWeekOrderCount - lastWeekOrderCount) /
							lastWeekOrderCount) *
					  100
					: 0;

			return {
				revenue: {
					value: currentMonthRevenue,
					trend: revenueTrend
				},
				orders: {
					value: thisWeekOrderCount,
					trend: orderTrend
				},
				products: {
					value: products.totalItems,
					trend: 0 // We don't have historical product data in this simple example
				},
				profitMargin: {
					value: profitMargin,
					trend: 0 // Would need historical profit margin data
				}
			};
		});
	}
};

// Helper functions
function getDateBefore(
	amount: number,
	unit: 'days' | 'weeks' | 'months' = 'months'
): string {
	const date = new Date();

	if (unit === 'days') {
		date.setDate(date.getDate() - amount);
	} else if (unit === 'weeks') {
		date.setDate(date.getDate() - amount * 7);
	} else {
		date.setMonth(date.getMonth() - amount);
	}

	return date.toISOString().split('T')[0];
}

function processOrdersForRevenue(orders: Order[]) {
	const monthNames = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec'
	];
	const currentMonth = new Date().getMonth();

	// Generate last 6 months
    const months: string[] = [];
	for (let i = 5; i >= 0; i--) {
		const monthIndex = (currentMonth - i + 12) % 12;
		months.push(monthNames[monthIndex]);
	}

	const revenueByMonth: Record<string, number> = {};
	const expensesByMonth: Record<string, number> = {};

	// Initialize with zeros
	months.forEach((month) => {
		revenueByMonth[month] = 0;
		expensesByMonth[month] = 0;
	});

	// Process orders
	orders.forEach((order) => {
		const date = new Date(order.created);
		const month = monthNames[date.getMonth()];

		// Only process for the months we're displaying
		if (months.includes(month)) {
			if (order.type === 'sales') {
				revenueByMonth[month] += Number(order.total);
			} else if (order.type === 'purchase') {
				expensesByMonth[month] += Number(order.total);
			}
		}
	});

	return {
		categories: months,
		revenue: months.map((month) => revenueByMonth[month]),
		expenses: months.map((month) => expensesByMonth[month])
	};
}

function processOrdersForChart(
	salesOrders: Order[],
	purchaseOrders: Order[],
	days: number
) {
	// Create an array of the last 'days' days
	const daysArray: string[] = [];
	for (let i = days - 1; i >= 0; i--) {
		const date = new Date();
		date.setDate(date.getDate() - i);
		daysArray.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
	}

	// Initialize data with zeros
	const salesData = new Array(days).fill(0);
	const purchaseData = new Array(days).fill(0);

	// Process sales orders
	salesOrders.forEach((order) => {
		const date = new Date(order.created);
		const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
		const index = daysArray.indexOf(dayName);

		if (index !== -1) {
			salesData[index] += 1;
		}
	});

	// Process purchase orders
	purchaseOrders.forEach((order) => {
		const date = new Date(order.created);
		const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
		const index = daysArray.indexOf(dayName);

		if (index !== -1) {
			purchaseData[index] += 1;
		}
	});

	return {
		categories: daysArray,
		sales: salesData,
		purchases: purchaseData
	};
}
