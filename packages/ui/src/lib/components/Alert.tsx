import { VscFlame } from '@react-icons/all-files/vsc/VscFlame';
import { VscInfo } from '@react-icons/all-files/vsc/VscInfo';
import { VscWarning } from '@react-icons/all-files/vsc/VscWarning';
import type { PropsWithChildren } from 'react';

export interface IAlert {
	readonly title?: string | undefined;
	readonly type: 'danger' | 'info' | 'success' | 'warning';
}

function resolveType(type: IAlert['type']) {
	switch (type) {
		case 'danger': {
			return {
				text: 'text-red-500',
				border: 'border-red-500',
				icon: <VscWarning size={20} />,
			};
		}

		case 'info': {
			return {
				text: 'text-blue-500',
				border: 'border-blue-500',
				icon: <VscInfo size={20} />,
			};
		}

		case 'success': {
			return {
				text: 'text-green-500',
				border: 'border-green-500',
				icon: <VscFlame size={20} />,
			};
		}

		case 'warning': {
			return {
				text: 'text-yellow-500',
				border: 'border-yellow-500',
				icon: <VscWarning size={20} />,
			};
		}
	}
}

export function Alert({ title, type, children }: PropsWithChildren<IAlert>) {
	const { text, border, icon } = resolveType(type);

	return (
		<div className="mb-4 mt-6">
			<div className="relative flex">
				<div className="p-4">{children}</div>
				<div className="pointer-events-none absolute h-full w-full flex">
					<div className={`w-4 shrink-0 border-b-2 border-l-2 border-t-2 rounded-bl-1.5 rounded-tl-1.5 ${border}`} />
					<div className={`relative border-b-2 ${border}`}>
						<div className={`pointer-events-auto flex place-items-center gap-2 px-2 -translate-y-50% ${text}`}>
							{icon}
							{title ? <span className={`font-semibold ${text}`}>{title}</span> : null}
						</div>
					</div>
					<div className={`flex-1 border-b-2 border-r-2 border-t-2 rounded-br-1.5 rounded-tr-1.5 ${border}`} />
				</div>
			</div>
		</div>
	);
}
