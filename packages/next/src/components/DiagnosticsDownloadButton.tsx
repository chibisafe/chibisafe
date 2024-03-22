'use client';
import { BugIcon } from 'lucide-react';
import { Button } from './ui/button';
import { saveAs } from 'file-saver';
import request from '@/lib/request';

const getDiagnostics = async () => {
	const { data } = await request.get({ url: 'admin/service/diagnostic' });
	const blob = new Blob([data.diagnostics], { type: 'text/plain' });
	saveAs(blob, `${location.hostname}-diagnostics.log`);
};

export const DiagnosticsDownloadButton = () => {
	return (
		<Button onClick={async () => getDiagnostics()}>
			<BugIcon className="mr-2 h-4 w-4" />
			Download diagnostics
		</Button>
	);
};
