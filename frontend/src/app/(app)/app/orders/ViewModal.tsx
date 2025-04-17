'use client';

import LoadingSpinner from '@/components/loading-spinner';
import { Badge } from '@/components/ui/badge';
import {
	Credenza,
	CredenzaContent,
	CredenzaHeader,
	CredenzaTitle,
	CredenzaBody
} from '@/components/ui/credenza';
import { getOrderById, getProductImage } from '@/lib/pocketbase';
import Image from 'next/image';
import {
	CalendarDaysIcon,
	FolderCogIcon,
	HistoryIcon,
	TagIcon,
	StickyNoteIcon
} from 'lucide-react';
import { RecordModel } from 'pocketbase';
import { useEffect, useState } from 'react';
import { Order, Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import InvoicesModal from './InvoicesModal';

export default function ViewOrderModal({
	open,
	setOpen,
	orderId
}: {
	open: boolean;
	setOpen: (open: boolean) => void;
	orderId: string;
}) {
	const [isLoading, setIsLoading] = useState(true);
	const [order, setOrder] = useState<RecordModel | null>(null);
	const [invoicesModalOpen, setInvoicesModalOpen] = useState(false);

	useEffect(() => {
		(async () => {
			const order = await getOrderById(orderId);
			setOrder(order);
			setIsLoading(false);
		})();
	}, [orderId]);

	// Handle close by navigating back
	const handleOpenChange = (open: boolean) => {
		setOpen(open);
	};

	function getTotalItemCount() {
		if (!order?.expand?.products) {
			return 0;
		}

		// Sum the quantity of all products in the order
		return order.expand.products.reduce(
			(total: number, item: { quantity: number }) => {
				return total + (item.quantity || 0);
			},
			0
		);
	}

	return (
		<>
			<Credenza
				open={open}
				onOpenChange={handleOpenChange}
			>
				<CredenzaContent>
					<CredenzaHeader>
						<CredenzaTitle>View Order</CredenzaTitle>
					</CredenzaHeader>
					<CredenzaBody>
						{order && !isLoading && (
							<div className='flex w-full items-center justify-end'>
								<Button
									variant='ghost'
									size='sm'
									className='flex gap-2'
									onClick={() => setInvoicesModalOpen(true)}
								>
									<HistoryIcon className='size-4' />
									<span>Invoices</span>
								</Button>
							</div>
						)}
						<div className='p-4'>
							{isLoading ? (
								<div className='w-[100%] flex items-center justify-center'>
									<LoadingSpinner global={false} />
								</div>
							) : (
								<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
									{/* Contact information column */}
									<div className='space-y-3'>
										<h4 className='text-sm font-medium text-muted-foreground'>
											Order Information
										</h4>
										<div className='space-y-2'>
											<div className='flex items-center'>
												<CalendarDaysIcon className='size-4 mr-2' />
												<div className='text-sm'>
													{new Date(
														order?.date
													).toLocaleString()}
												</div>
											</div>
											<div className='flex items-center'>
												<FolderCogIcon className='size-4 mr-2' />
												<div className='text-sm capitalize'>
													{order?.status}
												</div>
											</div>
											<div className='flex items-center'>
												<TagIcon className='size-4 mr-2' />
												<div className='text-sm capitalize'>
													{order?.type}
												</div>
											</div>
										</div>
									</div>

									{/* Address column */}
									<div className='space-y-3'>
										<h4 className='text-sm font-medium text-muted-foreground'>
											Financial Details
										</h4>
										<div className='space-y-2'>
											<div className='flex items-center'>
												<div className='text-sm font-medium mr-2'>
													Subtotal:
												</div>
												<div className='text-sm'>
													$
													{order?.subtotal.toFixed(2)}
												</div>
											</div>
											{order?.discount > 0 && (
												<div className='flex items-center'>
													<div className='text-sm font-medium mr-2'>
														Discount:
													</div>
													<div className='text-sm text-green-600'>
														-$
														{order?.discount.toFixed(
															2
														)}
													</div>
												</div>
											)}
											<div className='flex items-center'>
												<div className='text-sm font-medium mr-2'>
													Tax:
												</div>
												<div className='text-sm'>
													${order?.tax.toFixed(2)}
												</div>
											</div>
											<div className='flex items-center'>
												<div className='text-sm font-medium mr-2'>
													Total:
												</div>
												<div className='text-sm font-bold'>
													${order?.total.toFixed(2)}
												</div>
											</div>
										</div>
									</div>
									{/* Products List */}
									<div className='space-y-3 md:col-span-2 mt-4'>
										<h4 className='text-sm font-medium text-muted-foreground'>
											Products
										</h4>
										{order?.expand?.products &&
										order.expand.products.length > 0 ? (
											<div className='space-y-4'>
												<div className='bg-muted/40 rounded-md p-3'>
													<div className='flex justify-between items-center mb-2'>
														<div className='font-medium'>
															{
																order.expand
																	.products
																	.length
															}{' '}
															Products
															<span className='text-muted-foreground ml-1 text-sm'>
																(
																{getTotalItemCount()}{' '}
																items)
															</span>
														</div>
														<Badge variant='secondary'>
															$
															{order.total.toFixed(
																2
															)}
														</Badge>
													</div>

													<div className='space-y-1 max-h-[200px] overflow-y-auto'>
														{order.expand.products.map(
															(item: {
																expand: {
																	product: Product;
																};
																quantity: number;
																price: number;
															}) => (
																<div
																	key={
																		item
																			.expand
																			.product
																			.id
																	}
																	className='flex justify-between text-sm py-1 border-b border-border/30 last:border-0'
																>
																	<Image
																		src={getProductImage(
																			item
																				.expand
																				.product
																				.id,
																			item
																				.expand
																				.product
																				.image
																		)}
																		alt={
																			item
																				.expand
																				.product
																				.name
																		}
																		width={
																			50
																		}
																		height={
																			50
																		}
																		sizes='100vw'
																		className='rounded-md mr-2 h-12 w-12 object-cover'
																	/>
																	<div className='flex-1'>
																		<div className='font-medium truncate'>
																			{
																				item
																					.expand
																					.product
																					.name
																			}
																		</div>
																		<div className='text-muted-foreground flex items-center gap-1'>
																			<span>
																				Qty:{' '}
																				{
																					item.quantity
																				}
																			</span>
																		</div>
																	</div>
																	<div className='text-right'>
																		$
																		{item.price.toFixed(
																			2
																		)}
																	</div>
																</div>
															)
														)}
													</div>
												</div>
											</div>
										) : (
											<div className='text-sm text-muted-foreground'>
												No products in this order
											</div>
										)}
									</div>

									{/* Notes Section */}
									{order?.notes && (
										<div className='space-y-3 md:col-span-2 mt-4'>
											<h4 className='text-sm font-medium text-muted-foreground flex items-center'>
												<StickyNoteIcon className='size-4 mr-2' />
												Notes
											</h4>
											<div className='bg-muted/40 rounded-md p-3 max-h-[100px] overflow-y-auto'>
												<div className='whitespace-pre-wrap text-sm'>
													{order.notes}
												</div>
											</div>
										</div>
									)}
								</div>
							)}
						</div>
					</CredenzaBody>
				</CredenzaContent>
			</Credenza>

			{order && (
				<InvoicesModal
					open={invoicesModalOpen}
					setOpen={setInvoicesModalOpen}
					order={order as unknown as Order}
				/>
			)}
		</>
	);
}
