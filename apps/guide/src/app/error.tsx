'use client';

export default function Error({ error }: { error: Error }) {
	console.error(error);

	return (
		<div className="mx-auto flex h-full max-w-lg flex-col place-content-center place-items-center gap-8 px-8 py-16 lg:px-6 lg:py-0">
			<h1 className="text-[9rem] font-black leading-none md:text-[12rem]">500</h1>
			<h2 className="text-[2rem] md:text-[3rem]">Error.</h2>
		</div>
	);
}
