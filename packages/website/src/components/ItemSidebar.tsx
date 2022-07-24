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
		<div className="flex flex-col max-h-full min-w-[270px] lg:border-r-solid border-0.5 border-gray">
			<div className="border-b-0.5 border-gray py-2">
				<h2 className="flex gap-2 items-center m-0 px-2 dark:text-white">
					<VscPackage />
					{`${packageName}`}
				</h2>
				<button className="lg:hidden mr-2 bg-transparent border-none cursor-pointer" onClick={onMenuClick}>
					<FiMenu size={32} />
				</button>
			</div>
			<div className="hidden lg:block lg:min-h-full overflow-y-scroll overflow-x-clip p-7 space-y-2">
				{data.members.map((member, i) => (
					<div key={i} className="flex items-center no-underline break-all text-blue-500 dark:text-blue-300">
						<Link href={member.path}>
							<a
								className={`no-underline m-0 ${
									selectedMember === member.name
										? 'text-blue-500 dark:text-blue-300 font-semibold'
										: 'text-black dark:text-white hover:text-dark-100 dark:hover:text-gray-300 hover:font-semibold'
								}`}
							>
								{member.name}
							</a>
						</Link>
					</div>
				))}
			</div>
		</div>
	);
}
