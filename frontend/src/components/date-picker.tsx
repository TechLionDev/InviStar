'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from '@/components/ui/popover';

interface DatePickerProps {
	date: Date | undefined | null;
	setDate: (date: Date | null) => void;
	className?: string;
}

export function DatePicker({ date, setDate, className }: DatePickerProps) {
	const [isOpen, setIsOpen] = React.useState(false);
	return (
		<Popover
			open={isOpen}
			onOpenChange={setIsOpen}
		>
			<PopoverTrigger asChild>
				<Button
					variant={'outline'}
					className={cn(
						'w-full justify-start text-left font-normal',
						!date && 'text-muted-foreground',
						className
					)}
				>
					<CalendarIcon className='mr-2 h-4 w-4' />
					{date ? format(date, 'PPP') : <span>Pick a date</span>}
				</Button>
			</PopoverTrigger>
			<PopoverContent
				className='w-auto p-0'
				align='center'
			>
				<Calendar
					mode='single'
					selected={date || undefined}
					onSelect={(day: Date | undefined) => {
						setDate(day || null);
						setIsOpen(false);
					}}
				/>
			</PopoverContent>
		</Popover>
	);
}
