import type { HTMLAttributes } from 'react';

export function Banner({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
	return (
		<div className={`bg-blurple px-4 py-2 text-center text-sm text-white ${className}`} {...props}>
			You are reading the documentation for the <strong>next</strong> version of discord.js. Documentation for v13/v14+
			has been moved to{' '}
			<strong>
				<a href="https://old.discordjs.dev/#/docs" rel="external noopener noreferrer" target="_blank">
					old.discordjs.dev
				</a>
			</strong>
		</div>
	);
}
