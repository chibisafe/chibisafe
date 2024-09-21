import { Skeleton } from '@/components/ui/skeleton';
import { Plus } from 'lucide-react';

export default function TagLoading() {
	return (
		<>
			<Skeleton className="h-5 w-1/3" />
			<div className="flex justify-between w-full items-center">
				<Skeleton className="h-10 w-max">A very cool title</Skeleton>
				<Skeleton className="h-10 w-max py-2 px-4">
					<Plus className="mr-2 h-4 w-4" />
					Upload file
				</Skeleton>
			</div>
			<div className="grid grid-cols-2 lg:grid-cols-3 gap-4 w-full">
				<Skeleton className="h-40 w-full" />
				<Skeleton className="h-40 w-full" />
				<Skeleton className="h-40 w-full" />
				<Skeleton className="h-40 w-full" />
				<Skeleton className="h-40 w-full" />
				<Skeleton className="h-40 w-full" />
			</div>
		</>
	);
}