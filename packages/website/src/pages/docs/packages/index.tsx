import {
	Container,
	UnstyledButton,
	createStyles,
	Group,
	ThemeIcon,
	Text,
	Stack,
	Title,
	useMantineColorScheme,
} from '@mantine/core';
import Link from 'next/link';
import { VscArrowRight, VscPackage } from 'react-icons/vsc';
import { PACKAGES } from '~/util/packages';

const useStyles = createStyles((theme) => ({
	control: {
		padding: theme.spacing.xs,
		color: theme.colorScheme === 'dark' ? theme.colors.dark![0] : theme.black,
		borderRadius: theme.radius.xs,

		'&:hover': {
			backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark![6] : theme.colors.gray![0],
			color: theme.colorScheme === 'dark' ? theme.white : theme.black,
		},
	},
}));

export default function PackagesRoute() {
	const { classes } = useStyles();
	const { colorScheme } = useMantineColorScheme();

	return (
		<Container pt={128} size="xs">
			<Stack sx={{ flexGrow: 1 }}>
				<Title order={2} ml="xs">
					Select a package:
				</Title>
				{PACKAGES.map((pkg) => (
					<Link key={pkg} href={`/docs/packages/${pkg}`} passHref>
						<UnstyledButton className={classes.control} component="a">
							<Group position="apart">
								<Group>
									<ThemeIcon variant={colorScheme === 'dark' ? 'filled' : 'outline'} size={30}>
										<VscPackage size={20} />
									</ThemeIcon>
									<Text weight={600} size="md">
										{pkg}
									</Text>
								</Group>
								<VscArrowRight size={20} />
							</Group>
						</UnstyledButton>
					</Link>
				))}
			</Stack>
		</Container>
	);
}
