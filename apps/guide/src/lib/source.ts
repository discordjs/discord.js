import { loader } from 'fumadocs-core/source';
import { icons } from 'lucide-react';
import { createElement } from 'react';
import { docs } from '../../.source';

export const source = loader({
	icon(icon) {
		if (!icon) {
			return undefined;
		}

		if (icon in icons) {
			return createElement(icons[icon as keyof typeof icons]);
		}

		return undefined;
	},
	baseUrl: '/',
	source: docs.toFumadocsSource(),
});
