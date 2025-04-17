/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useEffect, useState } from 'react';
import {
	Activity,
	ArrowUpRight,
	BarChart4,
	CircleDollarSign,
	Package2Icon,
	ShoppingCart
} from 'lucide-react';
import Link from 'next/link';

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from '@/components/ui/card';
import { AreaChart, BarChart } from '@/components/ui/charts';
import { StatsCard } from '@/components/stats-card';
import { DashboardService } from '@/lib/api-service';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Business } from '@/lib/types';

// Interface for dashboard state
interface DashboardState {
	revenueData: {
		categories: string[];
		revenue: number[];
		expenses: number[];
	} | null;
	ordersData: {
		categories: string[];
		sales: number[];
		purchases: number[];
	} | null;
	businesses: Business[] | null;
	stats: {
		revenue: { value: number; trend: number };
		orders: { value: number; trend: number };
		products: { value: number; trend: number };
		profitMargin: { value: number; trend: number };
	} | null;
	loading: {
		revenue: boolean;
		orders: boolean;
		businesses: boolean;
		stats: boolean;
	};
}

function Dashboard() {
	// State for dashboard data
	const [state, setState] = useState<DashboardState>({
		revenueData: null,
		ordersData: null,
		businesses: null,
		stats: null,
		loading: {
			revenue: true,
			orders: true,
			businesses: true,
			stats: true
		}
	});

	// Generic state updater function
	const updateState = <K extends keyof DashboardState>(
		key: K,
		value: DashboardState[K],
		loadingKey?: keyof DashboardState['loading']
	) => {
		setState((prev) => ({
			...prev,
			[key]: value,
			...(loadingKey && {
				loading: {
					...prev.loading,
					[loadingKey]: false
				}
			})
		}));
	};

	// Fetch revenue data
	const fetchRevenueData = async () => {
		const response = await DashboardService.getRevenueData();
		if (response.success && response.data) {
			updateState('revenueData', response.data, 'revenue');
		} else {
			updateState('revenueData', null, 'revenue');
		}
	};

	// Fetch orders data
	const fetchOrdersData = async () => {
		const response = await DashboardService.getOrdersData();
		if (response.success && response.data) {
			updateState('ordersData', response.data, 'orders');
		} else {
			updateState('ordersData', null, 'orders');
		}
	};

	// Fetch businesses
	const fetchBusinesses = async () => {
		const response = await DashboardService.getBusinesses();
		if (response.success && response.data) {
			updateState(
				'businesses',
				response.data as unknown as Business[],
				'businesses'
			);
		} else {
			updateState('businesses', null, 'businesses');
		}
	};

	// Fetch summary statistics
	const fetchSummaryStats = async () => {
		const response = await DashboardService.getSummaryStats();
		if (response.success && response.data) {
			updateState('stats', response.data, 'stats');
		} else {
			updateState('stats', null, 'stats');
		}
	};

	// Load all data on component mount
	useEffect(() => {
		fetchRevenueData();
		fetchOrdersData();
		fetchBusinesses();
		fetchSummaryStats();
	}, []);

	// Check if all data is loading
	const isLoading = Object.values(state.loading).some((loading) => loading);

	if (isLoading) {
		return <DashboardLoadingState />;
	}

	return (
		<div className='container mx-auto px-4 py-8'>
			<div className='flex flex-col gap-8'>
				<div>
					<h1 className='text-3xl font-bold tracking-tight'>
						Dashboard
					</h1>
				</div>

				{/* Stats Cards */}
				<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
					{state.stats ? (
						<>
							<StatsCard
								title='Total Revenue'
								value={formatCurrency(
									state.stats.revenue.value
								)}
								icon={<CircleDollarSign className='h-5 w-5' />}
								description='this month'
								trend={state.stats.revenue.trend}
							/>
							<StatsCard
								title='Total Orders'
								value={state.stats.orders.value}
								icon={<ShoppingCart className='h-5 w-5' />}
								description='this week'
								trend={state.stats.orders.trend}
							/>
							<StatsCard
								title='Products'
								value={state.stats.products.value}
								icon={<Package2Icon className='h-5 w-5' />}
								description='in inventory'
								trend={state.stats.products.trend}
							/>
							<StatsCard
								title='Profit Margin'
								value={`${state.stats.profitMargin.value.toFixed(
									1
								)}%`}
								icon={<BarChart4 className='h-5 w-5' />}
								description='this month'
								trend={state.stats.profitMargin.trend}
							/>
						</>
					) : (
						Array(4)
							.fill(0)
							.map((_, i) => (
								<Card
									key={i}
									className='flex flex-col justify-center items-center p-6'
								>
									<Skeleton className='h-20 w-full' />
								</Card>
							))
					)}
				</div>

				{/* Revenue and Expenses Charts - Separated into two cards */}
				<div className='grid gap-4 md:grid-cols-2'>
					<Card>
						<CardHeader>
							<CardTitle>Revenue</CardTitle>
							<CardDescription>
								Monthly revenue for the last 6 months
							</CardDescription>
						</CardHeader>
						<CardContent>
							{state.revenueData ? (
								<AreaChart
									series={[
										{
											name: 'Revenue',
											data: state.revenueData.revenue,
											color: 'var(--color-success)'
										}
									]}
									categories={state.revenueData.categories}
								/>
							) : (
								<div className='h-[300px] flex items-center justify-center'>
									<Skeleton className='h-[250px] w-full' />
								</div>
							)}
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Expenses</CardTitle>
							<CardDescription>
								Monthly expenses for the last 6 months
							</CardDescription>
						</CardHeader>
						<CardContent>
							{state.revenueData ? (
								<AreaChart
									series={[
										{
											name: 'Expenses',
											data: state.revenueData.expenses,
											color: 'var(--color-warning)'
										}
									]}
									categories={state.revenueData.categories}
								/>
							) : (
								<div className='h-[300px] flex items-center justify-center'>
									<Skeleton className='h-[250px] w-full' />
								</div>
							)}
						</CardContent>
					</Card>
				</div>

				{/* Orders Data - Split into Sales Orders and Purchase Orders */}
				<div className='grid gap-4 md:grid-cols-2'>
					<Card>
						<CardHeader>
							<CardTitle>Sales Orders</CardTitle>
							<CardDescription>
								Daily sales for the past week
							</CardDescription>
						</CardHeader>
						<CardContent>
							{state.ordersData ? (
								<BarChart
									series={[
										{
											name: 'Sales Orders',
											data: state.ordersData.sales,
											color: 'var(--color-info)'
										}
									]}
									categories={state.ordersData.categories}
								/>
							) : (
								<div className='h-[300px] flex items-center justify-center'>
									<Skeleton className='h-[250px] w-full' />
								</div>
							)}
						</CardContent>
						<CardFooter>
							<div className='flex justify-end w-full'>
								<Button
									asChild
									variant='outline'
									size='sm'
								>
									<Link
										href='/app/orders/sales'
										className='flex items-center gap-1'
									>
										View Sales Orders{' '}
										<ArrowUpRight className='h-4 w-4' />
									</Link>
								</Button>
							</div>
						</CardFooter>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Purchase Orders</CardTitle>
							<CardDescription>
								Daily purchases for the past week
							</CardDescription>
						</CardHeader>
						<CardContent>
							{state.ordersData ? (
								<BarChart
									series={[
										{
											name: 'Purchase Orders',
											data: state.ordersData.purchases,
											color: 'var(--color-accent)'
										}
									]}
									categories={state.ordersData.categories}
								/>
							) : (
								<div className='h-[300px] flex items-center justify-center'>
									<Skeleton className='h-[250px] w-full' />
								</div>
							)}
						</CardContent>
						<CardFooter>
							<div className='flex justify-end w-full'>
								<Button
									asChild
									variant='outline'
									size='sm'
								>
									<Link
										href='/app/orders/purchase'
										className='flex items-center gap-1'
									>
										View Purchase Orders{' '}
										<ArrowUpRight className='h-4 w-4' />
									</Link>
								</Button>
							</div>
						</CardFooter>
					</Card>
				</div>

				{/* View All Orders Button - Now separate section */}
				<div className='flex justify-end'>
					<Button
						asChild
						variant='default'
						size='default'
					>
						<Link
							href='/app/orders'
							className='flex items-center gap-1'
						>
							View All Orders <ArrowUpRight className='h-4 w-4' />
						</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}

// Loading state component
function DashboardLoadingState() {
	return (
		<div className='container mx-auto px-4 py-8'>
			<div className='flex flex-col gap-8'>
				<div>
					<Skeleton className='h-10 w-64 mb-2' />
					<Skeleton className='h-5 w-full max-w-xl' />
				</div>

				{/* Stats Cards Loading */}
				<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
					{Array(4)
						.fill(0)
						.map((_, i) => (
							<Card key={i}>
								<CardHeader className='pb-2'>
									<Skeleton className='h-5 w-24' />
								</CardHeader>
								<CardContent>
									<Skeleton className='h-8 w-20 mb-2' />
									<Skeleton className='h-4 w-32' />
								</CardContent>
							</Card>
						))}
				</div>

				{/* Charts Loading */}
				<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
					<Card className='lg:col-span-5'>
						<CardHeader>
							<Skeleton className='h-6 w-40 mb-1' />
							<Skeleton className='h-4 w-60' />
						</CardHeader>
						<CardContent>
							<div className='h-[300px] flex items-center justify-center'>
								<Activity className='h-16 w-16 animate-pulse text-muted-foreground opacity-30' />
							</div>
						</CardContent>
					</Card>

					<Card className='lg:col-span-2'>
						<CardHeader>
							<Skeleton className='h-6 w-32 mb-1' />
							<Skeleton className='h-4 w-48' />
						</CardHeader>
						<CardContent>
							<div className='space-y-4'>
								<Skeleton className='h-14 w-full' />
								<Skeleton className='h-14 w-full' />
								<Skeleton className='h-14 w-full' />
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Orders Chart Loading */}
				<Card>
					<CardHeader>
						<Skeleton className='h-6 w-40 mb-1' />
						<Skeleton className='h-4 w-60' />
					</CardHeader>
					<CardContent>
						<div className='h-[300px] flex items-center justify-center'>
							<Activity className='h-16 w-16 animate-pulse text-muted-foreground opacity-30' />
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

export default Dashboard;
