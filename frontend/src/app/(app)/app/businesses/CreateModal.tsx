'use client';

import {
	Credenza,
	CredenzaContent,
	CredenzaHeader,
	CredenzaTitle,
	CredenzaBody,
	CredenzaDescription
} from '@/components/ui/credenza';
import { FileUpIcon } from 'lucide-react';
import CreateBusinessForm from './CreateForm';
import { CSVImport } from '@/components/csv-import';
import { useState } from 'react';
import { toast } from 'sonner';
import { createBusiness } from '@/lib/pocketbase';
import { Business, Product } from '@/lib/types';

export default function NewBusinessModal({
	open,
	setOpen,
	refreshBusinessList
}: {
	open: boolean;
	setOpen: (open: boolean) => void;
	refreshBusinessList: () => void;
}) {
	const [csvImportOpen, setCsvImportOpen] = useState(false);

	// Handle close by navigating back
	const handleOpenChange = (open: boolean) => {
		refreshBusinessList();
		setOpen(open);
	};
	const handleCsvImport = async (data: Partial<Business | Product>[]) => {
		let successCount = 0;
		const errors: Array<{ row: number; message: string }> = [];

		try {
			for (let i = 0; i < data.length; i++) {
				try {
					await createBusiness(data[i] as Business);
					successCount++;
				} catch (err) {
					console.error(`Error importing row:`, data[i], err);
					errors.push({
						row: i + 1,
						message: err instanceof Error ? err.message : 'Unknown error'
					});
				}
			}

			toast.success(
				`Imported ${successCount} businesses successfully${
					errors.length > 0 ? `, ${errors.length} failed` : ''
				}`
			);
			refreshBusinessList();

			return {
				success: errors.length === 0,
				count: successCount,
				errors: errors.length > 0 ? errors : undefined
			};
		} catch (error) {
			console.error('Import error:', error);
			toast.error('Failed to import businesses');

			return {
				success: false,
				count: successCount,
				errors: [{
					row: 0,
					message: error instanceof Error ? error.message : 'Unknown error during import'
				}]
			};
		}
	};

	return (
		<>
			<Credenza
				open={open}
				onOpenChange={handleOpenChange}
			>
				<CredenzaContent>
					<CredenzaHeader>
						<CredenzaTitle>New Business</CredenzaTitle>
						<CredenzaDescription>
							<button
								onClick={() => setCsvImportOpen(true)}
								className='flex items-center text-sm text-primary hover:underline mt-1'
							>
								<FileUpIcon className='h-3 w-3 mr-1' />
								Import multiple businesses via CSV
							</button>
						</CredenzaDescription>
					</CredenzaHeader>
					<CredenzaBody className='overflow-y-auto flex-1'>
						<div className='p-4'>
							<CreateBusinessForm setOpen={handleOpenChange} />
						</div>
					</CredenzaBody>
				</CredenzaContent>
			</Credenza>

			<CSVImport
				open={csvImportOpen}
				setOpen={setCsvImportOpen}
				onImport={handleCsvImport}
				sampleFileUrl='/samples/businesses-sample.csv'
				entityName='Businesses'
			/>
		</>
	);
}
