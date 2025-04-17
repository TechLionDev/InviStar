'use client';

import { Button } from '@/components/ui/button';
import {
	Credenza,
	CredenzaContent,
	CredenzaHeader,
	CredenzaTitle,
	CredenzaFooter
} from '@/components/ui/credenza';
import { archiveBusiness } from '@/lib/pocketbase';
import { toast } from 'sonner';

export default function ArchiveBusinessModal({
	id,
	open,
	onOpenChange,
	refreshBusinessList
}: {
	id: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	refreshBusinessList: () => Promise<void>;
}) {
	const businessId = id;
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
								await archiveBusiness(businessId);
								await refreshBusinessList();
								onOpenChange(false);
								toast.success(
									'Business archived successfully!'
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
