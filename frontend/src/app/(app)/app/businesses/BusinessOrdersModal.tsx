'use client';

import LoadingSpinner from '@/components/loading-spinner';
import {
	Credenza,
	CredenzaContent,
	CredenzaHeader,
	CredenzaTitle,
	CredenzaBody
} from '@/components/ui/credenza';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getBusinessOrders } from '@/lib/pocketbase';
import { useEffect, useState } from 'react';
import { Order } from '@/lib/types';
import { CalendarIcon, EyeIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function BusinessOrdersModal({
	open,
	setOpen,
	businessId,
	businessName
}: {
	open: boolean;
	setOpen: (open: boolean) => void;
	businessId: string;
	businessName: string;
}) {
	const [isLoading, setIsLoading] = useState(true);
	const [orders, setOrders] = useState<Order[]>([]);
	const router = useRouter();

	useEffect(() => {
		const fetchOrders = async () => {
			if (!open) return;

			setIsLoading(true);
			try {
				const ordersData = await getBusinessOrders(businessId);
				setOrders(ordersData as unknown as Order[]);
			} catch (error) {
				console.error('Error fetching business orders:', error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchOrders();
	}, [businessId, open]);

	// Handle close by navigating back
	const handleOpenChange = (open: boolean) => {
		setOpen(open);
	};

	const viewOrder = (orderId: string) => {
		router.push(`/app/orders?view=${orderId}&from=businesses`);
		setOpen(false);
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString(undefined, {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	};

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD'
		}).format(amount);
	};

	return (
		<Credenza
			open={open}
			onOpenChange={handleOpenChange}
		>
			<CredenzaContent className='max-w-4xl'>
				<CredenzaHeader>
					<CredenzaTitle>
						{businessName} - Order History
					</CredenzaTitle>
				</CredenzaHeader>
				<CredenzaBody>
					<div className='p-4'>
						{isLoading ? (
							<div className='w-full flex items-center justify-center py-8'>
								<LoadingSpinner global={false} />
							</div>
						) : orders.length > 0 ? (
							<div className='space-y-4'>
								<div className='grid grid-cols-1 gap-3 max-h-[60vh] overflow-y-auto pr-2'>
									{orders.map((order) => (
										<div
											key={order.id}
											className='border rounded-md p-3 space-y-2 hover:bg-muted/40 transition-colors'
										>
											<div className='flex items-center justify-between'>
												<div className='flex items-center gap-2'>
													<span className='font-medium'>
														Order #{order.number}
													</span>
													<Badge
														variant={
															order.status ===
															'paid'
																? 'default'
																: 'secondary'
														}
													>
														{order.status}
													</Badge>
													<Badge
														variant='outline'
														className='capitalize'
													>
														{order.type}
													</Badge>
												</div>
												<Button
													variant='ghost'
													size='sm'
													className='flex items-center gap-1.5'
													onClick={() =>
														viewOrder(order.id)
													}
												>
													<EyeIcon size={16} />
													<span>View</span>
												</Button>
											</div>

											<div className='flex items-center justify-between text-sm text-muted-foreground'>
												<div className='flex items-center gap-1'>
													<CalendarIcon size={14} />
													<span>
														{formatDate(
															order.created
														)}
													</span>
												</div>
												<div className='font-medium'>
													{formatCurrency(
														order.total
													)}
												</div>
											</div>

											{order.expand?.products && (
												<div className='text-sm text-muted-foreground'>
													{
														order.expand.products
															.length
													}{' '}
													product
													{order.expand.products
														.length !== 1
														? 's'
														: ''}
												</div>
											)}
										</div>
									))}
								</div>
							</div>
						) : (
							<div className='text-center py-8'>
								<p className='text-muted-foreground'>
									No orders found for this business.
								</p>
							</div>
						)}
					</div>
				</CredenzaBody>
			</CredenzaContent>
		</Credenza>
	);
}
