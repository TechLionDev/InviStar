'use client';

import LoadingSpinner from '@/components/loading-spinner';
import {
	Credenza,
	CredenzaContent,
	CredenzaHeader,
	CredenzaTitle,
	CredenzaBody
} from '@/components/ui/credenza';
import { getProductById } from '@/lib/pocketbase';
import { DollarSignIcon, HashIcon, RulerIcon } from 'lucide-react';
import { RecordModel } from 'pocketbase';
import { useEffect, useState } from 'react';

export default function ViewProductModal({
	open,
	setOpen,
	productId
}: {
	open: boolean;
	setOpen: (open: boolean) => void;
	productId: string;
}) {
	const [isLoading, setIsLoading] = useState(true);
	const [product, setProduct] = useState<RecordModel | null>(null);
	useEffect(() => {
		(async () => {
			const product = await getProductById(productId);
			setProduct(product);
			setIsLoading(false);
		})();
	}, [productId]);

	// Handle close by navigating back
	const handleOpenChange = (open: boolean) => {
		setOpen(open);
	};

	return (
		<Credenza
			open={open}
			onOpenChange={handleOpenChange}
		>
			<CredenzaContent>
				<CredenzaHeader>
					<CredenzaTitle>View Product</CredenzaTitle>
				</CredenzaHeader>
				<CredenzaBody>
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
										Product Information
									</h4>
									<div className='space-y-2'>
										<div className='flex items-center'>
											<HashIcon className='size-4 text-muted-foreground' />
											<div className='ml-2 text-sm'>
												{product?.sku}
											</div>
										</div>
										<div className='flex items-center'>
											<DollarSignIcon className='size-4 text-muted-foreground' />
											<div className='ml-2 text-sm'>
												{product?.price}
											</div>
										</div>
										<div className='flex items-center'>
											<RulerIcon className='size-4 text-muted-foreground' />
											<div className='ml-2 text-sm'>
												{product?.size}
											</div>
										</div>
									</div>
								</div>
							</div>
						)}
					</div>
				</CredenzaBody>
			</CredenzaContent>
		</Credenza>
	);
}
