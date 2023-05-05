'use client';

import { Providers } from './providers';
import { inter } from '~/util/fonts';

export default function GlobalError({ error }: { error: Error }) {
	console.error(error);

	return (
		<html className={inter.variable} lang="en" suppressHydrationWarning>
			<body className="bg-light-600 dark:bg-dark-600 dark:text-light-900">
				<Providers>
					<main className="mx-auto max-w-2xl min-h-screen">
						<div className="mx-auto max-w-lg min-h-screen flex flex-col place-content-center place-items-center gap-8 px-8 py-16 lg:px-6 lg:py-0">
							<h1 className="text-[9rem] font-black leading-none md:text-[12rem]">500</h1>
							<h2 className="text-[2rem] md:text-[3rem]">Error.</h2>
						</div>
					</main>
				</Providers>
			</body>
		</html>
	);
}
