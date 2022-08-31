import type { ApiMethodJSON, ApiMethodSignatureJSON } from '@discordjs/api-extractor-utils';
import { ActionIcon, Badge, Box, createStyles, Group, MediaQuery, Stack, Title } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { FiLink } from 'react-icons/fi';
import { HyperlinkedText } from './HyperlinkedText.jsx';
import { InheritanceText } from './InheritanceText.jsx';
import { ParameterTable } from './ParameterTable.jsx';
import { TSDoc } from './tsdoc/TSDoc.jsx';

const useStyles = createStyles((theme) => ({
	outer: {
		display: 'flex',
		alignItems: 'center',
		gap: 16,

		[theme.fn.smallerThan('sm')]: {
			flexDirection: 'column',
			alignItems: 'unset',
		},
	},
}));

function getShorthandName(data: ApiMethodJSON | ApiMethodSignatureJSON) {
	return `${data.name}${data.optional ? '?' : ''}(${data.parameters.reduce((prev, cur, index) => {
		if (index === 0) {
			return `${prev}${cur.isOptional ? `${cur.name}?` : cur.name}`;
		}

		return `${prev}, ${cur.isOptional ? `${cur.name}?` : cur.name}`;
	}, '')})`;
}

export function MethodItem({ data }: { data: ApiMethodJSON | ApiMethodSignatureJSON }) {
	const { classes } = useStyles();
	const matches = useMediaQuery('(max-width: 768px)');
	const method = data as ApiMethodJSON;
	const key = `${data.name}${data.overloadIndex && data.overloadIndex > 1 ? `:${data.overloadIndex}` : ''}`;

	return (
		<Stack id={key} className="scroll-mt-30" spacing="xs">
			<Group>
				<Stack>
					<Box className={classes.outer} ml={matches ? 0 : -45}>
						<MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
							<ActionIcon component="a" href={`#${key}`} variant="transparent" color="dark">
								<FiLink size={20} />
							</ActionIcon>
						</MediaQuery>
						{data.deprecated ||
						(data.kind === 'Method' && method.protected) ||
						(data.kind === 'Method' && method.static) ? (
							<Group spacing={10} noWrap>
								{data.deprecated ? (
									<Badge variant="filled" color="red">
										Deprecated
									</Badge>
								) : null}
								{data.kind === 'Method' && method.protected ? <Badge variant="filled">Protected</Badge> : null}
								{data.kind === 'Method' && method.static ? <Badge variant="filled">Static</Badge> : null}
							</Group>
						) : null}
						<Group spacing={10}>
							<Title sx={{ wordBreak: 'break-all' }} order={4} className="font-mono">{`${getShorthandName(
								data,
							)}`}</Title>
							<Title order={4}>:</Title>
							<Title sx={{ wordBreak: 'break-all' }} order={4} className="font-mono">
								<HyperlinkedText tokens={data.returnTypeTokens} />
							</Title>
						</Group>
					</Box>
				</Stack>
			</Group>
			<Group sx={{ display: data.summary || data.parameters.length ? 'block' : 'none' }} mb="lg">
				<Stack>
					{data.deprecated ? <TSDoc node={data.deprecated} /> : null}
					{data.summary ? <TSDoc node={data.summary} /> : null}
					{data.remarks ? <TSDoc node={data.remarks} /> : null}
					{data.comment ? <TSDoc node={data.comment} /> : null}
					{data.parameters.length ? <ParameterTable data={data.parameters} /> : null}
					{data.inheritanceData ? <InheritanceText data={data.inheritanceData} /> : null}
				</Stack>
			</Group>
		</Stack>
	);
}
