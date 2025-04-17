'use client';

import { isLoggedIn, getAllBusinesses } from '@/lib/pocketbase';
import { useEffect, useState } from 'react';
import BusinessList from './BusinessList';
import LoadingSpinner from '@/components/loading-spinner';
import { Business } from '@/lib/types';
import { useSearchParams } from 'next/navigation';

function Businesses() {
	const [isLoading, setIsLoading] = useState(true);
    const [businesses, setBusinesses] = useState<Business[] | null>(null);
    const searchParams = useSearchParams();
    const refresh = searchParams.get('refresh');

	const refreshBusinessList = async () => {
		const businesses = (await getAllBusinesses()) as unknown as Business[];
		setBusinesses(businesses);
    };

	useEffect(() => {
		if (isLoggedIn()) {
			(async () => {
				await refreshBusinessList();
				setIsLoading(false);
			})();
		}
	}, [refresh]);

	if (isLoading) {
		return (
			<div className='w-[100%] h-[100%] flex items-center justify-center'>
				<LoadingSpinner />
			</div>
		);
	}

	return (
		<>
			<div className='flex py-4'>
				<BusinessList
					businesses={businesses || []}
					refreshBusinessList={refreshBusinessList}
				/>
			</div>
		</>
	);
}

export default Businesses;
