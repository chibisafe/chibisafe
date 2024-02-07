import { useAtomValue } from 'jotai';
import { BarChart3, Code, FileUp, Files, Key, Library, Network, Settings2, Tags, UserPlus, Users } from 'lucide-react';

import { currentUserAtom } from '@/lib/useCurrentUser';
import { DashboardSidebarItem } from '@/components/DashboardSidebarItem';

export function DashboardSidebar() {
	const currentUser = useAtomValue(currentUserAtom);

	return (
		<>
			<nav className="grid items-start gap-1">
				<h3 className="text-muted-foreground text-sm pointer-events-none">Main</h3>
				<DashboardSidebarItem href="/dashboard" name="Dashboard" Icon={FileUp} />
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
					<DashboardSidebarItem href="/dashboard/admin/files" name="Files" Icon={Files} />
					<DashboardSidebarItem href="/dashboard/admin/quarantine" name="Quarantined files" Icon={Files} />
					<DashboardSidebarItem href="/dashboard/admin/ip" name="Banned IPs" Icon={Network} />
					<DashboardSidebarItem href="/dashboard/admin/invites" name="Invites" Icon={UserPlus} />
					<DashboardSidebarItem href="/dashboard/admin/statistics" name="Statistics" Icon={BarChart3} />
				</nav>
			) : null}
		</>
	);
}
