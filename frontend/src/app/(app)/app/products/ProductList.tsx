import { Accordion } from '@/components/ui/accordion';
import ProductItem from './ProductItem';
import { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
	GridIcon,
	ListIcon,
	PlusIcon,
	SearchIcon,
	Settings2Icon
} from 'lucide-react';
import { useState } from 'react';
import ProductCard from './ProductCard';
import { Input } from '@/components/ui/input';
import { Credenza, CredenzaTrigger } from '@/components/ui/credenza';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { DatePicker } from '@/components/date-picker';
import SortNFilter from './SortNFilter';
import NewProductModal from './CreateModal';

function searchAllProperties(product: Product, query: string) {
	if (!query.trim()) return true;
	const combined = Object.values(product).join(' ').toLowerCase();
	return combined.includes(query.toLowerCase());
}

type PropertyType = keyof Product | 'default';
type ComparisonType =
	| 'contains'
	| 'doesNotContain'
	| 'equals'
	| 'startsWith'
	| 'endsWith'
	| 'greaterThan'
	| 'lessThan'
	| 'greaterThanOrEqualTo'
	| 'lessThanOrEqualTo'
	| 'before'
	| 'onOrBefore'
	| 'after'
	| 'onOrAfter';

type Filter = {
	id: string;
	property: PropertyType;
	comparison: ComparisonType;
	value: string | Date | null;
};

