export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body className="dark:bg-dark-800 bg-white">{children}</body>
		</html>
	);
}
