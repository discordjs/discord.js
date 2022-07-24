import type { AppProps } from 'next/app';
import '@unocss/reset/normalize.css';
import '../styles/unocss.css';
import '../styles/main.css';
import { ItemSidebar } from '~/components/ItemSidebar';

export default function MyApp({ Component, pageProps }: AppProps) {
	return (
		<div className="flex flex-col lg:flex-row overflow-hidden max-w-full h-full max-h-full bg-white dark:bg-dark">
			<div className="w-full lg:max-w-1/4 lg:min-w-1/4">
				{/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */}
				{pageProps.packageName && pageProps.data ? (
					// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
					<ItemSidebar packageName={pageProps.packageName} data={pageProps.data} />
				) : null}
			</div>
			<div className="max-h-full grow overflow-auto">
				<Component {...pageProps} />
			</div>
		</div>
	);
}
