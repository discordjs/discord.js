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
				<div className="relative top-6 mx-auto max-w-7xl gap-6 lg:flex lg:max-w-full">
					<div className="lg:top-23 lg:sticky lg:h-[calc(100vh_-_100px)]">
						<Nav />
					</div>

					<div className="min-w-xs mx-auto w-full max-w-5xl pb-10">
						{children}
						<Footer />
					</div>
				</div>
			</main>
		</Providers>
	);
}
