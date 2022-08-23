import { createStyles, Group, Text, Box, Stack, ThemeIcon, useMantineColorScheme } from '@mantine/core';
import { useMemo } from 'react';
import { VscListSelection, VscSymbolMethod, VscSymbolProperty } from 'react-icons/vsc';
import type { ApiClassJSON, ApiInterfaceJSON } from '~/DocModel/ApiNodeJSONEncoder';

const useStyles = createStyles((theme) => ({
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	link: {
		...theme.fn.focusStyles(),
		display: 'block',
		textDecoration: 'none',
		color: theme.colorScheme === 'dark' ? theme.colors.dark![0] : theme.colors.gray![7],
		lineHeight: 1.2,
		fontSize: theme.fontSizes.sm,
		padding: theme.spacing.xs,
		paddingLeft: theme.spacing.md,
		marginLeft: 14,
		borderTopRightRadius: theme.radius.sm,
		borderBottomRightRadius: theme.radius.sm,
		borderLeft: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark![4] : theme.colors.gray![3]}`,
		fontWeight: 500,

		'&:hover': {
			backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark![6] : theme.colors.gray![0],
			color: theme.colorScheme === 'dark' ? theme.white : theme.black,
		},
	},
}));

export function TableOfContentItems({
	methods,
	properties,
}: {
	methods: ApiClassJSON['methods'] | ApiInterfaceJSON['methods'];
	properties: ApiClassJSON['properties'] | ApiInterfaceJSON['properties'];
}) {
	const { colorScheme } = useMantineColorScheme();
	const { classes } = useStyles();

	const propertyItems = useMemo(
		() =>
			properties.map((prop) => (
				<Box<'a'> key={prop.name} href={`#${prop.name}`} component="a" className={classes.link}>
					<Group>
						<Text sx={{ textOverflow: 'ellipsis', overflow: 'hidden' }} className="line-clamp-1">
							{prop.name}
						</Text>
					</Group>
				</Box>
			)),
		[properties],
	);

	const methodItems = useMemo(
		() =>
			methods.map((member) => {
				const key = `${member.name}${
					member.overloadIndex && member.overloadIndex > 1 ? `:${member.overloadIndex}` : ''
				}`;

				return (
					<Box<'a'> key={key} component="a" href={`#${key}`} className={classes.link}>
						<Group>
							<Text sx={{ textOverflow: 'ellipsis', overflow: 'hidden' }} className="line-clamp-1">
								{member.name}
							</Text>
							{member.overloadIndex && member.overloadIndex > 1 ? (
								<Text size="xs" color="dimmed">
									{member.overloadIndex}
								</Text>
							) : null}
						</Group>
					</Box>
				);
			}),
		[methods],
	);

	return (
		<Box sx={{ wordBreak: 'break-all' }} pb="xl">
			<Group spacing="xs" mt={6} mb="sm" ml={6}>
				<VscListSelection size={25} />
				<Text weight={600}>Table of contents</Text>
			</Group>
			<Stack spacing={0} mt={26} ml={4}>
				{propertyItems.length ? (
					<Box>
						<Group spacing="xs">
							<ThemeIcon variant={colorScheme === 'dark' ? 'filled' : 'outline'} radius="sm" size={30}>
								<VscSymbolProperty size={20} />
							</ThemeIcon>
							<Box p="sm" pl={0}>
								<Text weight={600} size="md">
									Properties
								</Text>
							</Box>
						</Group>
						{propertyItems}
					</Box>
				) : null}
				{methodItems.length ? (
					<Box>
						<Group spacing="xs">
							<ThemeIcon variant={colorScheme === 'dark' ? 'filled' : 'outline'} radius="sm" size={30}>
								<VscSymbolMethod size={20} />
							</ThemeIcon>
							<Box p="sm" pl={0}>
								<Text weight={600} size="md">
									Methods
								</Text>
							</Box>
						</Group>
						{methodItems}
					</Box>
				) : null}
			</Stack>
		</Box>
	);
}
