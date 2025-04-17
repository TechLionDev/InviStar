import { CSSProperties, ReactNode } from 'react';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatsCardProps {
	title: string;
	value: string | number;
	icon?: ReactNode;
	description?: string;
	trend?: number;
	trendLabel?: string;
	className?: string;
	iconClassName?: string;
	valueClassName?: string;
	descClassName?: string;
	trendUpClassName?: string;
	trendDownClassName?: string;
	style?: CSSProperties;
	footer?: ReactNode;
}

export function StatsCard({
	title,
	value,
	icon,
	className,
	iconClassName,
	valueClassName,
	style,
	footer
}: StatsCardProps) {


	return (
		<Card
			className={cn('overflow-hidden', className)}
			style={style}
		>
			<CardHeader className='pb-2'>
				<div className='flex items-center justify-between'>
					<CardTitle className='text-sm font-medium'>
						{title}
					</CardTitle>
					{icon && (
						<div
							className={cn(
								'text-muted-foreground',
								iconClassName
							)}
						>
							{icon}
						</div>
					)}
				</div>
			</CardHeader>
			<CardContent className='pb-2'>
				<div className={cn('text-2xl font-bold', valueClassName)}>
					{value}
				</div>
			</CardContent>
			{footer && <CardFooter className='pt-0'>{footer}</CardFooter>}
		</Card>
	);
}
