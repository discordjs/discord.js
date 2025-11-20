'use client';

import { VscGithubInverted } from '@react-icons/all-files/vsc/VscGithubInverted';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { EntryPointSelect } from '@/components/EntrypointSelect';
import { PackageSelect } from '@/components/PackageSelect';
import { SearchButton } from '@/components/SearchButton';
import { ThemeSwitchNoSRR } from '@/components/ThemeSwitch';
import { VersionSelect } from '@/components/VersionSelect';
import { SidebarHeader as BasSidebarHeader } from '@/components/ui/Sidebar';
import { buttonStyles } from '@/styles/ui/button';
import { PACKAGES_WITH_ENTRY_POINTS } from '@/util/constants';

export function SidebarHeader() {
	const params = useParams<{
		packageName: string;
		version: string;
	}>();

	const hasEntryPoints = PACKAGES_WITH_ENTRY_POINTS.includes(params.packageName);

	const { data: entryPoints, isLoading: isLoadingEntryPoints } = useQuery({
		queryKey: ['entryPoints', params.packageName, params.version],
		queryFn: async () => {
			const response = await fetch(`/api/docs/entrypoints?packageName=${params.packageName}&version=${params.version}`);

			return response.json();
		},
	});

	const { data: versions, isLoading: isLoadingVersions } = useQuery({
		queryKey: ['versions', params.packageName],
		queryFn: async () => {
			const response = await fetch(`/api/docs/versions?packageName=${params.packageName}`);

			return response.json();
		},
	});

	return (
		<BasSidebarHeader className="bg-[#f3f3f4] p-4 dark:bg-[#121214]">
			<div className="flex flex-col gap-2">
				<div className="flex place-content-between place-items-center p-1">
					<Link
						className="text-xl font-bold"
						href={`/docs/packages/${params.packageName}/${params.version}${hasEntryPoints ? `/${entryPoints?.[0]?.entryPoint ?? ''}` : ''}`}
					>
						{params.packageName}
					</Link>
					<div className="flex place-items-center gap-2">
						<Link
							aria-label="GitHub"
							className={buttonStyles({ variant: 'filled', size: 'icon-sm' })}
							href="https://github.com/discordjs/discord.js"
							rel="external noopener noreferrer"
							target="_blank"
						>
							<VscGithubInverted aria-hidden data-slot="icon" size={18} />
						</Link>
						<ThemeSwitchNoSRR />
					</div>
				</div>
				<PackageSelect />
				{/* <h3 className="p-1 text-lg font-semibold">{version}</h3> */}
				<VersionSelect isLoading={isLoadingVersions} versions={versions ?? []} />
				{hasEntryPoints ? <EntryPointSelect entryPoints={entryPoints ?? []} isLoading={isLoadingEntryPoints} /> : null}
				<SearchButton />
			</div>
		</BasSidebarHeader>
	);
}
