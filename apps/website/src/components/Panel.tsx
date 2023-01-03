export function Panel({ children }: { children: React.ReactNode }) {
	return (
		<>
			{children}
			<div className="border-light-900 dark:border-dark-100 -mx-8 border-t-2" />
		</>
	);
}
