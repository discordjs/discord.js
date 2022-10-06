import type { PropsWithChildren } from 'react';
import { VscInfo } from 'react-icons/vsc';

export function Info({ children }: PropsWithChildren<{}>) {
	return (
		<div className="rounded border border-blue-500 p-4">
			<div className="flex flex-row place-items-center gap-4">
				<span className="text-blue-500">
					<VscInfo size={20} />
				</span>
				<div className="flex flex-col gap-2 text-sm">
					<span className="font-semibold text-blue-500">Info</span>
					{children}
				</div>
			</div>
		</div>
	);
}
