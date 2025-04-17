'use client';

import {
	Credenza,
	CredenzaContent,
	CredenzaHeader,
	CredenzaTitle,
	CredenzaBody
} from '@/components/ui/credenza';
import EditBusinessForm from './EditForm';

export default function EditOrderModal({
	open,
	setOpen,
	refreshOrderList,
	orderId
}: {
	open: boolean;
	setOpen: (open: boolean) => void;
	refreshOrderList: () => void;
	orderId: string;
}) {
	// Handle close by navigating back
	const handleOpenChange = (open: boolean) => {
		refreshOrderList();
		setOpen(open);
	};

	return (
		<Credenza
			open={open}
			onOpenChange={handleOpenChange}
		>
			<CredenzaContent className='max-h-[95vh] flex flex-col'>
				<CredenzaHeader>
					<CredenzaTitle>Edit Order</CredenzaTitle>
				</CredenzaHeader>
				<CredenzaBody className='overflow-y-auto flex-1'>
					<div className='p-4'>
						<EditBusinessForm
							setOpen={handleOpenChange}
							id={orderId}
						/>
					</div>
				</CredenzaBody>
			</CredenzaContent>
		</Credenza>
	);
}
