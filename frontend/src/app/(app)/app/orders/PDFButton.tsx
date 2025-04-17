import { Button } from '@/components/ui/button';
import { FileDownIcon } from 'lucide-react';
import { Invoice, Order } from '@/lib/types';
import { useState } from 'react';
import { toast } from 'sonner';
import pocketbase, {
	getCurrentUser,
	getInvoicePDFURI,
	getOrderInvoices
} from '@/lib/pocketbase';

export default function PDFButton({ order }: { order: Order }) {
	const [isGenerating, setIsGenerating] = useState(false);
	const fetchInvoices = async () => {
		return (await getOrderInvoices(order.id)) as unknown as Invoice[];
	};

	async function downloadFileAsFormData(
		url: string,
		fileName: string,
		fieldName = 'file'
	) {
		try {
			// Fetch the file from the URL
			const response = await fetch(url);

			// Check if the request was successful
			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			// Get the file as a Blob
			const blob = await response.blob();

			// Create a FormData object
			const formData = new FormData();

			// Create a File object from the Blob (with a name)
			const file = new File([blob], fileName, { type: blob.type });

			// Add the file to the FormData object
			formData.append(fieldName, file);
			formData.append('order', order.id);
			formData.append('createdBy', (await getCurrentUser())?.id || '');
			formData.append('orderJSON', JSON.stringify(order));
			return formData;
		} catch (error) {
			console.error('Error preparing file as form data:', error);
			throw error;
		}
	}

	const handleGeneratePDF = async () => {
		try {
			setIsGenerating(true);
			const invoices = await fetchInvoices();
			if (invoices.length > 0) {
				const latestInvoice = invoices[0];
				// compare latestInvoice.orderJSON to stringify order
				if (JSON.stringify(order) !== latestInvoice.orderJSON) {
					await createNewInvoicePDF();
				} else {
					const fileURI = getInvoicePDFURI(
						latestInvoice.id,
						latestInvoice.file
					);
					fetch(fileURI)
						.then((response) => response.blob())
						.then((blob) => {
							const blobUrl = URL.createObjectURL(blob);
							const a = document.createElement('a');
							a.href = blobUrl;
							a.download = latestInvoice.file || '';
							document.body.appendChild(a);
							a.click();
							document.body.removeChild(a);
							URL.revokeObjectURL(blobUrl);
						})
						.catch(() =>
							toast.error('Download error! Please try again.')
						);
				}
			} else {
				await createNewInvoicePDF();
			}
		} catch (error) {
			console.error('Error generating PDF:', error);
			toast.error('Failed to generate PDF. Please try again.');
		} finally {
			setIsGenerating(false);
		}
	};

	async function createNewInvoicePDF() {
		toast.warning('Please wait for PDF to arrive.', {
			id: 'pdf-warning',
			dismissible: false,
			description: 'PDF is being generated. This takes 5 to 10 seconds.',
			closeButton: false,
			style: {
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
				gap: '1rem'
			},
			duration: 10000
		});
		const endpoint =
			'gaps_url';

		const fres = await fetch(
			endpoint + `?order=${encodeURIComponent(JSON.stringify(order))}`
		);
		const jres = await fres.json();
		open(jres.pdfLink, '_blank');
		const data = await downloadFileAsFormData(jres.pdfLink, 'invoice.pdf');
		await pocketbase.collection('invoices').create(data);
		toast.dismiss('pdf-warning');
		toast.success('PDF generated successfully!');
	}

	return (
		<Button
			size='sm'
			variant='ghost'
			className='flex items-center gap-1.5'
			onClick={handleGeneratePDF}
			disabled={isGenerating}
		>
			<FileDownIcon className='size-4' />
			<span>{isGenerating ? 'Loading...' : 'Invoice'}</span>
		</Button>
	);
}
