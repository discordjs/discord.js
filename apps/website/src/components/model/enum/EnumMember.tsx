import type { ApiEnumMember } from '@microsoft/api-extractor-model';
import { Anchor } from '../../Anchor';
import { NameText } from '../../NameText';
import { SignatureText } from '../../SignatureText';
import { TSDoc } from '../../documentation/tsdoc/TSDoc';

export function EnumMember({ member }: { member: ApiEnumMember }) {
	return (
		<div className="scroll-mt-30 flex flex-col" id={member.displayName}>
			<div className="md:-ml-8.5 flex flex-col gap-2 md:flex-row md:place-items-center">
				<Anchor href={`#${member.displayName}`} />
				<NameText name={member.name} />
				{member.initializerExcerpt ? (
					<SignatureText excerpt={member.initializerExcerpt} model={member.getAssociatedModel()!} />
				) : null}
			</div>
			{member.tsdocComment ? <TSDoc item={member} tsdoc={member.tsdocComment.summarySection} /> : null}
		</div>
	);
}
