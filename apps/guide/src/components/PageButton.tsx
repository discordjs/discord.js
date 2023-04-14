export function PageButton({ url, title, direction }: { direction: 'next' | 'prev'; title: string; url: string }) {
	return (
		<a
			className="flex flex-row flex-col transform-gpu cursor-pointer select-none appearance-none place-items-center gap-2 rounded bg-light-600 px-4 py-3 leading-none no-underline outline-0 active:translate-y-px active:bg-light-800 dark:bg-dark-600 hover:bg-light-700 focus:ring focus:ring-width-2 focus:ring-blurple dark:active:bg-dark-400 dark:hover:bg-dark-500"
			href={url}
		>
			<h3 className="text-md font-semibold">{title}</h3>
			<p className={`${direction === 'next' ? 'ml-auto' : 'mr-auto'} text-sm text-gray-600 dark:text-gray-400`}>
				{direction === 'next' ? 'Next Page' : 'Previous Page'}
			</p>
		</a>
	);
}
