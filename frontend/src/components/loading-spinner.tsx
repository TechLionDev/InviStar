import { LoaderCircleIcon } from 'lucide-react';

function LoadingSpinner({ global = true }: { global?: boolean }) {
	return (
		<div
			className={`flex items-center justify-center ${
				global ? 'h-screen' : ''
			}`}
		>
			<LoaderCircleIcon className='size-10 animate-spin' />
		</div>
	);
}

export default LoadingSpinner;
