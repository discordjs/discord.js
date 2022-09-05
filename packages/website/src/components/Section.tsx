import { Collapse, Box } from '@mantine/core';
import { Button } from 'ariakit/button';
import { useState, useEffect, type PropsWithChildren } from 'react';
import { VscChevronDown } from 'react-icons/vsc';

export function Section({
	title,
	icon,
	padded = false,
	dense = false,
	defaultClosed = false,
	children,
}: PropsWithChildren<{
	defaultClosed?: boolean;
	dense?: boolean;
	icon?: JSX.Element;
	padded?: boolean;
	title: string;
}>) {
	const [opened, setOpened] = useState(!defaultClosed);

	useEffect(() => {
		setOpened(!defaultClosed);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div>
			<Button
				className="bg-light-600 hover:bg-light-700 active:bg-light-800 dark:bg-dark-600 dark:hover:bg-dark-500 dark:active:bg-dark-400 rounded p-3"
				onClick={() => setOpened((isOpen) => !isOpen)}
			>
				<div className="flex flex-row place-content-between place-items-center">
					<div className="flex flex-row place-items-center gap-3">
						{icon ?? null}
						<span className="font-semibold">{title}</span>
					</div>
					<VscChevronDown
						className={`transform transition duration-150 ease-in-out ${opened ? 'rotate-180' : 'rotate-0'}`}
						size={20}
					/>
				</div>
			</Button>
			<Collapse in={opened}>
				{padded ? (
					<Box py={20} px={dense ? 0 : 31} mx={dense ? 10 : 25}>
						{children}
					</Box>
				) : (
					children
				)}
			</Collapse>
		</div>
	);
}
