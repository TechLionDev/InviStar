'use client';

import LoadingSpinner from '@/components/loading-spinner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Credenza } from '@/components/ui/credenza';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { toast } from 'sonner';
import { DatePicker } from '@/components/date-picker';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select';
import {
	getAllBusinesses,
	getAllProducts,
	getProductImage
} from '@/lib/pocketbase';
import { Business, Product } from '@/lib/types';
import pocketbase, { getCurrentUser } from '@/lib/pocketbase';
import { User } from '@/lib/types';
import { PackageIcon, PackagePlusIcon, ShoppingCartIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import ProductsModal, { OrderProduct } from './ProductsModal';
import Image from 'next/image';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
	number: z
		.string()
		.refine(
			(val) => val === '' || (val.length === 10 && /^[0-9]+$/.test(val)),
			{
				message: 'number must be exactly 10 digits'
			}
		)
		.optional(),
	date: z.string().optional(),
	business: z.string().optional(),
	products: z.array(z.string()),
	subtotal: z.number().min(0, 'Subtotal must be a positive number'),
	discount: z.number().min(0, 'Discount must be a positive number or zero'),
	tax: z.number().min(0, 'Tax must be a positive number'),
	total: z.number().min(0, 'Total must be a positive number'),
	status: z.enum(['paid', 'fulfilled', 'paid_fulfilled']),
	type: z.enum(['sales', 'purchase']),
	notes: z.string().optional()
});

