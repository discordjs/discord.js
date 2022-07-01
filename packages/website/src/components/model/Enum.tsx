import { DocContainer } from '../DocContainer';
import type { DocEnum } from '~/DocModel/DocEnum';

export interface EnumProps {
	data: ReturnType<DocEnum['toJSON']>;
}

export function Enum({ data }: EnumProps) {
	return (
		<DocContainer name={data.name} kind={data.kind} excerpt={data.excerpt} summary={data.summary}>
			<>
				<h3>Members</h3>
				<ul>
					{data.members.map((member) => (
						<li key={member.name}>{member.name}</li>
					))}
				</ul>
			</>
		</DocContainer>
	);
}
