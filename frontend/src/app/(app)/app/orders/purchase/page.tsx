'use client';

import { isLoggedIn, getAllPurchaseOrders } from '@/lib/pocketbase';
import { useEffect, useState } from 'react';
import OrderList from '../OrderList';
import LoadingSpinner from '@/components/loading-spinner';
import { Order } from '@/lib/types';
import OrderView from '../OrderView';

function Orders() {
	const [isLoading, setIsLoading] = useState(true);
	const [orders, setOrders] = useState<Order[] | null>(null);

	const refreshOrderList = async () => {
		const orders = (await getAllPurchaseOrders()) as unknown as Order[];
		setOrders(orders);
	};

	useEffect(() => {
		if (isLoggedIn()) {
			(async () => {
				await refreshOrderList();
				setIsLoading(false);
			})();
		}
	}, []);

	if (isLoading) {
		return (
			<div className='w-[100%] h-[100%] flex items-center justify-center'>
				<LoadingSpinner />
			</div>
		);
	}

	return (
		<>
			<div className='flex py-4'>
				<OrderList
					orders={orders || []}
					refreshOrderList={refreshOrderList}
					type='purchase'
				/>
			</div>

			{/* Add the OrderView component to handle URL parameters */}
			<OrderView />
		</>
	);
}

export default Orders;
