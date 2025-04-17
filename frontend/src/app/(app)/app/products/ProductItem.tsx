import {
	AccordionContent,
	AccordionItem,
	AccordionTrigger
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
	EyeIcon,
	EditIcon,
	ArchiveIcon,
	HashIcon,
	RulerIcon,
	DollarSignIcon,
	DumbbellIcon
} from 'lucide-react';
import { Product } from '@/lib/types';
import { useState } from 'react';
import ArchiveProductModal from './ArchiveModal';
import { getProductImage } from '@/lib/pocketbase';
import Image from 'next/image';
import EditProductModal from './EditModal';
import ViewProductModal from './ViewModal';
import ViewImageModal from './ViewImageModal';

function ProductItem({
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
			<AccordionItem value={product.id}>
				<AccordionTrigger>{product.name}</AccordionTrigger>
				<AccordionContent>
					<div className='p-4 space-y-4'>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
							{product.image ? (
								<div className='flex justify-center'>
									<Image
										src={getProductImage(
											product.id,
											product.image
										)}
										alt={product.name}
										className='w-72 h-72 object-cover rounded-lg cursor-pointer'
										width={0}
										height={0}
										sizes='100vw'
										onClick={() =>
											setViewImageModalOpen(true)
										}
									/>
								</div>
							) : (
								<div className='flex justify-center'>
									<div className='flex justify-center items-center w-72 h-72 border border-dashed border-secondary-foreground rounded-lg'>
										<span className='text-muted-foreground'>
											No Image
										</span>
									</div>
								</div>
							)}
							<div className='space-y-3'>
								<h4 className='text-sm font-medium text-muted-foreground'>
									Product Information
								</h4>
								<div className='flex space-y-2 gap-4'>
									<div className='flex flex-col gap-2'>
										<div className='flex items-center'>
											<HashIcon className='size-4 text-muted-foreground' />
											<div className='ml-2 text-sm'>
												{product.sku}
											</div>
										</div>
										<div className='flex items-center'>
											<DollarSignIcon className='size-4 text-muted-foreground' />
											<div className='ml-2 text-sm'>
												{product.price.toFixed(2)}
											</div>
										</div>
									</div>
									<div className='flex flex-col gap-2'>
										<div className='flex items-center'>
											<RulerIcon className='size-4 text-muted-foreground' />
											<div className='ml-2 text-sm'>
												{product.length} x{' '}
												{product.width} x{' '}
												{product.height} in
											</div>
										</div>
										<div className='flex items-center'>
											<DumbbellIcon className='size-4 text-muted-foreground' />
											<div className='ml-2 text-sm'>
												{product.weight}{' '}
												{product.weight > 1
													? 'lbs'
													: 'lb'}
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Action buttons */}
						<div className='pt-2 border-t flex justify-end gap-2'>
							<Button
								size='sm'
								variant='ghost'
								className='flex items-center gap-1.5'
								onClick={() => setViewModalOpen(true)}
							>
								<EyeIcon className='size-4' />
								<span>View</span>
							</Button>
							<Button
								size='sm'
								variant='ghost'
								className='flex items-center gap-1.5'
								onClick={() => setEditModalOpen(true)}
							>
								<EditIcon className='size-4' />
								<span>Edit</span>
							</Button>
							<Button
								size='sm'
								variant='destructive'
								onClick={() => setArchiveModalOpen(true)}
							>
								<ArchiveIcon className='size-4' />
								<span>Archive</span>
							</Button>
						</div>
					</div>
				</AccordionContent>
			</AccordionItem>
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
				open={viewModalOpen}
				setOpen={setViewModalOpen}
				productId={product.id}
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

export default ProductItem;
