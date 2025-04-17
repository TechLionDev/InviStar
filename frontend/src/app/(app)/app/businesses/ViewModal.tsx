'use client';

import LoadingSpinner from '@/components/loading-spinner';
import {
	Credenza,
	CredenzaContent,
	CredenzaHeader,
	CredenzaTitle,
	CredenzaBody
} from '@/components/ui/credenza';
import { getBusinessById, getBusinessOrders } from '@/lib/pocketbase';
import {
	CalendarIcon,
	ClipboardListIcon,
	EyeIcon,
	MailIcon,
	MapPinIcon,
	PhoneIcon,
	UserIcon,
	StickyNoteIcon
} from 'lucide-react';
import { RecordModel } from 'pocketbase';
import { useEffect, useState } from 'react';
import { Order } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import BusinessOrdersModal from './BusinessOrdersModal';
import { useRouter } from 'next/navigation';

export default function ViewBusinessModal({
	open,
	setOpen,
	businessId
}: {
	open: boolean;
	setOpen: (open: boolean) => void;
	businessId: string;
}) {
	const [isLoading, setIsLoading] = useState(true);
	const [business, setBusiness] = useState<RecordModel | null>(null);
	const [recentOrders, setRecentOrders] = useState<Order[]>([]);
	const [ordersLoading, setOrdersLoading] = useState(true);
	const [showAllOrdersModal, setShowAllOrdersModal] = useState(false);
	const router = useRouter();

	useEffect(() => {
		const fetchData = async () => {
			if (!open) return;

			setIsLoading(true);
			setOrdersLoading(true);

			try {
				const business = await getBusinessById(businessId);
				setBusiness(business);
				setIsLoading(false);

				// Fetch recent orders
				const orders = await getBusinessOrders(businessId, 3);
				setRecentOrders(orders as unknown as Order[]);
			} catch (error) {
				console.error('Error fetching business data:', error);
			} finally {
				setOrdersLoading(false);
			}
		};

		fetchData();
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
		<>
			<Credenza
				open={open}
				onOpenChange={handleOpenChange}
			>
				<CredenzaContent>
					<CredenzaHeader>
						<CredenzaTitle>View Business</CredenzaTitle>
					</CredenzaHeader>
					<CredenzaBody>
						<div className='p-4'>
							{isLoading ? (
								<div className='w-[100%] flex items-center justify-center'>
									<LoadingSpinner global={false} />
								</div>
							) : (
								<div className='space-y-6'>
									<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
										{/* Contact information column */}
										<div className='space-y-3'>
											<h4 className='text-sm font-medium text-muted-foreground'>
												Contact Information
											</h4>
											<div className='space-y-2'>
												<div className='flex items-center'>
													<UserIcon className='size-4 text-muted-foreground' />
													<div className='ml-2 text-sm'>
														{business?.contact}
													</div>
												</div>
												<div className='flex items-center'>
													<PhoneIcon className='size-4 text-muted-foreground' />
													<div className='ml-2 text-sm'>
														{business?.phone}
													</div>
												</div>
												<div className='flex items-center'>
													<MailIcon className='size-4 text-muted-foreground' />
													<div className='ml-2 text-sm'>
														{business?.email}
													</div>
												</div>
											</div>

											{/* Payment Terms */}
											<div className='mt-4'>
												<h4 className='text-sm font-medium text-muted-foreground'>
													Payment Terms
												</h4>
												<div className='text-sm mt-1'>
													{business?.terms}
												</div>
											</div>
										</div>

										{/* Address column */}
										<div className='space-y-3'>
											<h4 className='text-sm font-medium text-muted-foreground'>
												Location
											</h4>
											<div className='flex items-start'>
												<MapPinIcon className='size-4 text-muted-foreground mt-0.5' />
												<div className='ml-2 text-sm'>
													{business?.addressStreet}
													<br />
													{business?.addressCity}
													<br />
													{business?.addressState}
													{', '}
													{business?.addressZip}
												</div>
											</div>
										</div>
									</div>

									{/* Notes Section */}
									{business?.notes && (
										<div className='space-y-3 pt-4 border-t'>
											<h4 className='text-sm font-medium text-muted-foreground flex items-center'>
												<StickyNoteIcon className='size-4 mr-2' />
												Notes
											</h4>
											<div className='bg-muted/40 rounded-md p-3 max-h-[100px] overflow-y-auto'>
												<div className='whitespace-pre-wrap text-sm'>
													{business.notes}
												</div>
											</div>
										</div>
									)}

									{/* Recent Orders Section */}
									<div className='pt-4 border-t'>
										<div className='flex items-center justify-between mb-3'>
											<h4 className='text-sm font-semibold flex items-center gap-2'>
												<ClipboardListIcon className='size-4' />
												Recent Orders
											</h4>
											<Button
												variant='outline'
												size='sm'
												onClick={() =>
													setShowAllOrdersModal(true)
												}
												disabled={
													recentOrders.length === 0
												}
											>
												View All Orders
											</Button>
										</div>

										{ordersLoading ? (
											<div className='w-full flex items-center justify-center py-4'>
												<LoadingSpinner
													global={false}
												/>
											</div>
										) : recentOrders.length > 0 ? (
											<div className='space-y-3'>
												{recentOrders.map((order) => (
													<div
														key={order.id}
														className='border rounded-md p-2.5 flex flex-col gap-1'
													>
														<div className='flex items-center justify-between'>
															<div className='flex items-center gap-2'>
																<span className='font-medium text-sm'>
																	Order #
																	{
																		order.number
																	}
																</span>
																<Badge
																	variant={
																		order.status ===
																		'paid'
																			? 'default'
																			: 'secondary'
																	}
																	className='text-xs'
																>
																	{order.status.toUpperCase()}
																</Badge>
															</div>
															<Button
																variant='secondary'
																size='sm'
																className='h-7 px-2'
																onClick={() =>
																	viewOrder(
																		order.id
																	)
																}
															>
																<EyeIcon
																	size={16}
																/>
																View
															</Button>
														</div>

														<div className='flex items-center justify-between text-xs text-muted-foreground mt-1'>
															<div className='flex items-center gap-1'>
																<CalendarIcon
																	size={12}
																/>
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
													</div>
												))}
											</div>
										) : (
											<div className='text-center py-6 border border-dashed rounded-md'>
												<p className='text-sm text-muted-foreground'>
													No orders found for this
													business.
												</p>
											</div>
										)}
									</div>
								</div>
							)}
						</div>
					</CredenzaBody>
				</CredenzaContent>
			</Credenza>

			{business && (
				<BusinessOrdersModal
					open={showAllOrdersModal}
					setOpen={setShowAllOrdersModal}
					businessId={businessId}
					businessName={business.name}
				/>
			)}
		</>
	);
}
