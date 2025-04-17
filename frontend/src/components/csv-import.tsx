/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import {
	Credenza,
	CredenzaContent,
	CredenzaDescription,
	CredenzaHeader,
	CredenzaTitle,
	CredenzaBody,
	CredenzaFooter
} from '@/components/ui/credenza';
import { Input } from '@/components/ui/input';
import { AlertTriangle, FileText, Upload, X } from 'lucide-react';
import { useState, useRef, useCallback } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import LoadingSpinner from './loading-spinner';
import { Business, Product, PaymentTerms } from '@/lib/types';

interface CSVImportProps {
	open: boolean;
	setOpen: (open: boolean) => void;
	onImport: (data: Partial<Business | Product>[]) => Promise<{
		success: boolean;
		count: number;
		errors?: Array<{ row: number; message: string }>;
	}>;
	sampleFileUrl: string;
	entityName: string;
}

interface ParsedRecord extends Record<string, any> {
	_rowIndex?: number;
	_hasError?: boolean;
	_errorMessage?: string;
}

export function CSVImport({
	open,
	setOpen,
	onImport,
	sampleFileUrl,
	entityName
}: CSVImportProps) {
	const [file, setFile] = useState<File | null>(null);
	const [parsing, setParsing] = useState(false);
	const [importing, setImporting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [importResult, setImportResult] = useState<{
		success: boolean;
		count: number;
		errors?: Array<{ row: number; message: string }>;
	} | null>(null);
	const [preview, setPreview] = useState<ParsedRecord[] | null>(null);
	const [allRows, setAllRows] = useState<ParsedRecord[] | null>(null);
	const [isDragging, setIsDragging] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const dropZoneRef = useRef<HTMLDivElement>(null);

	// Parse CSV and handle type conversions based on entity type
	const parseCSV = async (csvFile: File): Promise<ParsedRecord[]> => {
		const text = await csvFile.text();
		const rows = text.split('\n');

		if (rows.length < 2) {
			throw new Error(
				'CSV file must contain at least a header row and one data row'
			);
		}

		// Get headers and trim whitespace
		const headers = rows[0].split(',').map((header) => header.trim());

		// Process each row based on the entity type
		const parsedData = rows
			.slice(1)
			.filter((row) => row.trim() !== '')
			.map((row, index) => {
				const values = row.split(',').map((value) => value.trim());
				const rowData: ParsedRecord = {
					_rowIndex: index + 1 // +1 because we're skipping the header row
				};

				headers.forEach((header, colIndex) => {
					const value = values[colIndex] || '';

					// Apply specific parsing for businesses
					if (entityName.toLowerCase() === 'businesses') {
						if (header === 'terms') {
							rowData[header] = value as PaymentTerms;
						} else if (
							header === 'archived' &&
							(value.toLowerCase() === 'true' ||
								value.toLowerCase() === 'false')
						) {
							rowData[header] = value.toLowerCase() === 'true';
						} else if (header === 'notes') {
							// Handle notes field - preserve newlines by replacing \\n with actual newlines
							rowData[header] = value.replace(/\\n/g, '\n');
						} else {
							rowData[header] = value;
						}
					}
					// Apply specific parsing for products
					else if (entityName.toLowerCase() === 'products') {
						if (
							[
								'price',
								'cost',
								'quantity',
								'length',
								'width',
								'height',
								'weight'
							].includes(header)
						) {
							const numVal = parseFloat(value);
							rowData[header] = !isNaN(numVal) ? numVal : 0;
						} else if (header === 'notes') {
							// Handle notes field - preserve newlines by replacing \\n with actual newlines
							rowData[header] = value.replace(/\\n/g, '\n');
						} else {
							rowData[header] = value;
						}
					} else {
						rowData[header] = value;
					}
				});

				return rowData;
			});

		if (parsedData.length === 0) {
			throw new Error('No data rows found in the CSV file');
		}

		return parsedData;
	};

	// Basic validation before sending to server
	const validateData = (data: ParsedRecord[]): ParsedRecord[] => {
		return data.map((row) => {
			const validatedRow = { ...row };

			// Check for SKU length if this is a product import
			if (entityName.toLowerCase() === 'products' && 'sku' in row) {
				// This is an example validation - adjust based on your actual requirements
				if (typeof row.sku === 'string') {
					if (row.sku.length === 0) {
						validatedRow._hasError = true;
						validatedRow._errorMessage = 'SKU is required';
					}
					// Check if SKU is not exactly 12 characters (based on your error description)
					// else if (row.sku.length !== 12) {
					//     validatedRow._hasError = true;
					//     validatedRow._errorMessage = 'SKU must be exactly 12 characters';
					// }
				}
			}

			// Add additional validations for businesses or other fields as needed

			return validatedRow;
		});
	};

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = e.target.files?.[0];
		if (selectedFile) {
			setFile(selectedFile);
			setError(null);
			setImportResult(null);
			setParsing(true);

			try {
				const parsedData = await parseCSV(selectedFile);
				const validatedData = validateData(parsedData);
				setAllRows(validatedData);
				setPreview(validatedData.slice(0, 3));
			} catch (err) {
				console.error('Error parsing CSV:', err);
				setError(
					err instanceof Error
						? err.message
						: 'Failed to parse CSV file'
				);
				setFile(null);
			} finally {
				setParsing(false);
			}
		}
	};

	// Handle drag and drop functionality
	const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragging(true);
	}, []);

	const handleDragLeave = useCallback(() => {
		setIsDragging(false);
	}, []);

	const handleDrop = useCallback(
		async (e: React.DragEvent<HTMLDivElement>) => {
			e.preventDefault();
			setIsDragging(false);

			const droppedFile = e.dataTransfer.files[0];
			if (droppedFile && droppedFile.name.endsWith('.csv')) {
				setFile(droppedFile);
				setError(null);
				setImportResult(null);
				setParsing(true);

				try {
					const parsedData = await parseCSV(droppedFile);
					const validatedData = validateData(parsedData);
					setAllRows(validatedData);
					setPreview(validatedData.slice(0, 3));
				} catch (err) {
					console.error('Error parsing CSV:', err);
					setError(
						err instanceof Error
							? err.message
							: 'Failed to parse CSV file'
					);
					setFile(null);
				} finally {
					setParsing(false);
				}
			} else {
				setError('Please upload a valid CSV file');
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[]
	);

	const handleImport = async () => {
		if (!file || !allRows) return;

		setImporting(true);
		setImportResult(null);

		try {
			// Filter out the metadata properties we added
			const cleanData = allRows.map((row) => {
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				const { _rowIndex, _hasError, _errorMessage, ...cleanRow } =
					row;
				return cleanRow;
			});

			// Call the onImport function with the data
			const result = await onImport(cleanData);
			setImportResult(result);

			// Update rows with error information from the server
			if (result.errors && result.errors.length > 0) {
				const updatedRows = [...allRows];

				// Map server errors to our rows
				result.errors.forEach((err) => {
					const rowIndex = updatedRows.findIndex(
						(row) => row._rowIndex === err.row
					);
					if (rowIndex >= 0) {
						updatedRows[rowIndex]._hasError = true;
						updatedRows[rowIndex]._errorMessage = err.message;
					}
				});

				setAllRows(updatedRows);
				setPreview(updatedRows.slice(0, 3));
			} else if (result.success) {
				// Only close on success with no errors
				setTimeout(() => {
					setOpen(false);
					resetFileInput();
				}, 2000);
			}
		} catch (err) {
			console.error('Error importing CSV:', err);
			setError(
				err instanceof Error ? err.message : 'Failed to import CSV file'
			);
		} finally {
			setImporting(false);
		}
	};

	const handleDownloadSample = async () => {
		try {
			const response = await fetch(sampleFileUrl);

			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			const blob = await response.blob();
			const blobUrl = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = blobUrl;
			a.download = `sample_${entityName.toLowerCase()}.csv`;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(blobUrl);
		} catch (error) {
			console.error('Download error:', error);
		}
	};

	const resetFileInput = () => {
		setFile(null);
		setPreview(null);
		setAllRows(null);
		setError(null);
		setImportResult(null);
		if (fileInputRef.current) fileInputRef.current.value = '';
	};

	return (
		<Credenza
			open={open}
			onOpenChange={(isOpen) => {
				setOpen(isOpen);
				if (!isOpen) resetFileInput();
			}}
		>
			<CredenzaContent className='max-w-4xl'>
				<CredenzaHeader>
					<CredenzaTitle>Import {entityName} from CSV</CredenzaTitle>
					<CredenzaDescription>
						Upload a CSV file to import multiple{' '}
						{entityName.toLowerCase()} at once
					</CredenzaDescription>
				</CredenzaHeader>

				<CredenzaBody className='max-h-[80vh] overflow-hidden'>
					{error && (
						<Alert
							variant='destructive'
							className='mb-4'
						>
							<AlertTriangle className='h-4 w-4' />
							<AlertTitle>Error</AlertTitle>
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}

					<div
						className='space-y-4 overflow-y-auto pr-2'
						style={{ maxHeight: 'calc(80vh - 180px)' }}
					>
						{!file ? (
							<div
								ref={dropZoneRef}
								className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 md:p-8 transition-colors
									${isDragging ? 'border-primary bg-primary/5' : 'border-border'}`}
								onDragOver={handleDragOver}
								onDragLeave={handleDragLeave}
								onDrop={handleDrop}
							>
								<FileText className='h-10 w-10 text-muted-foreground mb-2' />

								<div className='flex flex-col items-center text-center'>
									<p className='font-medium'>
										Click to upload or drag and drop
									</p>
									<p className='text-sm text-muted-foreground'>
										CSV file (max 5MB)
									</p>
								</div>

								<Input
									ref={fileInputRef}
									type='file'
									accept='.csv'
									onChange={handleFileChange}
									className='max-w-xs mt-4'
								/>

								<div className='mt-2 text-xs text-muted-foreground'>
									<Button
										variant='link'
										className='text-primary hover:underline flex items-center gap-1 p-0 h-auto text-xs'
										onClick={handleDownloadSample}
									>
										<FileText className='h-3 w-3' />
										Download sample CSV
									</Button>
								</div>

								{entityName.toLowerCase() === 'products' && (
									<div className='mt-4 text-xs text-muted-foreground bg-muted/50 p-2 rounded max-w-md text-center'>
										<p>
											<strong>Note:</strong> For products,
											make sure SKU values follow the
											required format.
										</p>
									</div>
								)}
							</div>
						) : (
							<div className='flex items-center justify-between p-4 border rounded-lg bg-muted/30'>
								<div className='flex items-center gap-2 overflow-hidden'>
									<FileText className='h-8 w-8 flex-shrink-0 text-muted-foreground' />
									<div className='overflow-hidden'>
										<p className='font-medium text-sm truncate'>
											{file.name}
										</p>
										<p className='text-xs text-muted-foreground'>
											{(file.size / 1024).toFixed(1)} KB •{' '}
											{allRows?.length || 0} records
										</p>
									</div>
								</div>
								<Button
									variant='ghost'
									size='icon'
									onClick={resetFileInput}
									disabled={parsing || importing}
								>
									<X className='h-4 w-4' />
								</Button>
							</div>
						)}

						{parsing && (
							<div className='flex flex-col items-center justify-center py-8'>
								<LoadingSpinner global={false} />
								<p className='text-sm text-muted-foreground mt-2'>
									Parsing CSV file...
								</p>
							</div>
						)}

						{preview && preview.length > 0 && (
							<div className='border rounded-lg overflow-hidden'>
								<div className='text-sm font-medium p-2 bg-muted flex items-center justify-between'>
									<span>
										Preview ({Math.min(preview.length, 3)}{' '}
										of {allRows?.length || 0} rows)
									</span>
									{preview.length > 3 && (
										<span className='text-xs text-muted-foreground'>
											Showing first 3 rows
										</span>
									)}
								</div>
								<div
									className='overflow-auto'
									style={{ maxHeight: '300px' }}
								>
									<table className='w-full divide-y divide-border text-sm'>
										<thead className='sticky top-0 bg-background z-10'>
											<tr>
												<th className='px-3 py-2 text-left font-medium whitespace-nowrap w-10'>
													Row
												</th>
												<th className='px-3 py-2 text-left font-medium whitespace-nowrap w-10'>
													Status
												</th>
												{Object.keys(preview[0])
													.filter(
														(key) =>
															!key.startsWith('_')
													)
													.map((header) => (
														<th
															key={header}
															className='px-3 py-2 text-left font-medium whitespace-nowrap'
														>
															{header}
														</th>
													))}
											</tr>
										</thead>
										<tbody className='divide-y divide-border'>
											{preview.map((row, index) => (
												<tr
													key={index}
													className={`hover:bg-muted/50 ${
														row._hasError
															? 'bg-red-50 dark:bg-red-950/20'
															: ''
													}`}
												>
													<td className='px-3 py-2 text-muted-foreground'>
														{row._rowIndex}
													</td>
													<td className='px-3 py-2'>
														{row._hasError ? (
															<div
																className='flex items-center text-red-500'
																title={
																	row._errorMessage
																}
															>
																<AlertTriangle className='h-4 w-4 mr-1' />
															</div>
														) : (
															<div className='w-4 h-4'></div>
														)}
													</td>
													{Object.entries(row)
														.filter(
															([key]) =>
																!key.startsWith(
																	'_'
																)
														)
														.map(
															(
																// eslint-disable-next-line @typescript-eslint/no-unused-vars
																[key, value],
																i
															) => (
																<td
																	key={`${index}-${i}`}
																	className='px-3 py-2 overflow-hidden text-ellipsis max-w-[200px]'
																	title={String(
																		value ??
																			''
																	)}
																>
																	{String(
																		value ??
																			''
																	)}
																</td>
															)
														)}
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
						)}
					</div>
				</CredenzaBody>

				<CredenzaFooter>
					<div className='flex justify-between w-full gap-4'>
						<Button
							variant='outline'
							onClick={() => setOpen(false)}
							disabled={parsing || importing}
						>
							Cancel
						</Button>
						<Button
							type='button'
							onClick={handleImport}
							disabled={
								!file ||
								parsing ||
								importing ||
								preview?.some((row) => row._hasError)
							}
							className='flex gap-2 items-center'
						>
							{importing ? (
								<>
									<LoadingSpinner global={false} />
									<span>Importing...</span>
								</>
							) : (
								<>
									<Upload className='h-4 w-4' />
									<span>
										Import{' '}
										{file && allRows
											? `${
													allRows.length
											  } ${entityName.toLowerCase()}`
											: ''}
									</span>
								</>
							)}
						</Button>
					</div>
				</CredenzaFooter>
			</CredenzaContent>
		</Credenza>
	);
}
