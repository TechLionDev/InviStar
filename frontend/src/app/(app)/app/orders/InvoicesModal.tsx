'use client';

import { Button } from '@/components/ui/button';
import {
	Credenza,
	CredenzaContent,
	CredenzaHeader,
	CredenzaTitle,
	CredenzaBody
} from '@/components/ui/credenza';
import { FileDownIcon, HistoryIcon, CloudDownloadIcon } from 'lucide-react';
import { Invoice, Order } from '@/lib/types';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { getInvoicePDFURI, getOrderInvoices } from '@/lib/pocketbase';
import LoadingSpinner from '@/components/loading-spinner';

export default function InvoicesModal({
	open,
	setOpen,
	order
}: {
	open: boolean;
	setOpen: (open: boolean) => void;
	order: Order;
}) {
	const [isLoading, setIsLoading] = useState(true);
	const [invoices, setInvoices] = useState<Invoice[]>([]);
	const [downloadingId, setDownloadingId] = useState<string | null>(null);
	const [downloadingAll, setDownloadingAll] = useState(false);

	useEffect(() => {
		const fetchInvoices = async () => {
			try {
				setIsLoading(true);
				const invoiceRecords = (await getOrderInvoices(
					order.id
				)) as unknown as Invoice[];
				setInvoices(invoiceRecords);
			} catch (error) {
				console.error('Error fetching invoices:', error);
				toast.error('Failed to fetch invoices');
			} finally {
				setIsLoading(false);
			}
		};

		if (open) {
			fetchInvoices();
		}
	}, [open, order.id]);

	const handleDownloadInvoice = async (invoice: Invoice) => {
		try {
			setDownloadingId(invoice.id);
			const fileURI = getInvoicePDFURI(invoice.id, invoice.file);

			const response = await fetch(fileURI);
			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			const blob = await response.blob();
			const blobUrl = URL.createObjectURL(blob);

			const a = document.createElement('a');
			a.href = blobUrl;
			a.download = invoice.file || 'invoice.pdf';
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(blobUrl);

			toast.success('Invoice downloaded successfully');
		} catch (error) {
			console.error('Error downloading invoice:', error);
			toast.error('Download error! Please try again.');
		} finally {
			setDownloadingId(null);
		}
	};

	const handleDownloadAllInvoices = async () => {
		if (invoices.length === 0) return;

		setDownloadingAll(true);
		try {
			// Use a small delay between downloads to avoid browser limitations
			for (const invoice of invoices) {
				setDownloadingId(invoice.id);
				await handleDownloadInvoice(invoice);
				// Small timeout to prevent too many simultaneous downloads
				await new Promise((resolve) => setTimeout(resolve, 500));
			}
			toast.success('All invoices downloaded successfully');
		} catch (error) {
			console.error('Error downloading all invoices:', error);
			toast.error('Failed to download all invoices');
		} finally {
			setDownloadingAll(false);
			setDownloadingId(null);
		}
	};

	return (
		<Credenza
			open={open}
			onOpenChange={setOpen}
		>
			<CredenzaContent>
				<CredenzaHeader>
					<CredenzaTitle className='flex items-center gap-2'>
						<HistoryIcon className='size-5' />
						Order Invoices
					</CredenzaTitle>
				</CredenzaHeader>
				<CredenzaBody>
					<div className='p-4'>
						{isLoading ? (
							<div className='w-full flex items-center justify-center py-8'>
								<LoadingSpinner global={false} />
							</div>
						) : invoices.length > 0 ? (
							<div className='space-y-4'>
								<div className='flex items-center justify-between'>
									<p className='text-sm text-muted-foreground'>
										Previous invoices generated for this
										order:
									</p>
									<Button
										size='sm'
										variant='outline'
										className='flex items-center gap-1.5'
										onClick={handleDownloadAllInvoices}
										disabled={downloadingAll}
									>
										<CloudDownloadIcon className='size-4' />
										{downloadingAll
											? 'Downloading...'
											: 'Download All'}
									</Button>
								</div>
								<div className='space-y-2 max-h-[300px] overflow-y-auto'>
									{invoices.map((invoice) => (
										<div
											key={invoice.id}
											className='flex items-center justify-between p-3 rounded-md border bg-card'
										>
											<div>
												<div className='font-medium'>
													Invoice #
													{invoice.id.slice(-4)}
												</div>
												<div className='text-sm text-muted-foreground'>
													{new Date(
														invoice.created
													).toLocaleString()}
												</div>
											</div>
											<Button
												size='sm'
												variant='outline'
												className='flex items-center gap-1.5'
												onClick={() =>
													handleDownloadInvoice(
														invoice
													)
												}
												disabled={
													downloadingId ===
														invoice.id ||
													downloadingAll
												}
											>
												<FileDownIcon className='size-4' />
												{downloadingId === invoice.id
													? 'Downloading...'
													: 'Download'}
											</Button>
										</div>
									))}
								</div>
							</div>
						) : (
							<div className='text-center py-8'>
								<p className='text-muted-foreground'>
									No invoices have been generated for this
									order yet.
								</p>
							</div>
						)}
					</div>
				</CredenzaBody>
			</CredenzaContent>
		</Credenza>
	);
}
