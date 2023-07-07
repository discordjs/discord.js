import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import Unocss from 'unocss/vite';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
	plugins: [dts(), react(), Unocss({ include: ['.storybook/preview.ts'], configFile: '../../unocss.config.ts' })],
	build: {
		lib: {
			entry: [
				'src/lib/index.ts',
				'src/lib/components/Alert.tsx',
				'src/lib/components/Section.tsx',
				'src/lib/components/discord/Message.tsx',
				'src/lib/components/discord/MessageAuthor.tsx',
				'src/lib/components/discord/MessageAuthorReply.tsx',
				'src/lib/components/discord/MessageBaseReply.tsx',
				'src/lib/components/discord/MessageEmbed.tsx',
				'src/lib/components/discord/MessageEmbedAuthor.tsx',
				'src/lib/components/discord/MessageEmbedField.tsx',
				'src/lib/components/discord/MessageEmbedFields.tsx',
				'src/lib/components/discord/MessageEmbedFooter.tsx',
				'src/lib/components/discord/MessageEmbedImage.tsx',
				'src/lib/components/discord/MessageEmbedThumbnail.tsx',
				'src/lib/components/discord/MessageEmbedTitle.tsx',
				'src/lib/components/discord/MessageInteraction.tsx',
				'src/lib/components/discord/MessageReply.tsx',
				'src/lib/components/discord/Messages.tsx',
			],
			formats: ['es'],
			name: 'ui',
		},
		rollupOptions: {
			external: [
				'react',
				'react-dom',
				'ariakit/disclosure',
				'@react-icons/all-files/vsc/VscFlame',
				'@react-icons/all-files/vsc/VscInfo',
				'@react-icons/all-files/vsc/VscWarning',
				'@react-icons/all-files/vsc/VscChevronDown',
				'@react-icons/all-files/fi/FiCheck',
			],
		},
	},
});
