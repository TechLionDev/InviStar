'use client';

import LoadingSpinner from '@/components/loading-spinner';
import pocketbase, { getProductById } from '@/lib/pocketbase';
import { zodResolver } from '@hookform/resolvers/zod';
import { RecordModel } from 'pocketbase';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
	name: z.string(),
	sku: z
		.string()
		.min(12, {
			message: 'SKU must be at least 12 characters long'
		})
		.max(12, {
			message: 'SKU must be at most 12 characters long'
		})
		.regex(/^[A-Z0-9_-]+$/, {
			message:
				'SKU must be uppercase alphanumeric. Only _ and - are allowed'
		})
		.optional(),
	price: z.coerce.number().optional(),
	image: z
		.instanceof(File)
		.refine((file) => file.size < 1000000000, {
			message: 'Product Image must be less than 1GB.'
		})
		.optional(),
	length: z.coerce.number(),
	width: z.coerce.number(),
	height: z.coerce.number(),
	weight: z.coerce.number()
});

function EditProductForm({
	id,
	setOpen = (open) => {
		return open;
	}
}: {
	id: string;
	setOpen?: (open: boolean) => void;
}) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(true);
	const [product, setProduct] = useState<RecordModel | null>(null);
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {}
	});

	useEffect(() => {
		(async () => {
			const product = await getProductById(id);
			setProduct(product);
			form.setValue('name', product?.name);
			form.setValue('sku', product?.sku);
			form.setValue('price', product?.price);
			form.setValue('length', product?.length);
			form.setValue('width', product?.width);
			form.setValue('height', product?.height);
			form.setValue('weight', product?.weight);
			setIsLoading(false);
		})();
	}, [form, id]);

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
			const nameChanged = product?.name !== values.name;
			const skuChanged = product?.sku !== values.sku;
			const priceChanged = product?.price !== values.price;
			const lengthChanged = product?.length !== values.length;
			const widthChanged = product?.width !== values.width;
			const heightChanged = product?.height !== values.height;
			const weightChanged = product?.weight !== values.weight;
			const imageChanged = values.image !== undefined;
			if (product) {
				if (imageChanged) {
					await pocketbase
						.collection('products')
						.update(product.id, { image: values.image });
				}
				if (nameChanged) {
					await pocketbase
						.collection('products')
						.update(product.id, { name: values.name });
				}
				if (skuChanged) {
					await pocketbase
						.collection('products')
						.update(product.id, { sku: values.sku });
				}
				if (priceChanged) {
					await pocketbase
						.collection('products')
						.update(product.id, { price: values.price });
				}
				if (lengthChanged) {
					await pocketbase
						.collection('products')
						.update(product.id, { length: values.length });
				}
				if (widthChanged) {
					await pocketbase
						.collection('products')
						.update(product.id, { width: values.width });
				}
				if (heightChanged) {
					await pocketbase
						.collection('products')
						.update(product.id, { height: values.height });
				}
				if (weightChanged) {
					await pocketbase
						.collection('products')
						.update(product.id, { weight: values.weight });
				}
			}
			toast.success('Saved Successfully!');
			setOpen(false);
			setIsLoading(false);
			router.refresh();
		} catch (error) {
			console.error('Form submission error', error);
			toast.error('Failed to save changes. Please try again.');
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
						name='name'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Name</FormLabel>
								<FormControl>
									<Input
										placeholder='Product XYZ'
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='sku'
						render={({ field }) => (
							<FormItem>
								<FormLabel>SKU</FormLabel>
								<FormDescription>
									<p>
										(Optional) If left empty, one will be
										auto-generated.
									</p>
								</FormDescription>
								<FormControl>
									<Input
										placeholder='ABC-23456-89'
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='price'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Price</FormLabel>
								<FormControl>
									<Input
										placeholder='$ 10.00'
										{...field}
										defaultValue={0}
										type='number'
										min={0}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='image'
						render={({
							// eslint-disable-next-line @typescript-eslint/no-unused-vars
							field: { value, onChange, ...fieldProps }
						}) => (
							<FormItem>
								<FormLabel>Image</FormLabel>
								<FormControl>
									<Input
										{...fieldProps}
										type='file'
										accept='image/*'
										onChange={(event) =>
											onChange(
												event.target.files &&
													event.target.files[0]
											)
										}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className='flex gap-2'>
						<FormField
							control={form.control}
							name='length'
							render={({ field }) => (
								<FormItem className='w-1/4'>
									<FormLabel>Length (in)</FormLabel>
									<FormControl>
										<Input
											{...field}
											defaultValue={0}
											type='number'
											min={0}
											placeholder='0 in'
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='width'
							render={({ field }) => (
								<FormItem className='w-1/4'>
									<FormLabel>Width (in)</FormLabel>
									<FormControl>
										<Input
											{...field}
											defaultValue={0}
											type='number'
											min={0}
											placeholder='0 in'
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='height'
							render={({ field }) => (
								<FormItem className='w-1/4'>
									<FormLabel>Height (in)</FormLabel>
									<FormControl>
										<Input
											{...field}
											defaultValue={0}
											type='number'
											min={0}
											placeholder='0 in'
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='weight'
							render={({ field }) => (
								<FormItem className='w-1/4'>
									<FormLabel>Weight (lb)</FormLabel>
									<FormControl>
										<Input
											{...field}
											defaultValue={0}
											type='number'
											min={0}
											placeholder='0 lbs'
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<Button
						className='w-full'
						type='submit'
					>
						Save
					</Button>
				</form>
			</Form>
		</>
	);
}

export default EditProductForm;
