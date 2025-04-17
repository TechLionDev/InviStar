import LoadingSpinner from '@/components/loading-spinner';

export default function Loading() {
	return (
		<div className='w-[100%] h-[100%] flex items-center justify-center'>
			<LoadingSpinner />
		</div>
	);
}
