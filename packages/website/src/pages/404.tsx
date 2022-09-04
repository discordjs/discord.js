import Head from 'next/head';
import Link from 'next/link';

export default function FourOhFourPage() {
	return (
		<>
			<Head>
				<title key="title">discord.js | 404</title>
				<meta key="og_title" property="og:title" content="discord.js | 404" />
			</Head>
			<div className="flex flex-col place-items-center py-16 px-8 max-w-lg mx-auto gap-8 h-full place-content-center lg:py-0 lg:px-6">
				<h1 className="text-[9rem] leading-none font-black md:text-[12rem]">404</h1>
				<h2 className="text-[2rem] md:text-[3rem]">Not found.</h2>
				<Link href="/docs/packages" passHref prefetch={false}>
					<a className="flex place-items-center bg-blurple appearance-none no-underline select-none cursor-pointer h-11 px-6 rounded text-white leading-none text-base font-semibold border-0 transform-gpu active:translate-y-px">
						Take me back
					</a>
				</Link>
			</div>
		</>
	);
}
