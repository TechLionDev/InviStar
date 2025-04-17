'use client';

import { Button } from '@/components/ui/button';
import {
	Credenza,
	CredenzaContent,
	CredenzaHeader,
	CredenzaTitle,
	CredenzaFooter
} from '@/components/ui/credenza';
import { archiveOrder } from '@/lib/pocketbase';
import { toast } from 'sonner';

export default function ArchiveOrderModal({
	id,
	open,
	onOpenChange,
	refreshOrderList
}: {
	id: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	refreshOrderList: () => Promise<void>;
}) {
	const orderId = id;
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
								await archiveOrder(orderId);
								await refreshOrderList();
								onOpenChange(false);
								toast.success('Order archived successfully!');
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
