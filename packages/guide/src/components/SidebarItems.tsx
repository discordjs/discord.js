import { Section } from './Section.jsx';

export function SidebarItems({ members }: { members: any }) {
	const categories = members.reduce((acc, member) => {
		if (acc[member.frontmatter.category]) {
			acc[member.frontmatter.category].push(member);
		} else {
			acc[member.frontmatter.category] = [member];
		}

		return acc;
	}, {});

	return Object.keys(categories).map((category, idx) => (
		<Section key={idx} title={category}>
			{categories[category].map((member, index) => (
				<a
					className={`dark:border-dark-100 border-light-800 focus:ring-width-2 focus:ring-blurple ml-5 flex flex-col border-l p-[5px] pl-6 outline-0 focus:rounded focus:border-0 focus:ring ${
						false
							? 'bg-blurple text-white'
							: 'dark:hover:bg-dark-200 dark:active:bg-dark-100 hover:bg-light-700 active:bg-light-800'
					}`}
					href={member.url}
					key={index}
					title={member.url}
				>
					<div className="flex flex-row place-items-center gap-2 lg:text-sm">
						<span className="truncate">{member.url}</span>
					</div>
				</a>
			))}
		</Section>
	));
}
