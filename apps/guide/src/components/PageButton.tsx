export function PageButton({ url, title, direction }: { direction: 'next' | 'prev'; title: string; url: string }) {
	return (
		<a
			className="bg-light-600 hover:bg-light-700 active:bg-light-800 dark:bg-dark-600 dark:hover:bg-dark-500 dark:active:bg-dark-400 focus:ring-width-2 focus:ring-blurple flex transform-gpu cursor-pointer select-none appearance-none flex-row flex-col place-items-center gap-2 rounded px-4 py-3 leading-none no-underline outline-0 focus:ring active:translate-y-px"
			href={url}
		>
			<h3 className="text-md font-semibold">{title}</h3>
			<p className={`${direction === 'next' ? 'ml-auto' : 'mr-auto'} text-sm text-gray-600 dark:text-gray-400`}>
				{direction === 'next' ? 'Next Page' : 'Previous Page'}
			</p>
		</a>
	);
}
