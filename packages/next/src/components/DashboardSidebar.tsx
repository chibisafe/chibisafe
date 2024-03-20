'use client';

import { useAtomValue } from 'jotai';
import { BarChart3, Code, FileUp, Files, Key, Library, Network, Settings2, Tags, UserPlus, Users } from 'lucide-react';

import { currentUserAtom } from '@/lib/atoms/currentUser';
import { DashboardSidebarItem } from '@/components/DashboardSidebarItem';
import { saveAs } from 'file-saver';

export function DashboardSidebar() {
	const currentUser = useAtomValue(currentUserAtom);

	const getShareXConfig = async (event: any) => {
		event.preventDefault();
		if (!currentUser?.apiKey) {
			// eslint-disable-next-line no-alert
			window.alert('You need to generate an API key first!');
			return;
		}

		const sharexFile = `{
		"Name": "chibisafe",
		"DestinationType": "ImageUploader, FileUploader",
		"RequestType": "POST",
		"RequestURL": "${location.origin}/api/upload",
		"FileFormName": "file[]",
		"Headers": {
			"x-api-key": "${currentUser.apiKey}"
		},
		"ResponseType": "Text",
		"URL": "$json:url$",
		"ThumbnailURL": "$json:thumb$"
	}`;
		const sharexBlob = new Blob([sharexFile], { type: 'application/octet-binary' });
		saveAs(sharexBlob, `${location.hostname}.sxcu`);
	};

	return (
		<>
			<nav className="grid items-start gap-1">
				<h3 className="text-muted-foreground text-sm pointer-events-none">Main</h3>
				<DashboardSidebarItem href="/dashboard" name="Uploads" Icon={FileUp} />
				<DashboardSidebarItem href="/dashboard/albums" name="Albums" Icon={Library} />
				<DashboardSidebarItem href="/dashboard/tags" name="Tags" Icon={Tags} />
				<DashboardSidebarItem href="/dashboard/snippets" name="Snippets" Icon={Code} />
			</nav>
			<nav className="grid items-start gap-1 mt-4">
				<h3 className="text-muted-foreground text-sm pointer-events-none">Account</h3>
				<DashboardSidebarItem href="/dashboard/account" name="Credentials" Icon={Key} />
			</nav>
			{currentUser?.roles.find(role => role.name === 'admin') ? (
				<nav className="grid items-start gap-1 mt-4">
					<h3 className="text-muted-foreground text-sm pointer-events-none">Admin</h3>
					<DashboardSidebarItem href="/dashboard/admin/settings" name="Settings" Icon={Settings2} />
					<DashboardSidebarItem href="/dashboard/admin/users" name="Users" Icon={Users} />
					<DashboardSidebarItem href="/dashboard/admin/files" name="All files" Icon={Files} />
					<DashboardSidebarItem href="/dashboard/admin/quarantine" name="Quarantined files" Icon={Files} />
					<DashboardSidebarItem href="/dashboard/admin/ip" name="Banned IPs" Icon={Network} />
					<DashboardSidebarItem href="/dashboard/admin/invites" name="Invites" Icon={UserPlus} />
					<DashboardSidebarItem href="/dashboard/admin/statistics" name="Statistics" Icon={BarChart3} />
				</nav>
			) : null}
			<nav className="grid items-start gap-1 mt-4">
				<h3 className="text-muted-foreground text-sm pointer-events-none">Utils</h3>
				<a
					href="https://github.com/chibisafe/chibisafe-extension"
					rel="noopener noreferrer"
					target="_blank"
					className="text-sm font-medium link pl-4"
				>
					Browser extension
				</a>
				<a
					href="#"
					rel="noopener noreferrer"
					className="text-sm font-medium link pl-4"
					onClick={e => void getShareXConfig(e)}
				>
					ShareX config
				</a>
				<a href="#" rel="noopener noreferrer" className="text-sm font-medium link pl-4">
					iOS share shortcut
				</a>
			</nav>
		</>
	);
}
