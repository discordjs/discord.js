export function PageButton({ url, title, direction }: { direction: 'next' | 'prev'; title: string; url: string }) {
	return (
		<a
			className="dark:bg-dark-400 dark:border-dark-100 dark:hover:bg-dark-300 dark:active:bg-dark-200 border-light-900 hover:bg-light-200 active:bg-light-300 focus:ring-blurple focus:ring-width-2 flex transform-gpu cursor-pointer select-none appearance-none flex-row flex-col place-items-center gap-2 rounded border bg-transparent py-3 px-4 text-base leading-none text-black no-underline outline-0 focus:ring active:translate-y-px dark:text-white"
			href={url}
		>
			<p className={`${direction === 'next' ? 'ml-auto' : 'mr-auto'} color-gray-500 text-sm`}>
				{direction === 'next' ? 'Next Page' : 'Previous Page'}
			</p>
			<h3 className="text-lg font-semibold">{title}</h3>
		</a>
	);
}
