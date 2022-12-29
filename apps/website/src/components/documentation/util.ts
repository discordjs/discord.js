import { genToken } from '@discordjs/api-extractor-utils';
import type { ApiModel, ExcerptToken } from '@microsoft/api-extractor-model';

export function tokenize(model: ApiModel, tokens: ExcerptToken[]) {
	return tokens.map((token) => genToken(model, token, ' '));
}
