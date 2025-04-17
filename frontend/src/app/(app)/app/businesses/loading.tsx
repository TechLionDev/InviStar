import LoadingSpinner from '@/components/loading-spinner';

function LoadingModal() {
	return (
		<div className='w-[100%] bg-background/80 flex items-center justify-center fixed top-0 left-0 z-50'>
			<LoadingSpinner />
		</div>
	);
}

export default LoadingModal;
