import { VscPackage } from 'react-icons/vsc';
import { generateIcon } from '~/util/icon';
import type { getMembers } from '~/util/parse.server';

export interface ItemListProps {
	packageName: string;
	data: {
		members: ReturnType<typeof getMembers>;
	};
}

export function ItemSidebar({ packageName, data }: ItemListProps) {
	return (
		<div className="flex flex-col px-7">
			<div>
				<h1 className="px-2 font-mono flex items-center content-center">
					<VscPackage className="px-1" />
					{`${packageName}`}
				</h1>
			</div>
			{data.members.map((member, i) => (
				<div key={i} className="mb-1">
					<a
						className="flex content-center items-center align-center font-mono no-underline break-all color-blue-500"
						href={member.path}
					>
						{generateIcon(member.kind, 'px-1')}
						{member.name}
					</a>
				</div>
			))}
		</div>
	);
}
