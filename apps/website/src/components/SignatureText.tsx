import type { TokenDocumentation } from '@discordjs/api-extractor-utils';
import type { ApiModel, ExcerptToken } from '@microsoft/api-extractor-model';
import { HyperlinkedText } from './HyperlinkedText';
import { tokenize } from './documentation/util';

export function SignatureText({
	tokens,
	model,
	version,
}: {
	model: ApiModel;
	tokens: readonly ExcerptToken[];
	version: string;
}) {
	return (
		<h4 className="break-all font-mono text-lg font-bold">
			<HyperlinkedText tokens={tokenize(model, tokens, version)} />
		</h4>
	);
}
