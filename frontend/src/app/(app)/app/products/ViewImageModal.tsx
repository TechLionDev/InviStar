'use client';

import Image from 'next/image';
import {
	Credenza,
	CredenzaContent,
	CredenzaHeader,
	CredenzaTitle,
	CredenzaBody
} from '@/components/ui/credenza';
import { Button } from '@/components/ui/button';
import { DownloadCloudIcon } from 'lucide-react';
import { toast } from 'sonner';

export default function ViewImageModal({
	open,
	setOpen,
	imageSrc
}: {
	open: boolean;
	setOpen: (open: boolean) => void;
	imageSrc: string;
}) {
	// Handle close by navigating back
	const handleOpenChange = (open: boolean) => {
		setOpen(open);
	};

	const handleDownload = () => {
		if (imageSrc) {
			fetch(imageSrc)
				.then((response) => response.blob())
				.then((blob) => {
					const blobUrl = URL.createObjectURL(blob);
					const a = document.createElement('a');
					a.href = blobUrl;
					a.download = imageSrc.split('/').pop() || '';
					document.body.appendChild(a);
					a.click();
					document.body.removeChild(a);
					URL.revokeObjectURL(blobUrl);
				})
				.catch(() => toast.error('Download error! Please try again.'));
		}
	};

	return (
		<Credenza
			open={open}
			onOpenChange={handleOpenChange}
		>
			<CredenzaContent className='w-full sm:max-w-4xl md:max-w-5xl h-auto max-h-screen'>
				<CredenzaHeader>
					<CredenzaTitle>View Product Image</CredenzaTitle>
				</CredenzaHeader>
				<CredenzaBody className='flex flex-col items-center justify-center'>
					{imageSrc && (
						<Image
							src={imageSrc}
							alt='Product Image'
							className='w-full h-full object-cover rounded-lg'
							width={0}
							height={0}
							sizes='100vw'
						/>
					)}
					<div className='py-4 flex justify-end w-full'>
						<Button
							className='md:w-full flex gap-2 items-center'
							onClick={handleDownload}
						>
							<DownloadCloudIcon className='h-4 w-4' />
							Download
						</Button>
					</div>
				</CredenzaBody>
			</CredenzaContent>
		</Credenza>
	);
}
