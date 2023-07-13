import type { PropsWithChildren } from 'react';
import { Providers } from './providers';
import Footer from '~/components/Footer';
import Header from '~/components/Header';
import { Nav } from '~/components/Nav';

export default function Layout({ children }: PropsWithChildren) {
	return (
		<Providers>
			<main className="mx-auto max-w-7xl px-4 lg:max-w-full">
				<Header />
				<div className="relative top-6 mx-auto max-w-7xl gap-6 lg:max-w-full lg:flex">
					<div className="lg:sticky lg:top-23 lg:h-[calc(100vh_-_105px)]">
						<Nav />
					</div>

					<div className="mx-auto max-w-5xl min-w-xs w-full pb-10">
						{children}
						<Footer />
					</div>
				</div>
			</main>
		</Providers>
	);
}
