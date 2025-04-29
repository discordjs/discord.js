import { loader } from 'fumadocs-core/source';
import { docs } from '../../.source';

export const source = loader({
	baseUrl: '/guide',
	source: docs.toFumadocsSource(),
});
