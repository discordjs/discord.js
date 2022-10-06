import type { PropsWithChildren } from 'react';
import { VscFlame } from 'react-icons/vsc';

export function Tip({ children }: PropsWithChildren<{}>) {
	return (
		<div className="my-4 rounded border border-green-500 p-4">
			<div className="flex flex-row place-items-center gap-4">
				<span className="text-green-500">
					<VscFlame size={20} />
				</span>
				<div className="flex flex-col gap-2 text-sm">
					<span className="font-semibold text-green-500">Tip</span>
					{children}
				</div>
			</div>
		</div>
	);
}
