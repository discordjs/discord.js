import type { ApiModel, Excerpt } from '@microsoft/api-extractor-model';
import { ExcerptText } from './ExcerptText';

export function SignatureText({ excerpt, model }: { excerpt: Excerpt; model: ApiModel }) {
	return (
		<h4 className="break-all font-mono text-lg font-bold">
			<ExcerptText excerpt={excerpt} model={model} />
		</h4>
	);
}
