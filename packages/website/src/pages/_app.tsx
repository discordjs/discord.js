import type { AppProps } from 'next/app';
import '@unocss/reset/normalize.css';
import '../styles/unocss.css';
import '../styles/main.css';

export default function MyApp({ Component, pageProps }: AppProps) {
	return <Component {...pageProps} />;
}
