import { Button } from '@/components/ui/button';
import {
	CredenzaBody,
	CredenzaClose,
	CredenzaContent,
	CredenzaDescription,
	CredenzaFooter,
	CredenzaHeader,
	CredenzaTitle
} from '@/components/ui/credenza';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
	ChevronDown,
	ChevronUp,
	PlusIcon,
	ShoppingCartIcon,
	X
} from 'lucide-react';
import { useState } from 'react';
import { Product } from '@/lib/types';

export type OrderProduct = {
	id: string;
	productId: string;
	quantity: number;
	price: number;
	overridePrice: boolean;
	customPrice: number | null;
	taxExempt: boolean;
	products?: Product[];
};

type ProductsModalProps = {
	orderProducts: OrderProduct[];
	setOrderProducts: (products: OrderProduct[]) => void;
	products: Product[];
};

function ProductsModal({
	orderProducts,
	setOrderProducts,
	products
}: ProductsModalProps) {
	const [expandedProduct, setExpandedProduct] = useState<string | null>(null);

	const addProduct = () => {
		const newProductId = crypto.randomUUID();
		setOrderProducts([
			...orderProducts,
			{
				id: newProductId,
				productId: '',
				quantity: 1,
				price: 0,
				overridePrice: false,
				customPrice: null,
				taxExempt: false
			}
		]);
		setExpandedProduct(newProductId);
		return newProductId;
	};

	const removeProduct = (id: string) => {
		setOrderProducts(orderProducts.filter((item) => item.id !== id));
		if (expandedProduct === id) {
			setExpandedProduct(null);
		}
	};

	const toggleProduct = (id: string) => {
		setExpandedProduct(expandedProduct === id ? null : id);
	};

	const updateProductSelection = (id: string, productId: string) => {
		setOrderProducts(
			orderProducts.map((item) => {
				if (item.id === id) {
					const selectedProduct = products.find(
						(p) => p.id === productId
					);
					return {
						...item,
						productId,
						price: selectedProduct?.price || 0
					};
				}
				return item;
			})
		);
	};

	const updateProductQuantity = (id: string, quantity: number) => {
		setOrderProducts(
			orderProducts.map((item) => {
				if (item.id === id) {
					return { ...item, quantity };
				}
				return item;
			})
		);
	};

	const togglePriceOverride = (id: string) => {
		setOrderProducts(
			orderProducts.map((item) => {
				if (item.id === id) {
					return {
						...item,
						overridePrice: !item.overridePrice,
						customPrice:
							!item.overridePrice && item.customPrice === null
								? item.price
								: item.customPrice
					};
				}
				return item;
			})
		);
	};

	const updateCustomPrice = (id: string, price: number) => {
		setOrderProducts(
			orderProducts.map((item) => {
				if (item.id === id) {
					return { ...item, customPrice: price };
				}
				return item;
			})
		);
	};

	const toggleTaxExempt = (id: string) => {
		setOrderProducts(
			orderProducts.map((item) => {
				if (item.id === id) {
					return { ...item, taxExempt: !item.taxExempt };
				}
				return item;
			})
		);
	};

	const getProductName = (productId: string) => {
		const product = products.find((p) => p.id === productId);
		return product ? product.name : 'Select a product';
	};

	// Enhanced to display multiple products
	const getProductNames = (item: OrderProduct) => {
		if (!item.products || item.products.length === 0) {
			return 'Select a product';
		}

		const mainProduct = getProductName(item.productId);
		const additionalCount = item.products.length - 1;

		return additionalCount > 0
			? `${mainProduct} (+${additionalCount} more)`
			: mainProduct;
	};

	const getEffectivePrice = (item: OrderProduct) => {
		return item.overridePrice && item.customPrice !== null
			? item.customPrice
			: item.price;
	};

	return (
		<CredenzaContent>
			<CredenzaHeader className='mb-6'>
				<CredenzaTitle className='text-xl'>
					Select Products
				</CredenzaTitle>
				<CredenzaDescription>
					Add products to your order with quantities and pricing
					options.
				</CredenzaDescription>
			</CredenzaHeader>

			<CredenzaBody className='p-4 overflow-y-auto flex-1'>
				<div className='space-y-4'>
					<div className='flex items-center justify-between'>
						<h3 className='flex items-center font-semibold text-base'>
							<ShoppingCartIcon className='size-4 mr-2' />
							Products
						</h3>
						<Button
							variant='outline'
							size='sm'
							onClick={() => addProduct()}
							className='h-8'
							type='button'
						>
							<PlusIcon className='size-4 mr-2' />
							Add Product
						</Button>
					</div>

					{orderProducts.length === 0 ? (
						<div className='text-center py-6 border border-dashed rounded-md'>
							<p className='text-muted-foreground text-sm'>
								No products added to this order
							</p>
						</div>
					) : (
						<div className='space-y-3 max-h-[50vh] overflow-y-auto px-2 pb-2'>
							{orderProducts.map((item) => (
								<div
									key={item.id}
									className='border rounded-md overflow-hidden'
								>
									<div
										className='p-2 flex items-center justify-between bg-muted/30 cursor-pointer'
										onClick={() => toggleProduct(item.id)}
									>
										<div className='flex items-center gap-2'>
											<Button
												variant='ghost'
												size='icon'
												className='h-6 w-6 flex-shrink-0'
												onClick={(e) => {
													e.stopPropagation();
													removeProduct(item.id);
												}}
												type='button'
											>
												<X className='h-3.5 w-3.5' />
											</Button>
											<span className='text-sm font-medium'>
												{getProductNames(item)}
												{item.productId && (
													<>
														<Badge
															className='ml-2'
															variant='secondary'
														>
															Qty: {item.quantity}
														</Badge>
														<span className='text-muted-foreground ml-2'>
															$
															{(
																getEffectivePrice(
																	item
																) *
																item.quantity
															).toFixed(2)}
															{item.overridePrice && (
																<Badge
																	className='ml-1'
																	variant='outline'
																>
																	Custom
																</Badge>
															)}
															{item.taxExempt && (
																<Badge
																	className='ml-1'
																	variant='outline'
																>
																	Tax Exempt
																</Badge>
															)}
														</span>
													</>
												)}
											</span>
										</div>
										{expandedProduct === item.id ? (
											<ChevronUp className='h-4 w-4' />
										) : (
											<ChevronDown className='h-4 w-4' />
										)}
									</div>

									{expandedProduct === item.id && (
										<div className='p-3 space-y-3 border-t'>
											<div className='grid grid-cols-1 gap-4'>
												<div>
													<label className='text-sm font-medium'>
														Product
													</label>
													{products.length > 0 ? (
														<Select
															value={
																item.productId
															}
															onValueChange={(
																val
															) =>
																updateProductSelection(
																	item.id,
																	val
																)
															}
														>
															<SelectTrigger className='w-full'>
																<SelectValue placeholder='Select a product' />
															</SelectTrigger>
															<SelectContent>
																{products.map(
																	(
																		product
																	) => (
																		<SelectItem
																			key={
																				product.id
																			}
																			value={
																				product.id
																			}
																		>
																			{
																				product.name
																			}{' '}
																			- $
																			{
																				product.price
																			}
																		</SelectItem>
																	)
																)}
															</SelectContent>
														</Select>
													) : (
														<Input
															disabled
															value='No products available. Please create one first.'
														/>
													)}
												</div>

												<div>
													<label className='text-sm font-medium'>
														Quantity
													</label>
													<Input
														type='number'
														min='1'
														value={item.quantity}
														onChange={(e) =>
															updateProductQuantity(
																item.id,
																parseInt(
																	e.target
																		.value
																) || 1
															)
														}
													/>
												</div>

												{item.productId && (
													<>
														<div className='flex items-center justify-between'>
															<label className='text-sm font-medium'>
																Override Price
															</label>
															<Switch
																checked={
																	item.overridePrice
																}
																onCheckedChange={() =>
																	togglePriceOverride(
																		item.id
																	)
																}
															/>
														</div>

														{item.overridePrice ? (
															<div>
																<label className='text-sm font-medium'>
																	Custom Price
																</label>
																<Input
																	type='number'
																	min='0'
																	step='0.01'
																	value={
																		item.customPrice ||
																		0
																	}
																	onChange={(
																		e
																	) =>
																		updateCustomPrice(
																			item.id,
																			parseFloat(
																				e
																					.target
																					.value
																			) ||
																				0
																		)
																	}
																/>
															</div>
														) : (
															<div className='flex items-center justify-between'>
																<p className='text-sm font-medium'>
																	Price
																</p>
																<p className='text-sm'>
																	$
																	{item.price}{' '}
																	each
																</p>
															</div>
														)}

														<div className='flex items-center justify-between'>
															<label className='text-sm font-medium'>
																Tax Exempt
															</label>
															<Switch
																checked={
																	item.taxExempt
																}
																onCheckedChange={() =>
																	toggleTaxExempt(
																		item.id
																	)
																}
															/>
														</div>

														<div>
															<p className='text-sm font-semibold'>
																Total: $
																{(
																	getEffectivePrice(
																		item
																	) *
																	item.quantity
																).toFixed(2)}
															</p>
														</div>
													</>
												)}
											</div>
										</div>
									)}
								</div>
							))}
						</div>
					)}
				</div>
			</CredenzaBody>

			<CredenzaFooter className='pt-6 mt-6 border-t flex gap-2'>
				<Button
					variant='destructive'
					className='flex-1'
					onClick={() => setOrderProducts([])}
					disabled={orderProducts.length === 0}
				>
					Clear All
				</Button>
				<CredenzaClose asChild>
					<Button
						variant='outline'
						className='flex-1'
					>
						Close
					</Button>
				</CredenzaClose>
			</CredenzaFooter>
		</CredenzaContent>
	);
}

export default ProductsModal;
