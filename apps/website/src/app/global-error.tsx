'use client';

import { Providers } from './providers';
import { inter } from '~/util/fonts';

export default function GlobalError({ error }: { error: Error }) {
	console.error(error);

	return (
		<html className={inter.variable} lang="en" suppressHydrationWarning>
			<body className="dark:bg-dark-800 bg-white">
				<Providers>
					<main className="mx-auto h-screen max-w-2xl">
						<div className="mx-auto flex h-screen max-w-lg flex-col place-content-center place-items-center gap-8 py-16 px-8 lg:py-0 lg:px-6">
							<h1 className="text-[9rem] font-black leading-none md:text-[12rem]">500</h1>
							<h2 className="text-[2rem] md:text-[3rem]">Error.</h2>
						</div>
					</main>
				</Providers>
			</body>
		</html>
	);
}
