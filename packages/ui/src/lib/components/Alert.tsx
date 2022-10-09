import type { PropsWithChildren } from 'react';
import { VscFlame, VscInfo, VscWarning } from 'react-icons/vsc';

export interface IAlert {
	title?: string | undefined;
	type: 'danger' | 'info' | 'success';
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
	}
}

export function Alert({ title, type, children }: PropsWithChildren<IAlert>) {
	const { text, border, icon } = resolveType(type);

	return (
		<div className="mt-6 mb-4">
			<div className="relative flex">
				<div className="p-4">{children}</div>
				<div className="pointer-events-none absolute flex h-full w-full">
					<div className={`rounded-tl-1.5 rounded-bl-1.5 w-4 shrink-0 border-t-2 border-b-2 border-l-2 ${border}`} />
					<div className={`relative border-b-2 ${border}`}>
						<div className={`-translate-y-50% pointer-events-auto flex place-items-center gap-2 px-2 ${text}`}>
							{icon}
							<span className={`font-semibold ${text}`}>{title}</span>
						</div>
					</div>
					<div className={`rounded-tr-1.5 rounded-br-1.5 flex-1 border-t-2 border-b-2 border-r-2 ${border}`} />
				</div>
			</div>
		</div>
	);
}
