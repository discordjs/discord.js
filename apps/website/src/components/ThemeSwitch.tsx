'use client';

import { VscColorMode } from '@react-icons/all-files/vsc/VscColorMode';
import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/Button';

export function ThemeSwitch() {
	const { resolvedTheme, setTheme } = useTheme();
	const toggleTheme = () => setTheme(resolvedTheme === 'light' ? 'dark' : 'light');

	return (
		<Button aria-label="Toggle theme" onPress={() => toggleTheme()} size="icon-sm" variant="filled">
			<VscColorMode aria-hidden data-slot="icon" size={18} />
		</Button>
	);
}

export const ThemeSwitchNoSRR = dynamic(async () => ThemeSwitch, {
	ssr: false,
});
