import Link from 'next/link';
import { FiMenu } from 'react-icons/fi';
import { VscPackage } from 'react-icons/vsc';
import type { getMembers } from '~/util/parse.server';

export interface ItemListProps {
	packageName: string;
	data: {
		members: ReturnType<typeof getMembers>;
	};

	selectedMember?: string | undefined;
}

function onMenuClick() {
	console.log('menu clicked');
	// Todo show/hide list
}

export function ItemSidebar({ packageName, data, selectedMember }: ItemListProps) {
	return (
		<div className="flex flex-col max-h-full min-w-[270px] lg:border-r-solid border-b-solid border-0.5 border-gray border-width-0.5">
			<div className=" border-b-solid border-0.5 border-gray border-width-0.5 py-2 sticky top-0">
				<h2 className="px-2 flex items-center m-0 dark:text-white">
					<VscPackage className="px-1" />
					{`${packageName}`}
				</h2>
				<button className="lg:hidden mr-2 bg-transparent border-none cursor-pointer" onClick={onMenuClick}>
					<FiMenu size={32} />
				</button>
			</div>
			<div className="hidden lg:block lg:min-h-screen overflow-y-scroll overflow-x-clip p-7 space-y-2">
				{data.members.map((member, i) => (
					<div key={i} className="mb-1">
						<div className="flex items-center align-center no-underline break-all text-blue-500 dark:text-blue-300">
							<Link href={member.path}>
								<a
									className={`no-underline m-0  ${
										selectedMember === member.name ? 'color-black font-semibold' : 'color-gray-600'
									}`}
								>
									{member.name}
								</a>
							</Link>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
