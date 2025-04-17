'use client';

import LoadingSpinner from '@/components/loading-spinner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
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
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import pocketbase, { getCurrentUser } from '@/lib/pocketbase';
import { User } from '@/lib/types';

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

function CreateProductForm({
	setOpen = (open) => {
		return open;
	}
}: {
	setOpen?: (open: boolean) => void;
}) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {}
	});

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
			values.sku = values.sku === undefined ? '' : values.sku;
			const user = (await getCurrentUser()) as unknown as User;
			await pocketbase
				.collection('products')
				.create({ ...values, createdBy: user.id });

			toast.success('Created Successfully!');
			setOpen(false);
			setIsLoading(false);
			router.refresh();
		} catch (error) {
			console.error('Form submission error', error);
			toast.error('Failed to create product. Please try again.');
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
						Create
					</Button>
				</form>
			</Form>
		</>
	);
}

export default CreateProductForm;
