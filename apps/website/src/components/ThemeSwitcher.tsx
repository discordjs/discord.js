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
			className="focus:ring-width-2 focus:ring-blurple flex h-6 w-6 transform-gpu cursor-pointer select-none appearance-none flex-row place-items-center rounded rounded-full border-0 bg-transparent p-0 text-sm font-semibold leading-none no-underline outline-0 focus:ring active:translate-y-px"
			onClick={() => toggleTheme()}
		>
			<VscColorMode size={24} />
		</Button>
	);
}
