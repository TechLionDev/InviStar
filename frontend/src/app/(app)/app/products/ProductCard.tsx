import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle
} from '@/components/ui/card';
import Image from 'next/image';
import { getProductImage } from '@/lib/pocketbase';
import { Product } from '@/lib/types';
import {
	ArchiveIcon,
	DollarSignIcon,
	DumbbellIcon,
	EditIcon,
	EyeIcon,
	HashIcon,
	RulerIcon
} from 'lucide-react';
import { useState } from 'react';
import ArchiveProductModal from './ArchiveModal';
import EditProductModal from './EditModal';
import ViewProductModal from './ViewModal';
import ViewImageModal from './ViewImageModal';

function ProductCard({
	product,
	refreshProductList
}: {
	product: Product;
	refreshProductList: () => Promise<void>;
}) {
	const [archiveModalOpen, setArchiveModalOpen] = useState(false);
	const [editModalOpen, setEditModalOpen] = useState(false);
	const [viewModalOpen, setViewModalOpen] = useState(false);
	const [viewImageModalOpen, setViewImageModalOpen] = useState(false);

	return (
		<>
			<Card className='h-full bg-sidebar'>
				<CardHeader>
					<CardTitle>{product.name}</CardTitle>
				</CardHeader>
				<CardContent className='space-y-4'>
					<div className='space-y-2 flex justify-between gap-2'>
						<div className='flex flex-col space-y-2'>
							<h4 className='text-sm font-medium text-muted-foreground'>
								Product Information
							</h4>
							<div className='grid grid-cols-1 gap-1.5'>
								<div className='flex items-center'>
									<HashIcon className='flex-shrink-0 size-4 text-muted-foreground' />
									<div className='ml-2 text-sm'>
										{product.sku}
									</div>
								</div>
								<div className='flex items-center'>
									<DollarSignIcon className='flex-shrink-0 size-4 text-muted-foreground' />
									<div className='ml-2 text-sm'>
										{product.price.toFixed(2)}
									</div>
								</div>
								<div className='flex items-center'>
									<RulerIcon className='flex-shrink-0 size-4 text-muted-foreground' />
									<div className='ml-2 text-sm'>
										{product.length} x {product.width} x{' '}
										{product.height} in
									</div>
								</div>
								<div className='flex items-center'>
									<DumbbellIcon className='flex-shrink-0 size-4 text-muted-foreground' />
									<div className='ml-2 text-sm'>
										{product.weight}{' '}
										{product.weight > 1 ? 'lbs' : 'lb'}
									</div>
								</div>
							</div>
						</div>
						<div className='flex justify-center'>
							<Image
								src={getProductImage(product.id, product.image)}
								alt={product.name}
								className='w-32 h-32 object-cover rounded-lg cursor-pointer'
								width={0}
								height={0}
								sizes='100vw'
								onClick={() => setViewImageModalOpen(true)}
							/>
						</div>
					</div>
				</CardContent>
				<CardFooter className='flex justify-end gap-2 border-t border-muted pt-4'>
					<Button
						size='sm'
						variant='ghost'
						className='flex items-center gap-1.5 hover:bg-accent-foreground/10'
						onClick={() => setViewModalOpen(true)}
					>
						<EyeIcon className='flex-shrink-0 size-4' />
						<span>View</span>
					</Button>
					<Button
						size='sm'
						variant='ghost'
						className='flex items-center gap-1.5 hover:bg-accent-foreground/10'
						onClick={() => setEditModalOpen(true)}
					>
						<EditIcon className='flex-shrink-0 size-4' />
						<span>Edit</span>
					</Button>
					<Button
						size='sm'
						variant='destructive'
						onClick={() => setArchiveModalOpen(true)}
					>
						<ArchiveIcon className='flex-shrink-0 size-4' />
						<span>Archive</span>
					</Button>
				</CardFooter>
			</Card>
			<ArchiveProductModal
				id={product.id}
				open={archiveModalOpen}
				onOpenChange={setArchiveModalOpen}
				refreshProductList={refreshProductList}
			/>
			<EditProductModal
				open={editModalOpen}
				setOpen={setEditModalOpen}
				refreshProductList={refreshProductList}
				productId={product.id}
			/>
			<ViewProductModal
				productId={product.id}
				open={viewModalOpen}
				setOpen={setViewModalOpen}
			/>
			<ViewImageModal
				open={viewImageModalOpen}
				setOpen={setViewImageModalOpen}
				imageSrc={
					product.image
						? getProductImage(product.id, product.image)
						: ''
				}
			/>
		</>
	);
}

export default ProductCard;
