import { Geist, Geist_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import '@/app/globals.css';
import {
	CheckCircle2Icon,
	InfoIcon,
	TriangleAlertIcon,
	CircleXIcon,
	LoaderCircleIcon
} from 'lucide-react';
import { Toaster } from '@/components/ui/sonner';
import { Metadata } from 'next';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin']
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin']
});

export const metadata: Metadata = {
	title: 'Home | InviStar'
};

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			suppressHydrationWarning={true}
			lang='en'
		>
            <head>
			<meta name="apple-mobile-web-app-title" content="InviStar" />
			</head>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<ThemeProvider
					attribute='class'
					defaultTheme='system'
					enableSystem={true}
					disableTransitionOnChange={true}
				>
					<main>{children}</main>
					<Toaster
						closeButton={true}
						icons={{
							success: <CheckCircle2Icon />,
							info: <InfoIcon />,
							warning: <TriangleAlertIcon />,
							error: <CircleXIcon />,
							loading: <LoaderCircleIcon />
						}}
						position='top-right'
						richColors={true}
					/>
				</ThemeProvider>
			</body>
		</html>
	);
}