function CreateOrderForm({
	setOpen = (open) => {
		return open;
	},
	type
}: {
	setOpen?: (open: boolean) => void;
	type: 'sales' | 'purchase';
}) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(true);
	const [businesses, setBusinesses] = useState<Business[]>([]);
	const [products, setProducts] = useState<Product[]>([]);

	// State for managing order products
	const [orderProducts, setOrderProducts] = useState<OrderProduct[]>([]);
	// State for controlling modal visibility
	const [showProductsModal, setShowProductsModal] = useState(false);
	// State for manual tax control
	const [manualTax, setManualTax] = useState(false);
	const [taxRate, setTaxRate] = useState(0); // Default 8%
	const [orderType, setOrderType] = useState<'sales' | 'purchase'>(type);

	const [discountValue, setDiscountValue] = useState(0);
	const [manualDiscount, setManualDiscount] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			number: '',
			date: '',
			business: '',
			products: [],
			subtotal: 0,
			discount: 0,
			tax: 0,
			total: 0,
			status: 'paid',
			type: type,
			notes: ''
		}
	});

	useEffect(() => {
		const fetchBusinesses = async () => {
			const data = (await getAllBusinesses()) as unknown as Business[];
			setBusinesses(data);
		};

		const fetchProducts = async () => {
			const data = (await getAllProducts()) as unknown as Product[];
			setProducts(data);
		};
		fetchBusinesses()
			.then(() => fetchProducts())
			.then(() => setIsLoading(false));
	}, []);

	// Update form values when order products or discount change
	useEffect(() => {
		// Calculate subtotal for all products
		const subtotal = orderProducts.reduce((sum, item) => {
			// Use custom price if override is enabled
			const priceToUse =
				item.overridePrice && item.customPrice !== null
					? item.customPrice
					: item.price;
			return sum + priceToUse * item.quantity;
		}, 0);

		// Calculate discount
		let discount;
		if (manualDiscount) {
			// Keep the manually entered discount value
			discount = form.getValues().discount;
		} else {
			// Calculate discount based on percentage
			discount = subtotal * (discountValue / 100);

			// Ensure discount doesn't exceed subtotal
			discount = Math.min(discount, subtotal);
		}

		// Calculate tax only for taxable products after discount
		const taxableSubtotal = orderProducts.reduce((sum, item) => {
			// Skip tax-exempt products
			if (item.taxExempt) return sum;

			// Use custom price if override is enabled
			const priceToUse =
				item.overridePrice && item.customPrice !== null
					? item.customPrice
					: item.price;
			return sum + priceToUse * item.quantity;
		}, 0);

		// Calculate tax based on taxable subtotal (after discount)
		const discountedTaxableSubtotal = Math.max(
			0,
			taxableSubtotal - discount
		);
		let tax;
		if (manualTax) {
			// Keep the manually entered tax value
			tax = form.getValues().tax;
		} else {
			// Calculate tax based on current tax rate (on discounted amount)
			tax = discountedTaxableSubtotal * (taxRate / 100);
		}

		// Update form values
		form.setValue('subtotal', parseFloat(subtotal.toFixed(2)));
		form.setValue('discount', parseFloat(discount.toFixed(2)));
		if (!manualTax) {
			form.setValue('tax', parseFloat(tax.toFixed(2)));
		}
		form.setValue(
			'total',
			parseFloat((subtotal - discount + form.getValues().tax).toFixed(2))
		);
		form.setValue(
			'products',
			orderProducts
				.map((item) => item.productId)
				.filter((id) => id !== '')
		);
	}, [
		orderProducts,
		manualTax,
		taxRate,
		discountValue,
		manualDiscount,
		form
	]);

	// Update total when tax or discount changes
	const watchedTax = form.watch('tax');
	const watchedDiscount = form.watch('discount');

	useEffect(() => {
		const subtotal = form.getValues().subtotal;
		const discount = form.getValues().discount;
		const tax = form.getValues().tax;
		form.setValue(
			'total',
			parseFloat((subtotal - discount + tax).toFixed(2))
		);
	}, [watchedTax, watchedDiscount, form]);

	// Get product name by ID
	const getProductName = (productId: string) => {
		const product = products.find((p) => p.id === productId);
		return product ? product.name : '';
	};

	// Get effective price (either original or custom if overridden)
	const getEffectivePrice = (item: OrderProduct) => {
		return item.overridePrice && item.customPrice !== null
			? item.customPrice
			: item.price;
	};

	const getTotalItemCount = () => {
		return orderProducts.reduce((total, item) => total + item.quantity, 0);
	};

	if (isLoading) {
		return (
			<div className='w-[100%] flex items-center justify-center'>
				<LoadingSpinner global={false} />
			</div>
		);
	}

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			setIsLoading(true);
			console.log('values:', values);
			values.date = values.date
				? new Date(values.date).toUTCString()
				: new Date().toUTCString();
			const user = (await getCurrentUser()) as unknown as User;

			const orderitemsbatch = pocketbase.createBatch();
			orderProducts.forEach((product) => {
				orderitemsbatch.collection('orderitems').create({
					product: product.productId,
					quantity: product.quantity,
					price: getEffectivePrice(product),
					createdBy: user.id
				});
			});
			const orderItems: unknown[] =
				(await orderitemsbatch.send()) as unknown[];

			const orderItemIds: unknown[] = [];

			for (let i = 0; i < orderItems.length; i++) {
				orderItemIds.push(
					(orderItems[i] as { body: { id: string } }).body.id
				);
				console.log(
					'orderItems[i].id:',
					(orderItems[i] as { id?: string }).id
				);
			}

			// Remove products from values to avoid overriding orderItemIds
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { products: _, ...orderValues } = values;

			const order = await pocketbase.collection('orders').create({
				...orderValues,
				createdBy: user.id,
				products: orderItemIds
			});
			console.log('order:', order);
			toast.success('Created Successfully!');
			router.refresh();
			setOpen(false);
			setIsLoading(false);
		} catch (error) {
			console.error('Form submission error', error);
			toast.error('Failed to create order. Please try again.');
			setIsLoading(false);
		}
	}

	return (
		<>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='space-y-8 w-full'
				>
					<FormField
						control={form.control}
						name='number'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Number</FormLabel>
								<FormDescription>
									(Optional) If none is provided, one is
									autogenerated
								</FormDescription>
								<FormControl>
									<Input
										placeholder='Enter number'
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='date'
						render={({ field }) => {
							// Convert string to Date object for the DatePicker
							const date = field.value
								? new Date(field.value)
								: undefined;

							// Update form field when DatePicker changes
							const setDate = (newDate: Date | null) => {
								field.onChange(
									newDate ? newDate.toISOString() : undefined
								);
							};

							return (
								<FormItem>
									<FormLabel>Date</FormLabel>
									<FormControl>
										<DatePicker
											date={date}
											setDate={setDate}
										/>
									</FormControl>
									<FormMessage />
									<FormDescription>
										(Optional) If none is provided,
										today&apos;s date is used
									</FormDescription>
								</FormItem>
							);
						}}
					/>

					{/* Status and Type side-by-side */}
					<div className='grid grid-cols-2 gap-4'>
						<FormField
							control={form.control}
							name='status'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Status</FormLabel>
									<Select
										onValueChange={(val) =>
											form.setValue(
												'status',
												val as
													| 'paid'
													| 'fulfilled'
													| 'paid_fulfilled'
											)
										}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder='Select status' />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value='paid'>
												Paid
											</SelectItem>
											<SelectItem value='fulfilled'>
												Fulfilled
											</SelectItem>
											<SelectItem value='paid_fulfilled'>
												Paid & Fulfilled
											</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='type'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Order Type</FormLabel>
									<Select
										onValueChange={(val) => {
											form.setValue(
												'type',
												val as 'sales' | 'purchase'
											);
											setOrderType(
												val as 'sales' | 'purchase'
											);
										}}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder='Select type' />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value='sales'>
												Sales
											</SelectItem>
											<SelectItem value='purchase'>
												Purchase
											</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					{orderType === 'sales' && (
						<FormField
							control={form.control}
							name='business'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Business</FormLabel>
									{businesses.length > 0 ? (
										<FormControl>
											<Select
												onValueChange={(newVal) => {
													form.setValue(
														'business',
														newVal
													);
												}}
												{...field}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder='Select a Business' />
													</SelectTrigger>
												</FormControl>
												<FormDescription>
													{form.watch('business')
														? (() => {
																const business =
																	businesses.find(
																		(b) =>
																			b.id ===
																			form.watch(
																				'business'
																			)
																	);
																return business
																	? `${business.phone} - ${business.contact} (${business.addressStreet}, ${business.addressCity})`
																	: '';
														  })()
														: ''}
												</FormDescription>
												<SelectContent>
													{businesses.map(
														(business) => (
															<SelectItem
																key={
																	business.id
																}
																value={
																	business.id
																}
															>
																{business.name}{' '}
																-{' '}
																{
																	business.contact
																}{' '}
																(
																{
																	business.addressCity
																}
																)
															</SelectItem>
														)
													)}
												</SelectContent>
											</Select>
										</FormControl>
									) : (
										<FormControl>
											<Input
												disabled
												value='No businesses found. Please create one first.'
											/>
										</FormControl>
									)}
									<FormMessage />
								</FormItem>
							)}
						/>
					)}

					{products.length > 0 ? (
						<FormField
							control={form.control}
							name='products'
							render={() => (
								<FormItem>
									<div className='flex items-center justify-between mb-2'>
										<FormLabel className='text-base flex items-center'>
											<ShoppingCartIcon className='size-4 mr-2' />
											Products
										</FormLabel>
										<Button
											variant='outline'
											size='sm'
											onClick={() =>
												setShowProductsModal(true)
											}
											type='button'
											className='flex items-center'
										>
											{orderProducts.length > 0
												? 'Edit Products'
												: 'Add Products'}
										</Button>
									</div>

									{orderProducts.length === 0 ? (
										<div className='text-center py-6 border border-dashed rounded-md'>
											<PackageIcon className='mx-auto h-8 w-8 text-muted-foreground mb-2' />
											<p className='text-muted-foreground text-sm'>
												No products added to this order
											</p>
											<Button
												variant='link'
												onClick={() =>
													setShowProductsModal(true)
												}
												className='mt-2'
												type='button'
											>
												<PackagePlusIcon className='mr-1 h-4 w-4' />
												Add Products
											</Button>
										</div>
									) : (
										<div className='space-y-4'>
											<div className='bg-muted/40 rounded-md p-3'>
												<div className='flex justify-between items-center mb-2'>
													<div className='font-medium'>
														{
															orderProducts.filter(
																(item) =>
																	item.productId !==
																	''
															).length
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
														{form
															.watch('subtotal')
															.toFixed(2)}
													</Badge>
												</div>

												<div className='space-y-1 max-h-[200px] overflow-y-auto'>
													{orderProducts
														.filter(
															(item) =>
																item.productId !==
																''
														)
														.map((item) => (
															<div
																key={item.id}
																className='flex justify-between text-sm py-1 border-b border-border/30 last:border-0'
															>
																<Image
																	src={getProductImage(
																		item.productId,
																		products.find(
																			(
																				p
																			) =>
																				p.id ===
																				item.productId
																		)
																			?.image ||
																			''
																	)}
																	alt={getProductName(
																		item.productId
																	)}
																	width={50}
																	height={50}
																	sizes='100vw'
																	className='rounded-md mr-2 h-12 w-12 object-cover'
																/>
																<div className='flex-1'>
																	<div className='font-medium truncate'>
																		{getProductName(
																			item.productId
																		)}
																	</div>
																	<div className='text-muted-foreground flex items-center gap-1'>
																		<span>
																			Qty:{' '}
																			{
																				item.quantity
																			}
																		</span>
																		{item.overridePrice && (
																			<Badge
																				variant='outline'
																				className='text-xs py-0 h-5'
																			>
																				Custom
																			</Badge>
																		)}
																		{item.taxExempt && (
																			<Badge
																				variant='outline'
																				className='text-xs py-0 h-5'
																			>
																				Tax
																				Exempt
																			</Badge>
																		)}
																	</div>
																</div>
																<div className='text-right'>
																	$
																	{(
																		getEffectivePrice(
																			item
																		) *
																		item.quantity
																	).toFixed(
																		2
																	)}
																</div>
															</div>
														))}
												</div>
											</div>
										</div>
									)}

									<Credenza
										open={showProductsModal}
										onOpenChange={setShowProductsModal}
									>
										<ProductsModal
											orderProducts={orderProducts}
											setOrderProducts={setOrderProducts}
											products={products}
										/>
									</Credenza>

									<FormMessage />
								</FormItem>
							)}
						/>
					) : (
						<FormField
							control={form.control}
							name='products'
							render={() => (
								<FormItem>
									<FormLabel>Products</FormLabel>
									<FormControl>
										<Input
											disabled
											value='No products found. Please create some first.'
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					)}

					{orderProducts.length > 0 && (
						<div className='space-y-3 bg-muted/20 p-4 rounded-md'>
							<div className='flex justify-between text-sm'>
								<span>Subtotal:</span>
								<span>
									${form.watch('subtotal').toFixed(2)}
								</span>
							</div>

							{/* Discount section */}
							<div>
								<div className='flex justify-between items-center text-sm mb-2'>
									<div className='flex items-center gap-2'>
										<span>Discount:</span>
										{!manualDiscount && (
											<div className='flex items-center'>
												<Input
													type='number'
													value={discountValue}
													onChange={(e) =>
														setDiscountValue(
															parseFloat(
																e.target.value
															) || 0
														)
													}
													className='w-16 h-6 px-2 py-1 text-xs mr-1 inline-flex'
													min='0'
													step='0.1'
												/>
												<span>%</span>
											</div>
										)}
									</div>

									<div className='flex items-center gap-2'>
										{manualDiscount ? (
											<Input
												type='number'
												value={form.watch('discount')}
												onChange={(e) =>
													form.setValue(
														'discount',
														parseFloat(
															e.target.value
														) || 0
													)
												}
												className='w-20 h-6 px-2 py-1 text-xs text-right'
												min='0'
												step='0.01'
											/>
										) : (
											<span>
												$
												{form
													.watch('discount')
													.toFixed(2)}
											</span>
										)}
										<div className='flex items-center'>
											<label className='text-xs mr-1'>
												Manual
											</label>
											<Switch
												checked={manualDiscount}
												onCheckedChange={
													setManualDiscount
												}
												className='scale-75'
											/>
										</div>
									</div>
								</div>
							</div>

							{/* Tax section (existing) */}
							<div>
								<div className='flex justify-between items-center text-sm mb-2'>
									<div className='flex items-center gap-2'>
										<span>Tax:</span>
										{!manualTax && (
											<div className='flex items-center'>
												<Input
													type='number'
													value={taxRate}
													onChange={(e) =>
														setTaxRate(
															parseFloat(
																e.target.value
															) || 0
														)
													}
													className='w-16 h-6 px-2 py-1 text-xs mr-1 inline-flex'
													min='0'
													step='0.1'
												/>
												<span>%</span>
											</div>
										)}
									</div>

									<div className='flex items-center gap-2'>
										{manualTax ? (
											<Input
												type='number'
												value={form.watch('tax')}
												onChange={(e) =>
													form.setValue(
														'tax',
														parseFloat(
															e.target.value
														) || 0
													)
												}
												className='w-20 h-6 px-2 py-1 text-xs text-right'
												min='0'
												step='0.01'
											/>
										) : (
											<span>
												{form
													.watch('tax')
													.toFixed(2) === '0.00'
													? 'No TAX'
													: `$${form
															.watch('tax')
															.toFixed(2)}`}
											</span>
										)}
										<div className='flex items-center'></div>
										<label className='text-xs mr-1'>
											Manual
										</label>
										<Switch
											checked={manualTax}
											onCheckedChange={setManualTax}
											className='scale-75'
										/>
									</div>
								</div>
							</div>
							<div className='text-xs text-muted-foreground'>
								{orderProducts.some(
									(item) => item.taxExempt
								) && (
									<span>* Some products are tax exempt</span>
								)}
							</div>

							<div className='flex justify-between font-medium pt-2 border-t'>
								<span>Total:</span>
								<span>${form.watch('total').toFixed(2)}</span>
							</div>
						</div>
					)}

					<FormField
						control={form.control}
						name='notes'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Notes</FormLabel>
								<FormControl>
									<Textarea
										placeholder='Add any additional notes about this order here...'
										className='min-h-[100px] resize-y'
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button
						className='w-full'
						type='submit'
						disabled={
							orderProducts.filter((p) => p.productId !== '')
								.length === 0
						}
					>
						Create Order
					</Button>
				</form>
			</Form>
		</>
	);
}

export default CreateOrderForm;
