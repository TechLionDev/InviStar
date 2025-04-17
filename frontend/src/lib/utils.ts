import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getPageTitle(pathname: string) {
	let title = pathname.split('/').pop() || '';
	const titleChars = title.split('');
	titleChars[0] = titleChars[0].toUpperCase();
	title = titleChars.join('');
	return title;
}

export function getBreadcrumbs(pathname: string) {
	const croppedPathname = pathname.split('/app/')[1] || '';
	const list = croppedPathname.split('/').filter((item) => item.length > 0);
	const breadcrumbs = list.map((item, index) => {
		const chars = item.split('');
		chars[0] = chars[0].toUpperCase();
		const path = '/app/' + list.slice(0, index + 1).join('/');
		return {
			name: chars.join(''),
			path: path
		};
	});
	return breadcrumbs;
}

export function formatCurrency(amount: number, currency = 'USD'): string {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency,
		minimumFractionDigits: 2
	}).format(amount);
}
