import { createStyles, Group, Text, Box } from '@mantine/core';
import { VscListSelection } from 'react-icons/vsc';
import type { ApiClassJSON, ApiInterfaceJSON } from '~/DocModel/ApiNodeJSONEncoder';

const useStyles = createStyles((theme) => ({
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	link: {
		...theme.fn.focusStyles(),
		display: 'block',
		textDecoration: 'none',
		color: theme.colorScheme === 'dark' ? theme.colors.dark![0] : theme.black,
		lineHeight: 1.2,
		fontSize: theme.fontSizes.sm,
		padding: theme.spacing.xs,
		paddingLeft: theme.spacing.md,
		marginLeft: 8,
		borderTopRightRadius: theme.radius.sm,
		borderBottomRightRadius: theme.radius.sm,
		borderLeft: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark![4] : theme.colors.gray![3]}`,

		'&:hover': {
			backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark![6] : theme.colors.gray![0],
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
	const { classes } = useStyles();

	const propertyItems = properties.map((prop) => (
		<Box<'a'> key={prop.name} href={`#${prop.name}`} component="a" className={classes.link}>
			<Group>
				<Text sx={{ textOverflow: 'ellipsis', overflow: 'hidden' }} className="line-clamp-1">
					{prop.name}
				</Text>
			</Group>
		</Box>
	));

	const methodItems = methods.map((member) => {
		const key = `${member.name}${member.overloadIndex && member.overloadIndex > 1 ? `:${member.overloadIndex}` : ''}`;

		return (
			<Box<'a'> key={key} href={`#${key}`} component="a" className={classes.link}>
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
	});

	return (
		<Box>
			<Group mb="md">
				<VscListSelection size={20} />
				<Text>Table of content</Text>
			</Group>
			{propertyItems.length ? (
				<>
					<Text>Properties</Text>
					{propertyItems}
				</>
			) : null}
			{methodItems.length ? (
				<>
					<Text>Methods</Text>
					{methodItems}
				</>
			) : null}
		</Box>
	);
}
