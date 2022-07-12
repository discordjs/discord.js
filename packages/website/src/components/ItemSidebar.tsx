import { FiMenu } from 'react-icons/fi';
import { VscPackage } from 'react-icons/vsc';
import { generateIcon } from '~/util/icon';
import type { getMembers } from '~/util/parse.server';

export interface ItemListProps {
	packageName: string;
	data: {
		members: ReturnType<typeof getMembers>;
	};
}

function onMenuClick() {
	console.log('menu clicked');
	// Todo show/hide list
}

export function ItemSidebar({ packageName, data }: ItemListProps) {
	return (
		<div className="flex flex-col max-h-full min-w-[270px] lg:border-r-solid border-b-solid border-gray border-width-0.5">
			<div className="flex justify-between content-center items-center border-b-solid border-gray border-width-0.5 py-2">
				<h2 className="px-2 font-mono flex items-center content-center m-0">
					<VscPackage className="px-1" />
					{`${packageName}`}
				</h2>
				<button className="lg:hidden mr-2 bg-transparent border-none cursor-pointer" onClick={onMenuClick}>
					<FiMenu size={32} />
				</button>
			</div>
			<div className="hidden lg:block overflow-y-scroll overflow-x-clip p-7">
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
		</div>
	);
}
