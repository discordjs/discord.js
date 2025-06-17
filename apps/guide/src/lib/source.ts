import { loader } from 'fumadocs-core/source';
import { icons } from 'lucide-react';
import { createElement } from 'react';
import { docs } from '../../.source';

export const source = loader({
	icon(icon) {
		if (!icon) {
			return;
		}

		if (icon in icons) {
			return createElement(icons[icon as keyof typeof icons]);
		}

		
	},
	baseUrl: '/guide/',
	source: docs.toFumadocsSource(),
});
