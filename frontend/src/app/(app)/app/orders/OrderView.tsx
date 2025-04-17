'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ViewOrderModal from './ViewModal';

export default function OrderView() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const [viewOrderId, setViewOrderId] = useState<string | null>(null);
	const [viewModalOpen, setViewModalOpen] = useState(false);
	const [fromPage, setFromPage] = useState<string | null>(null);

	useEffect(() => {
		// Get the query parameters
		const viewParam = searchParams.get('view');
		const fromParam = searchParams.get('from');

		// If we have a view parameter, open the modal with that order ID
		if (viewParam) {
			setViewOrderId(viewParam);
			setViewModalOpen(true);

			// Remember where the request came from
			if (fromParam) {
				setFromPage(fromParam);
			}
		} else {
			// Reset state when there's no view parameter
			setViewOrderId(null);
			setViewModalOpen(false);
			setFromPage(null);
		}
	}, [searchParams]);

	// Handle modal close
	const handleModalClose = (open: boolean) => {
		setViewModalOpen(open);

		// If modal is closing and we have a fromPage, navigate back
		if (!open && fromPage) {
			// Navigate back to the source page
			router.push(`/app/${fromPage}`);
		}
	};

	// Only render the modal if we have an order ID
	if (!viewOrderId) return null;

	return (
		<ViewOrderModal
			open={viewModalOpen}
			setOpen={handleModalClose}
			orderId={viewOrderId}
		/>
	);
}
