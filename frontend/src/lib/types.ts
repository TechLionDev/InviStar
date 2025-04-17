export type PaymentTerms =
	| 'COD'
	| 'Check'
	| 'Consignment'
	| 'Credit Card'
	| 'Sample'
	| 'Net15'
	| 'Net30'
	| 'Net60';

export type Business = {
	id: string;
	name: string;
	contact: string;
	phone: string;
	email: string;
	addressStreet: string;
	addressCity: string;
	addressState: string;
	addressZip: string;
    terms: PaymentTerms;
    notes: string;
	createdBy: string;
	archived: boolean;
	created: string;
	updated: string;
};

export type User = {
	id: string;
	email: string;
	emailVisibility: boolean;
	verified: boolean;
	name: string;
	avatar: string;
	phone: string;
	addressStreet: string;
	addressCity: string;
	addressState: string;
	addressZip: string;
	created: string;
	updated: string;
};

export type Product = {
	id: string;
	name: string;
	sku: string;
	price: number;
	image: string;
	length: number;
	width: number;
	height: number;
	weight: number;
	createdBy: string;
	created: string;
	updated: string;
};

export type OrderItem = {
	id: string;
	product: string;
	quantity: number;
	price: number;
	archived: boolean;
	createdBy: string;
	created: string;
	updated: string;
	expand?: {
		product?: Product;
	};
};

export type Order = {
	id: string;
	number: string;
	date: string;
	business: string;
	products: string[];
	subtotal: number;
	discount: number;
	tax: number;
	total: number;
	status: 'paid' | 'fulfilled' | 'paid_fulfilled';
	type: 'sales' | 'purchase';
	notes: string;
	createdBy: string;
	archived: boolean;
	created: string;
	updated: string;
	expand?: {
		business?: Business;
		products?: OrderItem[];
	};
};

export type Invoice = {
	id: string;
	order: string;
	file: string;
	createdBy: string;
	orderJSON: string;
	created: string;
	updated: string;
	expand?: {
		order?: Order;
	};
};
