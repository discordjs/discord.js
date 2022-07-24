import { CodeListing, CodeListingSeparatorType } from '../CodeListing';
import { DocContainer } from '../DocContainer';
import { Section } from '../Section';
import type { DocEnum } from '~/DocModel/DocEnum';

export interface EnumProps {
	data: ReturnType<DocEnum['toJSON']>;
}

export function Enum({ data }: EnumProps) {
	return (
		<DocContainer name={data.name} kind={data.kind} excerpt={data.excerpt} summary={data.summary}>
			<Section title="Members" className="dark:text-white">
				<div className="flex flex-col gap-5">
					{data.members.map((member) => (
						<CodeListing
							key={member.name}
							name={member.name}
							separator={CodeListingSeparatorType.Value}
							typeTokens={member.initializerTokens}
							summary={member.summary}
						/>
					))}
				</div>
			</Section>
		</DocContainer>
	);
}
