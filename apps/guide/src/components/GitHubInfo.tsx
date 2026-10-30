// https://github.com/fuma-nama/fumadocs/blob/dev/packages/ui/src/components/github-info.tsx
// https://github.com/fuma-nama/fumadocs/blob/dev/LICENSE

import { Star } from 'lucide-react';
import { type AnchorHTMLAttributes } from 'react';
import { twMerge as cn } from 'tailwind-merge';

async function getRepoStars(owner: string, repo: string, token?: string): Promise<{ stars: number } | null> {
	const endpoint = `https://api.github.com/repos/${owner}/${repo}`;
	const headers = new Headers({
		'Content-Type': 'application/json',
		'User-Agent': 'discordjs-guide',
	});

	if (token) headers.set('Authorization', `Bearer ${token}`);

	const response = await fetch(endpoint, {
		headers,
		next: {
			revalidate: 24 * 60 * 60,
		},
	});

	if (!response.ok) {
		const message = await response.text();
		console.warn(`Failed to fetch repository data (${response.status}):`, message);
		return null;
	}

	const data = await response.json();
	return { stars: data.stargazers_count };
}

export async function GithubInfo({
	repo,
	owner,
	token,
	...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
	readonly owner: string;
	readonly repo: string;
	readonly token?: string;
}) {
	const repoData = await getRepoStars(owner, repo, token);

	return (
		<a
			href={`https://github.com/${owner}/${repo}`}
			rel="noreferrer noopener"
			target="_blank"
			{...props}
			className={cn(
				'text-fd-foreground/80 hover:text-fd-accent-foreground hover:bg-fd-accent flex flex-col gap-1.5 rounded-lg p-2 text-sm transition-colors lg:flex-row lg:items-center',
				props.className,
			)}
		>
			<p className="flex items-center gap-2 truncate">
				<svg className="size-3.5" fill="currentColor" viewBox="0 0 24 24">
					<title>GitHub</title>
					<path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
				</svg>
				{owner}/{repo}
			</p>
			{repoData ? (
				<p className="text-fd-muted-foreground flex items-center gap-1 text-xs">
					<Star className="size-3" />
					{humanizeNumber(repoData.stars)}
				</p>
			) : null}
		</a>
	);
}

/**
 * Converts a number to a human-readable string with K suffix for thousands
 *
 * @example 1500 -> "1.5K", 1000000 -> "1000000"
 */
function humanizeNumber(num: number): string {
	if (num < 1_000) {
		return num.toString();
	}

	if (num < 100_000) {
		// For numbers between 1,000 and 99,999, show with one decimal (e.g., 1.5K)
		const value = (num / 1_000).toFixed(1);
		// Remove trailing .0 if present
		const formattedValue = value.endsWith('.0') ? value.slice(0, -2) : value;

		return `${formattedValue}K`;
	}

	if (num < 1_000_000) {
		// For numbers between 10,000 and 999,999, show as whole K (e.g., 10K, 999K)
		return `${Math.floor(num / 1_000)}K`;
	}

	// For 1,000,000 and above, just return the number
	return num.toString();
}
