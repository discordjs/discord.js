import Head from 'next/head';
import Link from 'next/link';

export default function FourOhFourPage() {
	return (
		<>
			<Head>
				<title key="title">discord.js | 404</title>
				<meta key="og_title" property="og:title" content="discord.js | 404" />
			</Head>
			<div className="mx-auto flex h-full max-w-lg flex-col place-content-center place-items-center gap-8 py-16 px-8 lg:py-0 lg:px-6">
				<h1 className="text-[9rem] font-black leading-none md:text-[12rem]">404</h1>
				<h2 className="text-[2rem] md:text-[3rem]">Not found.</h2>
				<Link href="/docs/packages" prefetch={false}>
					<a className="bg-blurple flex h-11 transform-gpu cursor-pointer select-none appearance-none place-items-center rounded border-0 px-6 text-base font-semibold leading-none text-white no-underline active:translate-y-px">
						Take me back
					</a>
				</Link>
			</div>
		</>
	);
}
