import { VscFlame } from '@react-icons/all-files/vsc/VscFlame';
import { VscInfo } from '@react-icons/all-files/vsc/VscInfo';
import { VscWarning } from '@react-icons/all-files/vsc/VscWarning';
import type { PropsWithChildren } from 'react';

interface IAlert {
	readonly title?: string | undefined;
	readonly type: 'danger' | 'info' | 'success' | 'warning';
}

function resolveType(type: IAlert['type']) {
	switch (type) {
		case 'danger': {
			return {
				text: 'text-red-500',
				border: 'border-red-500',
				icon: <VscWarning aria-hidden size={20} />,
			};
		}

		case 'info': {
			return {
				text: 'text-blue-500',
				border: 'border-blue-500',
				icon: <VscInfo aria-hidden size={20} />,
			};
		}

		case 'success': {
			return {
				text: 'text-green-500',
				border: 'border-green-500',
				icon: <VscFlame aria-hidden size={20} />,
			};
		}

		case 'warning': {
			return {
				text: 'text-yellow-500',
				border: 'border-yellow-500',
				icon: <VscWarning aria-hidden size={20} />,
			};
		}
	}
}

export async function Alert({ title, type, children }: PropsWithChildren<IAlert>) {
	const { text, border, icon } = resolveType(type);

	return (
		<div className="mb-4 mt-6" role="alert">
			<div className="relative flex">
				<div className="p-4">{children}</div>
				<div className="pointer-events-none absolute flex h-full w-full">
					<div className={`w-4 shrink-0 rounded-bl-md rounded-tl-md border-b-2 border-l-2 border-t-2 ${border}`} />
					<div className={`relative border-b-2 ${border}`}>
						<div className={`pointer-events-auto flex -translate-y-1/2 place-items-center gap-2 px-2 ${text}`}>
							{icon}
							{title ? <span className={`font-semibold ${text}`}>{title}</span> : null}
						</div>
					</div>
					<div className={`flex-1 rounded-br-md rounded-tr-md border-b-2 border-r-2 border-t-2 ${border}`} />
				</div>
			</div>
		</div>
	);
}
