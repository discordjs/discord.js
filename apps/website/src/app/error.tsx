'use client';

export default function Error({ error }: { error: Error }) {
	console.error(error);

	return (
		<div className="mx-auto flex min-h-screen max-w-lg flex-col place-content-center place-items-center gap-8 py-16 px-8 lg:py-0 lg:px-6">
			<h1 className="text-[9rem] font-black leading-none md:text-[12rem]">500</h1>
			<h2 className="text-[2rem] md:text-[3rem]">Error.</h2>
		</div>
	);
}
