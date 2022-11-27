import '@unocss/reset/tailwind.css';
import '../styles/inter.css';
import '../styles/unocss.css';
import '../styles/cmdk.css';
import '../styles/main.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head />
			<body className="dark:bg-dark-800 bg-white">{children}</body>
		</html>
	);
}
