'use client';

import {
	Credenza,
	CredenzaContent,
	CredenzaHeader,
	CredenzaTitle,
	CredenzaBody
} from '@/components/ui/credenza';
import EditBusinessForm from './EditForm';

export default function EditBusinessModal({
	open,
	setOpen,
	refreshBusinessList,
	businessId
}: {
	open: boolean;
	setOpen: (open: boolean) => void;
	refreshBusinessList: () => void;
	businessId: string;
}) {
	// Handle close by navigating back
	const handleOpenChange = (open: boolean) => {
		refreshBusinessList();
		setOpen(open);
	};

	return (
		<Credenza
			open={open}
			onOpenChange={handleOpenChange}
		>
			<CredenzaContent>
				<CredenzaHeader>
					<CredenzaTitle>Edit Business</CredenzaTitle>
				</CredenzaHeader>
				<CredenzaBody className='overflow-y-auto flex-1'>
					<div className='p-4'>
						<EditBusinessForm
							setOpen={handleOpenChange}
							id={businessId}
						/>
					</div>
				</CredenzaBody>
			</CredenzaContent>
		</Credenza>
	);
}
