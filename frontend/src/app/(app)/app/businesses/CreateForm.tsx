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
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PhoneInput } from '@/components/phone-input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select';
import { toast } from 'sonner';
import pocketbase, {
	getCurrentUser,
	PAYMENT_TERMS,
	DEFAULT_PAYMENT_TERM
} from '@/lib/pocketbase';
import { PaymentTerms, User } from '@/lib/types';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
	name: z.string(),
	contact: z.string(),
	phone: z
		.string()
		.max(12)
		.min(12)
		.regex(/^\+[0-9]{11}$/),
	email: z.string().email(),
	addressStreet: z.string(),
	addressCity: z.string(),
	addressState: z.string(),
	addressZip: z.string(),
	terms: z.enum([
		'COD',
		'Check',
		'Consignment',
		'Credit Card',
		'Sample',
		'Net15',
		'Net30',
		'Net60'
	]),
	notes: z.string().optional()
});

function CreateBusinessForm({
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
		defaultValues: {
			terms: DEFAULT_PAYMENT_TERM
		}
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
			const user = (await getCurrentUser()) as unknown as User;
			await pocketbase
				.collection('businesses')
				.create({ ...values, createdBy: user.id });

			toast.success('Created Successfully!');
			router.refresh();
			setOpen(false);
			setIsLoading(false);
		} catch (error) {
			console.error('Form submission error', error);
			toast.error('Failed to create business. Please try again.');
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
										placeholder='Company XYZ'
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='contact'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Contact</FormLabel>
								<FormControl>
									<Input
										placeholder='John Doe'
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='phone'
						render={({ field }) => (
							<FormItem className='grid gap-2'>
								<FormLabel htmlFor='phone'>Phone</FormLabel>
								<FormControl>
									<PhoneInput
										{...field}
										international={true}
										defaultCountry='US'
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='email'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input
										placeholder='jdoe@mail.com'
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='terms'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Payment Terms</FormLabel>
								<Select
									onValueChange={(value) =>
										form.setValue(
											'terms',
											value as PaymentTerms
										)
									}
									defaultValue={field.value}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder='Select payment terms' />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{PAYMENT_TERMS.map((term) => (
											<SelectItem
												key={term}
												value={term}
											>
												{term}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className='flex gap-4 w-full justify-between'>
						<FormField
							control={form.control}
							name='addressStreet'
							render={({ field }) => (
								<FormItem className='grid gap-2 grow'>
									<FormLabel>Street</FormLabel>
									<FormControl>
										<Input
											placeholder='123 Some St'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='addressCity'
							render={({ field }) => (
								<FormItem className='grid gap-2 grow'>
									<FormLabel>City</FormLabel>
									<FormControl>
										<Input
											placeholder='Some City'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<div className='flex gap-4 w-full justify-between'>
						<FormField
							control={form.control}
							name='addressState'
							render={({ field }) => (
								<FormItem className='grid gap-2 grow'>
									<FormLabel>State</FormLabel>
									<Select
										onValueChange={(newVal) => {
											form.setValue(
												'addressState',
												newVal
											);
										}}
										{...field}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder='Select a US State' />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value='AL'>
												Alabama
											</SelectItem>
											<SelectItem value='AK'>
												Alaska
											</SelectItem>
											<SelectItem value='AS'>
												American Samoa
											</SelectItem>
											<SelectItem value='AZ'>
												Arizona
											</SelectItem>
											<SelectItem value='AR'>
												Arkansas
											</SelectItem>
											<SelectItem value='CA'>
												California
											</SelectItem>
											<SelectItem value='CO'>
												Colorado
											</SelectItem>
											<SelectItem value='CT'>
												Connecticut
											</SelectItem>
											<SelectItem value='DE'>
												Delaware
											</SelectItem>
											<SelectItem value='DC'>
												District of Columbia
											</SelectItem>
											<SelectItem value='FM'>
												Federated States of Micronesia
											</SelectItem>
											<SelectItem value='FL'>
												Florida
											</SelectItem>
											<SelectItem value='GA'>
												Georgia
											</SelectItem>
											<SelectItem value='GU'>
												Guam
											</SelectItem>
											<SelectItem value='HI'>
												Hawaii
											</SelectItem>
											<SelectItem value='ID'>
												Idaho
											</SelectItem>
											<SelectItem value='IL'>
												Illinois
											</SelectItem>
											<SelectItem value='IN'>
												Indiana
											</SelectItem>
											<SelectItem value='IA'>
												Iowa
											</SelectItem>
											<SelectItem value='KS'>
												Kansas
											</SelectItem>
											<SelectItem value='KY'>
												Kentucky
											</SelectItem>
											<SelectItem value='LA'>
												Louisiana
											</SelectItem>
											<SelectItem value='ME'>
												Maine
											</SelectItem>
											<SelectItem value='MH'>
												Marshall Islands
											</SelectItem>
											<SelectItem value='MD'>
												Maryland
											</SelectItem>
											<SelectItem value='MA'>
												Massachusetts
											</SelectItem>
											<SelectItem value='MI'>
												Michigan
											</SelectItem>
											<SelectItem value='MN'>
												Minnesota
											</SelectItem>
											<SelectItem value='MS'>
												Mississippi
											</SelectItem>
											<SelectItem value='MO'>
												Missouri
											</SelectItem>
											<SelectItem value='MT'>
												Montana
											</SelectItem>
											<SelectItem value='NE'>
												Nebraska
											</SelectItem>
											<SelectItem value='NV'>
												Nevada
											</SelectItem>
											<SelectItem value='NH'>
												New Hampshire
											</SelectItem>
											<SelectItem value='NJ'>
												New Jersey
											</SelectItem>
											<SelectItem value='NM'>
												New Mexico
											</SelectItem>
											<SelectItem value='NY'>
												New York
											</SelectItem>
											<SelectItem value='NC'>
												North Carolina
											</SelectItem>
											<SelectItem value='ND'>
												North Dakota
											</SelectItem>
											<SelectItem value='MP'>
												Northern Mariana Islands
											</SelectItem>
											<SelectItem value='OH'>
												Ohio
											</SelectItem>
											<SelectItem value='OK'>
												Oklahoma
											</SelectItem>
											<SelectItem value='OR'>
												Oregon
											</SelectItem>
											<SelectItem value='PW'>
												Palau
											</SelectItem>
											<SelectItem value='PA'>
												Pennsylvania
											</SelectItem>
											<SelectItem value='PR'>
												Puerto Rico
											</SelectItem>
											<SelectItem value='RI'>
												Rhode Island
											</SelectItem>
											<SelectItem value='SC'>
												South Carolina
											</SelectItem>
											<SelectItem value='SD'>
												South Dakota
											</SelectItem>
											<SelectItem value='TN'>
												Tennessee
											</SelectItem>
											<SelectItem value='TX'>
												Texas
											</SelectItem>
											<SelectItem value='UT'>
												Utah
											</SelectItem>
											<SelectItem value='VT'>
												Vermont
											</SelectItem>
											<SelectItem value='VI'>
												Virgin Islands
											</SelectItem>
											<SelectItem value='VA'>
												Virginia
											</SelectItem>
											<SelectItem value='WA'>
												Washington
											</SelectItem>
											<SelectItem value='WV'>
												West Virginia
											</SelectItem>
											<SelectItem value='WI'>
												Wisconsin
											</SelectItem>
											<SelectItem value='WY'>
												Wyoming
											</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='addressZip'
							render={({ field }) => (
								<FormItem className='grid gap-2'>
									<FormLabel>Zip</FormLabel>
									<FormControl>
										<Input
											placeholder='12345'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<FormField
						control={form.control}
						name='notes'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Notes</FormLabel>
								<FormControl>
									<Textarea
										placeholder='Add any additional notes about this business here...'
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
					>
						Create
					</Button>
				</form>
			</Form>
		</>
	);
}

export default CreateBusinessForm;
