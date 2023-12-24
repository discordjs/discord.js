import type { ApiPackage, Excerpt } from '@discordjs/api-extractor-model';
import { ExcerptText } from './ExcerptText';

export function SignatureText({ excerpt, apiPackage }: { readonly apiPackage: ApiPackage; readonly excerpt: Excerpt }) {
	return (
		<h4 className="break-all text-lg font-bold font-mono">
			<ExcerptText excerpt={excerpt} apiPackage={apiPackage} />
		</h4>
	);
}
