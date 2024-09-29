import Link from 'next/link';

export default function NotFound() {
	return (
		<div className="mx-auto flex min-h-[calc(100vh_-_100px)] max-w-lg flex-col place-content-center place-items-center gap-8 px-8 py-16 lg:px-6 lg:py-0">
			<h1 className="text-[9rem] font-black leading-none md:text-[12rem]">404</h1>
			<h2 className="text-[2rem] md:text-[3rem]">Not found.</h2>
			<Link
				className="inline-flex rounded-md border border-transparent bg-blurple px-6 py-2 font-medium text-white"
				href="/docs"
			>
				Take me back
			</Link>
		</div>
	);
}
