import type { ApiEnumMember } from '@microsoft/api-extractor-model';
import { Anchor } from '~/components/Anchor';
import { NameText } from '~/components/NameText';
import { SignatureText } from '~/components/SignatureText';
import { TSDoc } from '~/components/documentation/tsdoc/TSDoc';

export function EnumMember({ member }: { member: ApiEnumMember }) {
	return (
		<div className="flex flex-col">
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
