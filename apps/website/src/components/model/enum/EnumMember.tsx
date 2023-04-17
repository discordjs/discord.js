import type { ApiEnumMember } from '@microsoft/api-extractor-model';
import { SignatureText } from '../../SignatureText';
import { TSDoc } from '../../documentation/tsdoc/TSDoc';
import { CodeHeading } from '~/components/CodeHeading';

export function EnumMember({ member }: { member: ApiEnumMember }) {
	const value = member.initializerExcerpt ? (
		<SignatureText excerpt={member.initializerExcerpt} model={member.getAssociatedModel()!} />
	) : null;

	return (
		<div className="flex flex-col scroll-mt-30" id={member.displayName}>
			<CodeHeading className="md:-ml-8.5" href={`#${member.displayName}`}>
				{member.name}
				<span>=</span>
				{value}
			</CodeHeading>
			{member.tsdocComment ? <TSDoc item={member} tsdoc={member.tsdocComment.summarySection} /> : null}
		</div>
	);
}
