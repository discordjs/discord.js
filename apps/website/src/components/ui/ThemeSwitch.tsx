'use client';

import { VscColorMode } from '@react-icons/all-files/vsc/VscColorMode';
import { useTheme } from 'next-themes';
import { Button } from './Button';

export function ThemeSwitch() {
	const { resolvedTheme, setTheme } = useTheme();
	const toggleTheme = () => setTheme(resolvedTheme === 'light' ? 'dark' : 'light');

	return (
		<Button aria-label="Toggle theme" className="rounded-full" onPress={() => toggleTheme()}>
			<VscColorMode aria-hidden size={24} />
		</Button>
	);
}
