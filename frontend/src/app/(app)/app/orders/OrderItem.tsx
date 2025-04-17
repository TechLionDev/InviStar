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
	CalendarDaysIcon,
	FolderCogIcon,
	TagIcon
} from 'lucide-react';
import { Order } from '@/lib/types';
import { useState } from 'react';
import ArchiveOrderModal from './ArchiveModal';
import ViewOrderModal from './ViewModal';
import EditOrderModal from './EditModal';
import PDFButton from './PDFButton';

function OrderItem({
	order,
	refreshOrderList
}: {
	order: Order;
	refreshOrderList: () => Promise<void>;
}) {
	const [archiveModalOpen, setArchiveModalOpen] = useState(false);
	const [viewModalOpen, setViewModalOpen] = useState(false);
	const [editModalOpen, setEditModalOpen] = useState(false);

	return (
		<>
			<AccordionItem value={order.id}>
				<AccordionTrigger>Order #{order.number}</AccordionTrigger>
				<AccordionContent>
					<div className='p-4 space-y-4'>
						{/* Main content with order info */}
						<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
							{/* Order details column */}
							<div className='space-y-3'>
								<h4 className='text-sm font-medium text-muted-foreground'>
									Order Information
								</h4>
								<div className='space-y-2'>
									<div className='flex items-center'>
										<CalendarDaysIcon className='size-4 mr-2' />
										<div className='text-sm'>
											{new Date(
												order.date
											).toLocaleString()}
										</div>
									</div>
									<div className='flex items-center'>
										<FolderCogIcon className='size-4 mr-2' />
										<div className='text-sm capitalize'>
											{order.status}
										</div>
									</div>
									<div className='flex items-center'>
										<TagIcon className='size-4 mr-2' />
										<div className='text-sm capitalize'>
											{order.type}
										</div>
									</div>
								</div>
							</div>

							{/* Financial details column */}
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
											${order.subtotal.toFixed(2)}
										</div>
									</div>
									<div className='flex items-center'>
										<div className='text-sm font-medium mr-2'>
											Tax:
										</div>
										<div className='text-sm'>
											${order.tax.toFixed(2)}
										</div>
									</div>
									<div className='flex items-center'>
										<div className='text-sm font-medium mr-2'>
											Total:
										</div>
										<div className='text-sm font-bold'>
											${order.total.toFixed(2)}
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Action buttons */}
						<div className='pt-2 border-t flex justify-end gap-2'>
							<div className='flex gap-2 flex-wrap justify-end w-full'>
								<PDFButton order={order} />
								<Button
									size='sm'
									variant='ghost'
									className='flex items-center gap-1.5 min-h-[36px]'
									onClick={() => setViewModalOpen(true)}
								>
									<EyeIcon className='size-4' />
									<span>View</span>
								</Button>
								<Button
									size='sm'
									variant='ghost'
									className='flex items-center gap-1.5 min-h-[36px]'
									onClick={() => setEditModalOpen(true)}
								>
									<EditIcon className='size-4' />
									<span>Edit</span>
								</Button>
								<Button
									size='sm'
									variant='destructive'
									className='min-h-[36px]'
									onClick={() => setArchiveModalOpen(true)}
								>
									<ArchiveIcon className='size-4' />
									<span>Archive</span>
								</Button>
							</div>
						</div>
					</div>
				</AccordionContent>
			</AccordionItem>
			<ArchiveOrderModal
				id={order.id}
				open={archiveModalOpen}
				onOpenChange={setArchiveModalOpen}
				refreshOrderList={refreshOrderList}
			/>
			<ViewOrderModal
				orderId={order.id}
				open={viewModalOpen}
				setOpen={setViewModalOpen}
			/>
			<EditOrderModal
				orderId={order.id}
				open={editModalOpen}
				setOpen={setEditModalOpen}
				refreshOrderList={refreshOrderList}
			/>
		</>
	);
}

export default OrderItem;
