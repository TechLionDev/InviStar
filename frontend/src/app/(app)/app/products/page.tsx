'use client';

import { isLoggedIn, getAllProducts } from '@/lib/pocketbase';
import { useEffect, useState } from 'react';
import ProductList from './ProductList';
import LoadingSpinner from '@/components/loading-spinner';
import { Product } from '@/lib/types';

function Products() {
	const [isLoading, setIsLoading] = useState(true);
	const [products, setProducts] = useState<Product[] | null>(null);

	const refreshProductList = async () => {
		const products = (await getAllProducts()) as unknown as Product[];
		setProducts(products);
	};

	useEffect(() => {
		if (isLoggedIn()) {
			(async () => {
				await refreshProductList();
				setIsLoading(false);
			})();
		}
	}, []);

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
				<ProductList
					products={products || []}
					refreshProductList={refreshProductList}
				/>
			</div>
		</>
	);
}

export default Products;
