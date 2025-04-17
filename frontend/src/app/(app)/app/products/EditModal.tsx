'use client';

import {
	Credenza,
	CredenzaContent,
	CredenzaHeader,
	CredenzaTitle,
	CredenzaBody
} from '@/components/ui/credenza';
import EditProductForm from './EditForm';

export default function EditProductModal({
	open,
	setOpen,
	refreshProductList,
	productId
}: {
	open: boolean;
	setOpen: (open: boolean) => void;
	refreshProductList: () => void;
	productId: string;
}) {
	// Handle close by navigating back
	const handleOpenChange = (open: boolean) => {
		refreshProductList();
		setOpen(open);
	};

	return (
		<Credenza
			open={open}
			onOpenChange={handleOpenChange}
		>
			<CredenzaContent>
				<CredenzaHeader>
					<CredenzaTitle>Edit Product</CredenzaTitle>
				</CredenzaHeader>
				<CredenzaBody className='overflow-y-auto flex-1'>
					<div className='p-4'>
						<EditProductForm
							setOpen={handleOpenChange}
							id={productId}
						/>
					</div>
				</CredenzaBody>
			</CredenzaContent>
		</Credenza>
	);
}
