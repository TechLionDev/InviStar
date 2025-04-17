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
import CreateProductForm from './CreateForm';
import { CSVImport } from '@/components/csv-import';
import { useState } from 'react';
import { toast } from 'sonner';
import { createProduct } from '@/lib/pocketbase';
import { Product } from '@/lib/types';

export default function NewProductModal({
	open,
	setOpen,
	refreshProductList
}: {
	open: boolean;
	setOpen: (open: boolean) => void;
	refreshProductList: () => void;
}) {
	const [csvImportOpen, setCsvImportOpen] = useState(false);

	// Handle close by navigating back
	const handleOpenChange = (open: boolean) => {
		refreshProductList();
		setOpen(open);
	};
	const handleCsvImport = async (data: Partial<Product>[]) => {
		try {
			let successCount = 0;
			const errors: Array<{ row: number; message: string }> = [];

			for (const [index, row] of data.entries()) {
				try {
					await createProduct(row as Product);
					successCount++;
				} catch (err) {
					console.error(`Error importing row:`, row, err);
					errors.push({
						row: index + 1,
						message: err instanceof Error ? err.message : 'Unknown error'
					});
				}
			}

			toast.success(
				`Imported ${successCount} products successfully${
					errors.length > 0 ? `, ${errors.length} failed` : ''
				}`
			);
			refreshProductList();

			return {
				success: errors.length === 0,
				count: successCount,
				errors: errors.length > 0 ? errors : undefined
			};
		} catch (error) {
			console.error('Import error:', error);
			toast.error('Failed to import products');

			return {
				success: false,
				count: 0,
				errors: [{
					row: 0,
					message: error instanceof Error ? error.message : 'Unknown error'
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
						<CredenzaTitle>New Product</CredenzaTitle>
						<CredenzaDescription>
							<button
								onClick={() => setCsvImportOpen(true)}
								className='flex items-center text-sm text-primary hover:underline mt-1'
							>
								<FileUpIcon className='h-3 w-3 mr-1' />
								Import multiple products via CSV
							</button>
						</CredenzaDescription>
					</CredenzaHeader>
					<CredenzaBody className='overflow-y-auto flex-1'>
						<div className='p-4'>
							<CreateProductForm setOpen={handleOpenChange} />
						</div>
					</CredenzaBody>
				</CredenzaContent>
			</Credenza>

			<CSVImport
				open={csvImportOpen}
				setOpen={setCsvImportOpen}
				onImport={handleCsvImport}
				sampleFileUrl='/samples/products-sample.csv'
				entityName='Products'
			/>
		</>
	);
}
