import { DashboardHeader } from '@/components/DashboardHeader';
import { CreateAlbumDialog } from '@/components/dialogs/CreateAlbumDialog';
import { CreateAlbumDrawer } from '@/components/drawers/CreateAlbumDrawer';

export default function AlbumsLayout({ children }: any) {
	return (
		<>
			<DashboardHeader title="Albums" subtitle="Manage and create albums">
				<CreateAlbumDialog className="hidden md:inline-flex" />
				<CreateAlbumDrawer className="inline-flex md:hidden" />
			</DashboardHeader>
			{children}
		</>
	);
}
