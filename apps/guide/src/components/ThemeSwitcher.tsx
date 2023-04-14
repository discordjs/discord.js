'use client';

import { VscColorMode } from '@react-icons/all-files/vsc/VscColorMode';
import { Button } from 'ariakit/button';
import { useTheme } from 'next-themes';

export default function ThemeSwitcher() {
	const { resolvedTheme, setTheme } = useTheme();
	const toggleTheme = () => setTheme(resolvedTheme === 'light' ? 'dark' : 'light');

	return (
		<Button
			aria-label="Toggle theme"
			className="h-6 w-6 flex flex-row transform-gpu cursor-pointer select-none appearance-none place-items-center border-0 rounded rounded-full bg-transparent p-0 text-sm font-semibold leading-none no-underline outline-0 active:translate-y-px focus:ring focus:ring-width-2 focus:ring-blurple"
			onClick={() => toggleTheme()}
		>
			<VscColorMode size={24} />
		</Button>
	);
}
