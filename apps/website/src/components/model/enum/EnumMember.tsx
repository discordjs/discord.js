import type { ApiEnumMember } from '@microsoft/api-extractor-model';
import { Anchor } from '../../Anchor';
import { NameText } from '../../NameText';
import { SignatureText } from '../../SignatureText';
import { TSDoc } from '../../documentation/tsdoc/TSDoc';

export function EnumMember({ member }: { member: ApiEnumMember }) {
	return (
		<div className="flex flex-col scroll-mt-30" id={member.displayName}>
			<div className="flex flex-col gap-2 md:flex-row md:place-items-center md:-ml-8.5">
				<Anchor href={`#${member.displayName}`} />
				<NameText name={member.name} />
				<h4 className="font-bold">=</h4>
				{member.initializerExcerpt ? (
					<SignatureText excerpt={member.initializerExcerpt} model={member.getAssociatedModel()!} />
				) : null}
			</div>
			{member.tsdocComment ? <TSDoc item={member} tsdoc={member.tsdocComment.summarySection} /> : null}
		</div>
	);
}
