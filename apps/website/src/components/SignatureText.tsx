import type { ApiModel, Excerpt } from '@microsoft/api-extractor-model';
import { ExcerptText } from './ExcerptText';

export function SignatureText({ excerpt, model }: { readonly excerpt: Excerpt; readonly model: ApiModel }) {
	return (
		<h4 className="break-all text-lg font-bold font-mono">
			<ExcerptText excerpt={excerpt} model={model} />
		</h4>
	);
}
