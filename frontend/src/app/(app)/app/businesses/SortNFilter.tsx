import { Button } from '@/components/ui/button';
import {
	CredenzaBody,
	CredenzaClose,
	CredenzaContent,
	CredenzaDescription,
	CredenzaFooter,
	CredenzaHeader,
	CredenzaTitle
} from '@/components/ui/credenza';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select';
import { Business } from '@/lib/types';
import { Separator } from '@/components/ui/separator';
import {
	PlusIcon,
	X,
	ChevronDown,
	ChevronUp,
	FilterIcon,
	ArrowUpDownIcon
} from 'lucide-react';
import { useState } from 'react';

type PropertyType = keyof Business | 'default';
type ComparisonType =
	| 'contains'
	| 'doesNotContain'
	| 'equals'
	| 'startsWith'
	| 'endsWith'
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

function SortNFilter({
	addFilter,
	filters,
	removeFilter,
	updateFilterProperty,
	updateFilterComparison,
	renderFilterInput,
	getComparisonOptions,
	clearFilters,
	activeFiltersCount,
	sortProperty,
	setSortProperty,
	sortDirection,
	setSortDirection
}: {
	addFilter: () => string; // Updated to return string (filter ID)
	filters: Filter[];
	removeFilter: (id: string) => void;
	updateFilterProperty: (id: string, property: PropertyType) => void;
	updateFilterComparison: (id: string, comparison: ComparisonType) => void;
	renderFilterInput: (filter: Filter) => React.ReactNode;
	getComparisonOptions: (property: PropertyType) => ComparisonType[];
	clearFilters: () => void;
	activeFiltersCount: number;
	sortProperty: keyof Business | 'default';
	setSortProperty: (property: keyof Business | 'default') => void;
	sortDirection: 'asc' | 'desc';
	setSortDirection: (direction: 'asc' | 'desc') => void;
}) {
	// Track which filter is expanded (if any)
	const [expandedFilter, setExpandedFilter] = useState<string | null>(null);

	// Toggle expanded state for a filter
	const toggleFilter = (id: string) => {
		setExpandedFilter(expandedFilter === id ? null : id);
	};

	// Helper function to format comparison type for display
	const formatComparison = (comparison: ComparisonType): string => {
		switch (comparison) {
			case 'contains':
				return 'contains';
			case 'doesNotContain':
				return 'does not contain';
			case 'equals':
				return 'equals';
			case 'startsWith':
				return 'starts with';
			case 'endsWith':
				return 'ends with';
			case 'before':
				return 'before';
			case 'onOrBefore':
				return 'on or before';
			case 'after':
				return 'after';
			case 'onOrAfter':
				return 'on or after';
			default:
				return comparison;
		}
	};

	return (
		<CredenzaContent>
			<CredenzaHeader className='mb-6'>
				<CredenzaTitle className='text-xl'>
					Refine Results
				</CredenzaTitle>
				<CredenzaDescription>
					Apply filters and sorting to find businesses quickly.
				</CredenzaDescription>
			</CredenzaHeader>

			<CredenzaBody className='max-h-[70vh] overflow-y-auto'>
				<div className='space-y-8 px-1'>
					{/* Filters Section */}
					<div className='space-y-4'>
						<div className='flex items-center justify-between'>
							<h3 className='flex items-center font-semibold text-base'>
								<FilterIcon className='size-4 mr-2' />
								Filters
							</h3>
							<Button
								variant='outline'
								size='sm'
								onClick={() => {
									const newFilterId = addFilter();
									// Immediately set this new filter as expanded, closing all others
									setExpandedFilter(newFilterId);
								}}
								className='h-8'
							>
								<PlusIcon className='size-4' />
								Add Filter
							</Button>
						</div>

						{filters.length === 0 ? (
							<div className='text-center py-3 border border-dashed rounded-md'>
								<p className='text-muted-foreground text-sm'>
									No filters applied
								</p>
							</div>
						) : (
							<div className='space-y-3'>
								{filters.map((filter) => (
									<div
										key={filter.id}
										className='border rounded-md overflow-hidden'
									>
										{/* Filter Header - Always Visible */}
										<div
											className='p-2 flex items-center justify-between bg-muted/30 cursor-pointer'
											onClick={() =>
												toggleFilter(filter.id)
											}
										>
											<div className='flex items-center gap-2'>
												<Button
													variant='ghost'
													size='icon'
													className='h-6 w-6 flex-shrink-0'
													onClick={(e) => {
														e.stopPropagation(); // Prevent toggling filter
														removeFilter(filter.id);
													}}
												>
													<X className='h-3.5 w-3.5' />
												</Button>

												<span className='text-sm font-medium'>
													{filter.property !==
													'default'
														? filter.property ===
														  'name'
															? 'Name'
															: filter.property ===
															  'contact'
															? 'Contact'
															: filter.property ===
															  'phone'
															? 'Phone'
															: filter.property ===
															  'email'
															? 'Email'
															: filter.property ===
															  'addressStreet'
															? 'Street'
															: filter.property ===
															  'addressCity'
															? 'City'
															: filter.property ===
															  'addressState'
															? 'State'
															: filter.property ===
															  'addressZip'
															? 'Zip'
															: filter.property ===
															  'created'
															? 'Created Date'
															: 'Updated Date'
														: 'No Property Selected'}

													{filter.property !==
														'default' &&
														filter.comparison &&
														filter.value && (
															<span className='text-muted-foreground'>
																{' '}
																{formatComparison(
																	filter.comparison
																)}{' '}
																{filter.value instanceof
																Date
																	? filter.value.toLocaleDateString()
																	: `"${filter.value}"`}
															</span>
														)}
												</span>
											</div>

											{expandedFilter === filter.id ? (
												<ChevronUp className='h-4 w-4' />
											) : (
												<ChevronDown className='h-4 w-4' />
											)}
										</div>

										{/* Filter Body - Only visible when expanded */}
										{expandedFilter === filter.id && (
											<div className='p-3 space-y-3 border-t'>
												<Select
													value={filter.property}
													onValueChange={(val) =>
														updateFilterProperty(
															filter.id,
															val as PropertyType
														)
													}
												>
													<SelectTrigger className='w-full'>
														<SelectValue placeholder='Select property' />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value='default'>
															Select a property
														</SelectItem>
														<SelectItem value='name'>
															Name
														</SelectItem>
														<SelectItem value='contact'>
															Contact
														</SelectItem>
														<SelectItem value='phone'>
															Phone
														</SelectItem>
														<SelectItem value='email'>
															Email
														</SelectItem>
														<SelectItem value='addressStreet'>
															Street
														</SelectItem>
														<SelectItem value='addressCity'>
															City
														</SelectItem>
														<SelectItem value='addressState'>
															State
														</SelectItem>
														<SelectItem value='addressZip'>
															Zip
														</SelectItem>
														<SelectItem value='created'>
															Created Date
														</SelectItem>
														<SelectItem value='updated'>
															Updated Date
														</SelectItem>
													</SelectContent>
												</Select>

												{filter.property !==
													'default' && (
													<>
														<Select
															value={
																filter.comparison
															}
															onValueChange={(
																val
															) =>
																updateFilterComparison(
																	filter.id,
																	val as ComparisonType
																)
															}
														>
															<SelectTrigger>
																<SelectValue placeholder='Comparison type' />
															</SelectTrigger>
															<SelectContent>
																{getComparisonOptions(
																	filter.property
																).map(
																	(
																		option
																	) => (
																		<SelectItem
																			key={
																				option
																			}
																			value={
																				option
																			}
																		>
																			{option ===
																				'contains' &&
																				'Contains'}
																			{option ===
																				'doesNotContain' &&
																				'Does not contain'}
																			{option ===
																				'equals' &&
																				'Equals'}
																			{option ===
																				'startsWith' &&
																				'Starts with'}
																			{option ===
																				'endsWith' &&
																				'Ends with'}
																			{option ===
																				'before' &&
																				'Before'}
																			{option ===
																				'onOrBefore' &&
																				'On or Before'}
																			{option ===
																				'after' &&
																				'After'}
																			{option ===
																				'onOrAfter' &&
																				'On or After'}
																		</SelectItem>
																	)
																)}
															</SelectContent>
														</Select>

														{renderFilterInput(
															filter
														)}
													</>
												)}
											</div>
										)}
									</div>
								))}
							</div>
						)}
					</div>

					<Separator />

					{/* Sorting Section */}
					<div className='space-y-4'>
						<h3 className='flex items-center font-semibold text-base'>
							<ArrowUpDownIcon className='size-4 mr-2' />
							Sorting
						</h3>
						<div className='grid gap-3'>
							<div>
								<label className='text-sm font-medium mb-1 block'>
									Sort by property
								</label>
								<Select
									value={sortProperty}
									onValueChange={(val) =>
										setSortProperty(
											val as keyof Business | 'default'
										)
									}
								>
									<SelectTrigger>
										<SelectValue placeholder='Property' />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='default'>
											Default
										</SelectItem>
										<SelectItem value='name'>
											Name
										</SelectItem>
										<SelectItem value='contact'>
											Contact
										</SelectItem>
										<SelectItem value='phone'>
											Phone
										</SelectItem>
										<SelectItem value='email'>
											Email
										</SelectItem>
										<SelectItem value='addressStreet'>
											Street
										</SelectItem>
										<SelectItem value='addressCity'>
											City
										</SelectItem>
										<SelectItem value='addressState'>
											State
										</SelectItem>
										<SelectItem value='addressZip'>
											Zip
										</SelectItem>
										<SelectItem value='created'>
											Created
										</SelectItem>
										<SelectItem value='updated'>
											Updated
										</SelectItem>
									</SelectContent>
								</Select>
							</div>

							{sortProperty !== 'default' && (
								<div>
									<label className='text-sm font-medium mb-1 block'>
										Direction
									</label>
									<Select
										value={sortDirection}
										onValueChange={(val) =>
											setSortDirection(
												val as 'asc' | 'desc'
											)
										}
									>
										<SelectTrigger>
											<SelectValue placeholder='Direction' />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='asc'>
												Ascending (A-Z, 0-9)
											</SelectItem>
											<SelectItem value='desc'>
												Descending (Z-A, 9-0)
											</SelectItem>
										</SelectContent>
									</Select>
								</div>
							)}
						</div>
					</div>
				</div>
			</CredenzaBody>

			<CredenzaFooter className='pt-6 mt-6 border-t flex gap-2'>
				<Button
					variant='destructive'
					className='flex-1'
					onClick={clearFilters}
					disabled={activeFiltersCount === 0}
				>
					Clear All
				</Button>
				<CredenzaClose asChild>
					<Button
						variant='outline'
						className='flex-1'
					>
						Close
					</Button>
				</CredenzaClose>
			</CredenzaFooter>
		</CredenzaContent>
	);
}

export default SortNFilter;
