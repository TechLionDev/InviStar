import {
	AccordionContent,
	AccordionItem,
	AccordionTrigger
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
	UserIcon,
	PhoneIcon,
	MailIcon,
	MapPinIcon,
	EyeIcon,
	EditIcon,
	ArchiveIcon
} from 'lucide-react';
import { Business } from '@/lib/types';
import { useState } from 'react';
import ArchiveBusinessModal from './ArchiveModal';
import ViewBusinessModal from './ViewModal';
import EditBusinessModal from './EditModal';

function BusinessItem({
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
			<AccordionItem value={business.id}>
				<AccordionTrigger>{business.name}</AccordionTrigger>
				<AccordionContent>
					{/* Rest of your existing code remains the same */}
					<div className='p-4 space-y-4'>
						{/* Main content with business info */}
						<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
							{/* Contact information column */}
							<div className='space-y-3'>
								<h4 className='text-sm font-medium text-muted-foreground'>
									Contact Information
								</h4>
								<div className='space-y-2'>
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
								</div>

								{/* Payment Terms */}
								<div className='mt-4'>
									<h4 className='text-sm font-medium text-muted-foreground mb-1'>
										Payment Terms
									</h4>
									<div className='text-sm'>
										{business.terms}
									</div>
								</div>
							</div>

							{/* Address column */}
							<div className='space-y-3'>
								<h4 className='text-sm font-medium text-muted-foreground'>
									Location
								</h4>
								<div className='flex items-start'>
									<MapPinIcon className='size-4 text-muted-foreground mt-0.5' />
									<div className='ml-2 text-sm'>
										{business.addressStreet}
										<br />
										{business.addressCity}
										<br />
										{business.addressState}
										{', '}
										{business.addressZip}
									</div>
								</div>
							</div>
						</div>

						{/* Notes */}
						{business.notes && (
							<div className='mt-4 space-y-2'>
								<h4 className='text-sm font-medium text-muted-foreground'>
									Notes
								</h4>
								<div className='text-sm bg-muted/40 rounded-md p-3'>
									{business.notes}
								</div>
							</div>
						)}

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

export default BusinessItem;
