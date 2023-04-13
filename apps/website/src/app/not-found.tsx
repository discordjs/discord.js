import Link from 'next/link';

export default function NotFound() {
	return (
		<div className="mx-auto max-w-lg min-h-screen flex flex-col place-content-center place-items-center gap-8 px-8 py-16 lg:px-6 lg:py-0">
			<h1 className="text-[9rem] font-black leading-none md:text-[12rem]">404</h1>
			<h2 className="text-[2rem] md:text-[3rem]">Not found.</h2>
			<Link
				className="h-11 flex flex-row transform-gpu cursor-pointer select-none appearance-none place-items-center border-0 rounded bg-blurple px-6 text-base font-semibold leading-none text-white no-underline outline-0 active:translate-y-px focus:ring focus:ring-width-2 focus:ring-white"
				href="/docs/packages"
			>
				Take me back
			</Link>
		</div>
	);
}
