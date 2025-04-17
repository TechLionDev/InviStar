'use client';

import {
	Credenza,
	CredenzaContent,
	CredenzaHeader,
	CredenzaTitle,
	CredenzaBody
} from '@/components/ui/credenza';
import CreateOrderForm from './CreateForm';

export default function NewOrderModal({
	open,
	setOpen,
    refreshOrderList,
    type
}: {
	open: boolean;
	setOpen: (open: boolean) => void;
	refreshOrderList: () => void;
    type: 'sales' | 'purchase';
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
			<CredenzaContent>
				<CredenzaHeader>
					<CredenzaTitle>New Order</CredenzaTitle>
				</CredenzaHeader>
				<CredenzaBody className='overflow-y-auto flex-1'>
					<div className='p-4'>
						<CreateOrderForm
							setOpen={handleOpenChange}
							type={type}
						/>
					</div>
				</CredenzaBody>
			</CredenzaContent>
		</Credenza>
	);
}
