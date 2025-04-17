import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle
} from '@/components/ui/card';
import { Order } from '@/lib/types';
import {
	ArchiveIcon,
	EditIcon,
	EyeIcon,
	CalendarDaysIcon,
	FolderCogIcon,
	TagIcon
} from 'lucide-react';
import { useState } from 'react';
import ArchiveOrderModal from './ArchiveModal';
import ViewOrderModal from './ViewModal';
import EditOrderModal from './EditModal';
import PDFButton from './PDFButton';

function OrderCard({
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
			<Card className='h-full bg-sidebar'>
				<CardHeader>
					<CardTitle>Order #{order.number}</CardTitle>
				</CardHeader>
				<CardContent className='space-y-4'>
					{/* Order information */}
					<div className='space-y-2'>
						<h4 className='text-sm font-medium text-muted-foreground'>
							Order Information
						</h4>
						<div className='grid grid-cols-1 gap-1.5'>
							<div className='flex items-center'>
								<CalendarDaysIcon className='size-4 text-muted-foreground' />
								<div className='ml-2 text-sm'>
									{new Date(order.date).toLocaleString()}
								</div>
							</div>
							<div className='flex items-center'>
								<FolderCogIcon className='size-4 text-muted-foreground' />
								<div className='ml-2 text-sm capitalize'>
									{order.status}
								</div>
							</div>
							<div className='flex items-center'>
								<TagIcon className='size-4 text-muted-foreground' />
								<div className='ml-2 text-sm capitalize'>
									{order.type}
								</div>
							</div>
						</div>
					</div>
					{/* Financial information */}
					<div className='space-y-2'>
						<h4 className='text-sm font-medium text-muted-foreground'>
							Financial Details
						</h4>
						<div className='space-y-1'>
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
				</CardContent>
				<CardFooter className='flex justify-end gap-2 border-t border-muted pt-4'>
					<div className='flex gap-2 flex-wrap justify-end w-full'>
						<PDFButton order={order} />
						<Button
							size='sm'
							variant='ghost'
							className='flex items-center gap-1.5 min-h-[36px] hover:bg-accent-foreground/10'
							onClick={() => setViewModalOpen(true)}
						>
							<EyeIcon className='size-4' />
							<span>View</span>
						</Button>
						<Button
							size='sm'
							variant='ghost'
							className='flex items-center gap-1.5 min-h-[36px] hover:bg-accent-foreground/10'
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
				</CardFooter>
			</Card>
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

export default OrderCard;
