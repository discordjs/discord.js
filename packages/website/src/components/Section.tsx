import { createStyles, UnstyledButton, Group, ThemeIcon, Collapse, Box, Text } from '@mantine/core';
import { type ReactNode, useState } from 'react';
import { VscChevronDown } from 'react-icons/vsc';

const useStyles = createStyles((theme, { opened }: { opened: boolean }) => ({
	control: {
		display: 'block',
		width: '100%',
		padding: `${theme.spacing.xs}px ${theme.spacing.xs}px`,
		color: theme.colorScheme === 'dark' ? theme.colors.dark![0] : theme.black,
		fontSize: theme.fontSizes.sm,

		'&:hover': {
			backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark![6] : theme.colors.gray![0],
			color: theme.colorScheme === 'dark' ? theme.white : theme.black,
		},
	},

	icon: {
		transition: 'transform 150ms ease',
		transform: opened ? 'rotate(180deg)' : 'rotate(0deg)',
	},
}));

export function Section({
	title,
	icon,
	padded = false,
	dense = false,
	defaultClosed = false,
	children,
}: {
	title: string;
	icon?: JSX.Element;
	padded?: boolean;
	dense?: boolean;
	defaultClosed?: boolean;
	children: ReactNode;
}) {
	const [opened, setOpened] = useState(!defaultClosed);
	const { classes } = useStyles({ opened });

	return (
		<Box className="break-all">
			<UnstyledButton className={classes.control} onClick={() => setOpened((o) => !o)}>
				<Group position="apart">
					<Group>
						{icon ? (
							<ThemeIcon variant="outline" size={30}>
								{icon}
							</ThemeIcon>
						) : null}
						<Text weight={600} size="md">
							{title}
						</Text>
					</Group>
					<VscChevronDown size={20} className={classes.icon} />
				</Group>
			</UnstyledButton>
			<Collapse in={opened}>
				{padded ? (
					<Box py={20} px={dense ? 0 : 31} mx={dense ? 10 : 25}>
						{children}
					</Box>
				) : (
					children
				)}
			</Collapse>
		</Box>
	);
}
