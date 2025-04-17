import PocketBase from 'pocketbase';
import { Business, PaymentTerms, Product, User } from './types';

// Create a singleton PocketBase instance
let pb: PocketBase;

// Initialize PocketBase with the correct backend URL
function getPocketBase() {
	if (pb) return pb;

	// Use environment variables if available, otherwise fallback to a placeholder
	const url =
		process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://localhost:8090'; // <-- placeholder, not a real backend
	pb = new PocketBase(url);

	// Load auth from local storage if in browser environment
	if (typeof window !== 'undefined') {
		pb.authStore.onChange(() => {
			window.location.reload();
		});
	}

	pb.autoCancellation(false);

	return pb;
}

// Export the PocketBase instance
export const pocketbase = getPocketBase();

// Payment Terms constants
export const PAYMENT_TERMS: PaymentTerms[] = [
	'COD',
	'Check',
	'Consignment',
	'Credit Card',
	'Sample',
	'Net15',
	'Net30',
	'Net60'
];

export const DEFAULT_PAYMENT_TERM: PaymentTerms = 'COD';

// Helper function to get the logged in user (with typings)
export async function getCurrentUser() {
	if (isLoggedIn() && pocketbase.authStore.record) {
		return await pocketbase
			.collection('users')
			.getOne(pocketbase.authStore.record.id);
	}
	return null;
}

export async function getAllProducts() {
	if (isLoggedIn() && pocketbase.authStore.record) {
		return await pocketbase.collection('products').getFullList({
			filter: 'archived != true'
		});
	}
	return null;
}

export async function getProductById(id: string) {
	if (isLoggedIn() && pocketbase.authStore.record) {
		return await pocketbase.collection('products').getOne(id);
	}
	return null;
}

export async function archiveProduct(id: string) {
	if (isLoggedIn() && pocketbase.authStore.record) {
		return await pocketbase.collection('products').update(id, {
			archived: true
		});
	}
	return null;
}

export function getProductImage(productId: string, fileName: string) {
	return `${
		process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://localhost:8090'
	}/api/files/products/${productId}/${fileName}`;
}

export function getInvoicePDFURI(id: string, fileName: string) {
	return `${
		process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://localhost:8090'
	}/api/files/invoices/${id}/${fileName}`;
}

export async function getAllBusinesses() {
	if (isLoggedIn() && pocketbase.authStore.record) {
		return await pocketbase.collection('businesses').getFullList({
			filter: 'archived != true'
		});
	}
	return null;
}

export async function getBusinessById(id: string) {
	if (isLoggedIn() && pocketbase.authStore.record) {
		return await pocketbase.collection('businesses').getOne(id);
	}
	return null;
}

export async function archiveBusiness(id: string) {
	if (isLoggedIn() && pocketbase.authStore.record) {
		return await pocketbase.collection('businesses').update(id, {
			archived: true
		});
	}
	return null;
}

// Helper to check if user is authenticated
export function isLoggedIn() {
	return pocketbase.authStore.isValid;
}

export async function isVerified() {
	if (isLoggedIn()) {
		const user = (await getCurrentUser()) as unknown as User;
		return user.verified;
	}
	return false;
}

export async function isSetup() {
	if (isLoggedIn()) {
		const user = (await getCurrentUser()) as unknown as User;
		if (
			user.phone &&
			user.addressStreet &&
			user.addressCity &&
			user.addressState &&
			user.addressZip
		) {
			return true;
		}
		return false;
	}
}

export function getAvatar(userid: string, filename: string) {
	return `${
		process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://localhost:8090'
	}/api/files/users/${userid}/${filename}`;
}

export async function getAllOrders() {
	if (isLoggedIn() && pocketbase.authStore.record) {
		return await pocketbase.collection('orders').getFullList({
			filter: 'archived != true',
			expand: 'business,products,products.product'
		});
	}
	return null;
}

export async function getOrderById(id: string) {
	if (isLoggedIn() && pocketbase.authStore.record) {
		return await pocketbase.collection('orders').getOne(id, {
			expand: 'business,products,products.product'
		});
	}
	return null;
}

export async function archiveOrder(id: string) {
	if (isLoggedIn() && pocketbase.authStore.record) {
		return await pocketbase.collection('orders').update(id, {
			archived: true
		});
	}
	return null;
}

export async function getAllPurchaseOrders() {
	if (isLoggedIn() && pocketbase.authStore.record) {
		return await pocketbase.collection('orders').getFullList({
			filter: 'archived != true && type = "purchase"',
			expand: 'business,products,products.product'
		});
	}
	return null;
}

export async function getAllSalesOrders() {
	if (isLoggedIn() && pocketbase.authStore.record) {
		return await pocketbase.collection('orders').getFullList({
			filter: 'archived != true && type = "sales"',
			expand: 'business,products,products.product'
		});
	}
	return null;
}

export async function getOrderInvoices(id: string) {
	if (isLoggedIn() && pocketbase.authStore.record) {
		return await pocketbase.collection('invoices').getFullList({
			filter: `order = "${id}"`,
			sort: '-created'
		});
	}
	return null;
}

export async function getBusinessOrders(businessId: string, limit?: number) {
	if (isLoggedIn() && pocketbase.authStore.record) {
		const options = {
			filter: `business="${businessId}" && archived != true`,
			sort: '-created',
			expand: 'products,products.product',
			limit: limit || undefined
		};
		return await pocketbase.collection('orders').getFullList(options);
	}
	return null;
}

// Helper for logging out
export function logout() {
	pocketbase.authStore.clear();
}

export const createBusiness = async (data: Business) => {
	try {
		const user = await getCurrentUser();
		return await pocketbase.collection('businesses').create({
			...data,
			createdBy: user?.id
		});
	} catch (error) {
		console.error('Error creating business:', error);
		throw error;
	}
};

export const createProduct = async (data: Product) => {
	try {
		const user = await getCurrentUser();
		return await pocketbase.collection('products').create({
			...data,
			createdBy: user?.id
		});
	} catch (error) {
		console.error('Error creating product:', error);
		throw error;
	}
};

export default pocketbase;