function ProductList({
	products,
	refreshProductList
}: {
	products: Product[];
	refreshProductList: () => Promise<void>;
}) {
	const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
	const [searchText, setSearchText] = useState('');
	const [filters, setFilters] = useState<Filter[]>([]);
	const [sortProperty, setSortProperty] = useState<'default' | keyof Product>(
		'default'
	);
	const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
	const [createModalOpen, setCreateModalOpen] = useState(false);

	// Add a new filter
	const addFilter = () => {
		const newId = Math.random().toString(36).substring(2, 9);
		const newFilter: Filter = {
			id: newId,
			property: 'default',
			comparison: 'contains',
			value: ''
		};
		setFilters([...filters, newFilter]);
		return newId;
	};

	// Update an existing filter property
	const updateFilterProperty = (id: string, property: PropertyType) => {
		setFilters(
			filters.map((filter) => {
				if (filter.id === id) {
					// Reset value when changing property type
					let defaultValue: string | Date | null = '';
					let defaultComparison: ComparisonType = 'contains';

					if (property === 'created' || property === 'updated') {
						defaultValue = null;
						defaultComparison = 'after';
					}

					return {
						...filter,
						property,
						comparison: defaultComparison,
						value: defaultValue
					};
				}
				return filter;
			})
		);
	};

	// Update filter comparison
	const updateFilterComparison = (id: string, comparison: ComparisonType) => {
		setFilters(
			filters.map((filter) =>
				filter.id === id ? { ...filter, comparison } : filter
			)
		);
	};

	// Update filter value
	const updateFilterValue = (id: string, value: string | Date | null) => {
		setFilters(
			filters.map((filter) =>
				filter.id === id ? { ...filter, value } : filter
			)
		);
	};

	// Remove a filter
	const removeFilter = (id: string) => {
		setFilters(filters.filter((filter) => filter.id !== id));
	};

	// Clear all filters
	const clearFilters = () => {
		setFilters([]);
		setSearchText('');
		setSortProperty('default');
	};

	const filteredAndSorted = products
		.filter((product) => {
			// Apply all filters (AND operation)
			if (filters.length === 0) return true;

			return filters.every((filter) => {
				if (filter.property === 'default') return true;

				const propertyValue =
					product[filter.property]?.toString().toLowerCase() || '';
				const filterValue =
					filter.value?.toString().toLowerCase() || '';

				// Skip empty filters
				if (!filterValue && filter.value !== null) return true;

				// Handle date properties
				if (
					filter.property === 'created' ||
					filter.property === 'updated'
				) {
					const productDate = new Date(propertyValue);
					const filterDate = filter.value as Date;

					if (!filterDate) return true;

					// Get dates without time components for accurate comparison
					const productDateOnly = new Date(
						productDate.getFullYear(),
						productDate.getMonth(),
						productDate.getDate()
					);
					const filterDateOnly = new Date(
						filterDate.getFullYear(),
						filterDate.getMonth(),
						filterDate.getDate()
					);

					switch (filter.comparison) {
						case 'before':
							return productDateOnly < filterDateOnly;
						case 'onOrBefore':
							return productDateOnly <= filterDateOnly;
						case 'after':
							return productDateOnly > filterDateOnly;
						case 'onOrAfter':
							return productDateOnly >= filterDateOnly;
						default:
							return true;
					}
				}

				// Handle string and number properties
				switch (filter.comparison) {
					case 'contains':
						return propertyValue.includes(filterValue);
					case 'doesNotContain':
						return !propertyValue.includes(filterValue);
					case 'equals':
						return propertyValue === filterValue;
					case 'startsWith':
						return propertyValue.startsWith(filterValue);
					case 'endsWith':
						return propertyValue.endsWith(filterValue);
					case 'greaterThan':
						return (
							parseFloat(propertyValue) > parseFloat(filterValue)
						);
					case 'lessThan':
						return (
							parseFloat(propertyValue) < parseFloat(filterValue)
						);
					case 'greaterThanOrEqualTo':
						return (
							parseFloat(propertyValue) >= parseFloat(filterValue)
						);
					case 'lessThanOrEqualTo':
						return (
							parseFloat(propertyValue) <= parseFloat(filterValue)
						);
					default:
						return true;
				}
			});
		})
		.filter((b) => searchAllProperties(b, searchText))
		.sort((a, b) => {
			if (sortProperty === 'default') return 0;

			// Get values based on property
			const valueA = a[sortProperty];
			const valueB = b[sortProperty];

			// Handle different property types appropriately
			if (sortProperty === 'created' || sortProperty === 'updated') {
				// Date comparison
				const dateA = new Date(valueA as string).getTime();
				const dateB = new Date(valueB as string).getTime();
				return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
			} else if (sortProperty === 'price') {
				// Numeric comparison (assuming these are numeric fields)
				const numA = parseFloat(valueA as string) || 0;
				const numB = parseFloat(valueB as string) || 0;
				return sortDirection === 'asc' ? numA - numB : numB - numA;
			} else {
				// String comparison for other fields
				const strA = (valueA?.toString() || '').toLowerCase();
				const strB = (valueB?.toString() || '').toLowerCase();
				return sortDirection === 'asc'
					? strA.localeCompare(strB)
					: strB.localeCompare(strA);
			}
		});

	// Count active filters (filters + sort if not default)
	const activeFiltersCount =
		filters.length + (sortProperty !== 'default' ? 1 : 0);

	// Get appropriate comparison options based on property type
	const getComparisonOptions = (property: PropertyType): ComparisonType[] => {
		if (property === 'created' || property === 'updated') {
			return ['before', 'after', 'onOrBefore', 'onOrAfter'];
		}
		return [
			'contains',
			'doesNotContain',
			'equals',
			'startsWith',
			'endsWith',
			'greaterThan',
			'lessThan',
			'greaterThanOrEqualTo',
			'lessThanOrEqualTo'
		];
	};

	// Render appropriate input based on property type
	const renderFilterInput = (filter: Filter) => {
		if (filter.property === 'created' || filter.property === 'updated') {
			return (
				<DatePicker
					date={filter.value as Date}
					setDate={(date) => updateFilterValue(filter.id, date)}
					className='w-full'
				/>
			);
		}

		return (
			<Input
				type={'text'}
				placeholder={`Enter ${filter.property} value...`}
				value={(filter.value as string) || ''}
				onChange={(e) => updateFilterValue(filter.id, e.target.value)}
			/>
		);
	};

	return (
		<>
			{products.length > 0 ? (
				<div className='w-full flex flex-col gap-4 @container/list'>
					<div className='flex justify-between'>
						{/* List/Grid view moved to the left */}
						<div className='flex rounded-md overflow-hidden border'>
							<Button
								size='sm'
								variant={
									viewMode === 'list' ? 'default' : 'ghost'
								}
								onClick={() => setViewMode('list')}
								className='rounded-none'
							>
								<ListIcon className='size-4 mr-1' />
								List
							</Button>
							<Separator orientation='vertical' />
							<Button
								size='sm'
								variant={
									viewMode === 'grid' ? 'default' : 'ghost'
								}
								onClick={() => setViewMode('grid')}
								className='rounded-none'
							>
								<GridIcon className='size-4 mr-1' />
								Grid
							</Button>
						</div>

						<Button
							className='flex gap-2'
							size='sm'
							onClick={() => {
								setCreateModalOpen(true);
							}}
						>
							<PlusIcon className='size-4 mr-1' />
							New Product
						</Button>
					</div>
					<div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4'>
						<div className='relative w-full sm:w-80'>
							<Input
								type='text'
								placeholder='Search across all fields...'
								value={searchText}
								onChange={(e) => setSearchText(e.target.value)}
								className='pl-9'
							/>
							<SearchIcon className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4' />
						</div>

						<Credenza>
							<CredenzaTrigger asChild>
								<Button
									variant='outline'
									size='sm'
									className='gap-2'
								>
									<Settings2Icon className='size-4' />
									Filters & Sorting
									{activeFiltersCount > 0 && (
										<Badge
											variant='secondary'
											className='ml-1'
										>
											{activeFiltersCount}
										</Badge>
									)}
								</Button>
							</CredenzaTrigger>
							<SortNFilter
								activeFiltersCount={activeFiltersCount}
								addFilter={addFilter}
								clearFilters={clearFilters}
								filters={filters}
								getComparisonOptions={getComparisonOptions}
								removeFilter={removeFilter}
								renderFilterInput={renderFilterInput}
								setSortDirection={setSortDirection}
								setSortProperty={setSortProperty}
								sortDirection={sortDirection}
								sortProperty={sortProperty}
								updateFilterComparison={updateFilterComparison}
								updateFilterProperty={updateFilterProperty}
							/>
						</Credenza>
					</div>

					{filteredAndSorted.length === 0 ? (
						<div className='text-center p-8 border border-dashed rounded-lg'>
							<p className='text-muted-foreground mb-2'>
								No products match your filters.
							</p>
							<Button
								variant='outline'
								className='mt-2'
								onClick={clearFilters}
							>
								Clear all filters
							</Button>
						</div>
					) : viewMode === 'list' ? (
						<Accordion
							type='single'
							collapsible
						>
							{filteredAndSorted.map((product) => (
								<ProductItem
									key={product.id}
									product={product}
									refreshProductList={refreshProductList}
								/>
							))}
						</Accordion>
					) : (
						<div className='grid grid-cols-1 @xl/list:grid-cols-2 gap-4'>
							{filteredAndSorted.map((product) => (
								<ProductCard
									key={product.id}
									product={product}
									refreshProductList={refreshProductList}
								/>
							))}
						</div>
					)}
				</div>
			) : (
				<div className='w-full h-screen flex flex-col gap-8 justify-center items-center'>
					<h2 className='font-bold text-3xl'>No products found!</h2>
					<Button
						className='flex gap-2'
						onClick={() => {
							setCreateModalOpen(true);
						}}
					>
						<PlusIcon />
						<p>Create One!</p>
					</Button>
				</div>
			)}
			<NewProductModal
				open={createModalOpen}
				setOpen={setCreateModalOpen}
				refreshProductList={refreshProductList}
			/>
		</>
	);
}

export default ProductList;
