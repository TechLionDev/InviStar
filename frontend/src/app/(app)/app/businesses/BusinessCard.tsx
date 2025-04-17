import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle
} from '@/components/ui/card';
import { Business } from '@/lib/types';
import {
	ArchiveIcon,
	EditIcon,
	EyeIcon,
	MailIcon,
	MapPinIcon,
	PhoneIcon,
	UserIcon
} from 'lucide-react';
import { useState } from 'react';
import ArchiveBusinessModal from './ArchiveModal';
import ViewBusinessModal from './ViewModal';
import EditBusinessModal from './EditModal';

function BusinessCard({
	business,
	refreshBusinessList
}: {
	business: Business;
	refreshBusinessList: () => Promise<void>;
}) {
	const [archiveModalOpen, setArchiveModalOpen] = useState(false);
	const [viewModalOpen, setViewModalOpen] = useState(false);
	const [editModalOpen, setEditModalOpen] = useState(false);

	return (
		<>
			<Card className='h-full bg-sidebar'>
				<CardHeader>
					<CardTitle>{business.name}</CardTitle>
				</CardHeader>
				<CardContent className='space-y-4'>
					{/* Contact information */}
					<div className='space-y-2'>
						<h4 className='text-sm font-medium text-muted-foreground'>
							Contact Information
						</h4>
						<div className='grid grid-cols-1 gap-1.5'>
							<div className='flex items-center'>
								<UserIcon className='size-4 text-muted-foreground' />
								<div className='ml-2 text-sm'>
									{business.contact}
								</div>
							</div>
							<div className='flex items-center'>
								<PhoneIcon className='size-4 text-muted-foreground' />
								<div className='ml-2 text-sm'>
									{business.phone}
								</div>
							</div>
							<div className='flex items-center'>
								<MailIcon className='size-4 text-muted-foreground' />
								<div className='ml-2 text-sm'>
									{business.email}
								</div>
							</div>
							<div className='flex items-start mt-2'>
								<MapPinIcon className='size-4 text-muted-foreground mt-0.5' />
								<div className='ml-2 text-sm'>
									{business.addressStreet}
									<br />
									{business.addressCity}
									<br />
									{business.addressState},{' '}
									{business.addressZip}
								</div>
							</div>
						</div>
					</div>

					{/* Terms */}
					<div className='space-y-2'>
						<h4 className='text-sm font-medium text-muted-foreground'>
							Payment Terms
						</h4>
						<div className='text-sm'>{business.terms}</div>
					</div>

					{/* Notes */}
					{business.notes && (
						<div className='space-y-2'>
							<h4 className='text-sm font-medium text-muted-foreground'>
								Notes
							</h4>
							<div className='text-sm line-clamp-3'>
								{business.notes}
							</div>
						</div>
					)}
				</CardContent>
				<CardFooter className='flex justify-end gap-2 border-t border-muted pt-4'>
					<Button
						size='sm'
						variant='ghost'
						className='flex items-center gap-1.5 hover:bg-accent-foreground/10'
						onClick={() => setViewModalOpen(true)}
					>
						<EyeIcon className='size-4' />
						<span>View</span>
					</Button>
					<Button
						size='sm'
						variant='ghost'
						className='flex items-center gap-1.5 hover:bg-accent-foreground/10'
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
				</CardFooter>
			</Card>
			<ArchiveBusinessModal
				id={business.id}
				open={archiveModalOpen}
				onOpenChange={setArchiveModalOpen}
				refreshBusinessList={refreshBusinessList}
			/>
			<ViewBusinessModal
				businessId={business.id}
				open={viewModalOpen}
				setOpen={setViewModalOpen}
			/>
			<EditBusinessModal
				businessId={business.id}
				open={editModalOpen}
				setOpen={setEditModalOpen}
				refreshBusinessList={refreshBusinessList}
			/>
		</>
	);
}

export default BusinessCard;
