'use client';

import { Button } from '@/components/ui/button';
import {
	Credenza,
	CredenzaContent,
	CredenzaHeader,
	CredenzaTitle,
	CredenzaFooter
} from '@/components/ui/credenza';
import { archiveProduct } from '@/lib/pocketbase';
import { toast } from 'sonner';

export default function ArchiveProductModal({
	id,
	open,
	onOpenChange,
	refreshProductList
}: {
	id: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	refreshProductList: () => Promise<void>;
}) {
	const productId = id;
	return (
		<Credenza
			open={open}
			onOpenChange={onOpenChange}
		>
			<CredenzaContent>
				<CredenzaHeader>
					<CredenzaTitle>
						Are you sure you want to continue?
					</CredenzaTitle>
				</CredenzaHeader>
				<CredenzaFooter>
					<div className='flex justify-end gap-2'>
						<Button
							variant='secondary'
							onClick={() => onOpenChange(false)}
						>
							Cancel
						</Button>
						<Button
							variant='destructive'
							onClick={async () => {
								await archiveProduct(productId);
								await refreshProductList();
								onOpenChange(false);
								toast.success(
									'Product archived successfully!'
								);
							}}
						>
							Archive
						</Button>
					</div>
				</CredenzaFooter>
			</CredenzaContent>
		</Credenza>
	);
}
