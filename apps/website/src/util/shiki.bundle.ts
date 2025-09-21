/* Generate by @shikijs/codegen */
import type {
	DynamicImportLanguageRegistration,
	DynamicImportThemeRegistration,
	HighlighterGeneric,
} from 'shiki/types';
import { createSingletonShorthands, createdBundledHighlighter } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine-javascript.mjs';

type BundledLanguage = 'typescript' | 'ts' | 'javascript' | 'js' | 'shellscript' | 'bash' | 'sh' | 'shell' | 'zsh';
type BundledTheme = 'github-light' | 'github-dark-dimmed';
type Highlighter = HighlighterGeneric<BundledLanguage, BundledTheme>;

const bundledLanguages = {
	typescript: () => import('shiki/langs/typescript.mjs'),
	ts: () => import('shiki/langs/typescript.mjs'),
	javascript: () => import('shiki/langs/javascript.mjs'),
	js: () => import('shiki/langs/javascript.mjs'),
	shellscript: () => import('shiki/langs/shellscript.mjs'),
	bash: () => import('shiki/langs/shellscript.mjs'),
	sh: () => import('shiki/langs/shellscript.mjs'),
	shell: () => import('shiki/langs/shellscript.mjs'),
	zsh: () => import('shiki/langs/shellscript.mjs'),
} as Record<BundledLanguage, DynamicImportLanguageRegistration>;

const bundledThemes = {
	'github-light': () => import('shiki/themes/github-light.mjs'),
	'github-dark-dimmed': () => import('shiki/themes/github-dark-dimmed.mjs'),
} as Record<BundledTheme, DynamicImportThemeRegistration>;

const createHighlighter = /* @__PURE__ */ createdBundledHighlighter<BundledLanguage, BundledTheme>({
	langs: bundledLanguages,
	themes: bundledThemes,
	engine: () => createJavaScriptRegexEngine(),
});

const {
	codeToHtml,
	codeToHast,
	codeToTokensBase,
	codeToTokens,
	codeToTokensWithThemes,
	getSingletonHighlighter,
	getLastGrammarState,
} = /* @__PURE__ */ createSingletonShorthands<BundledLanguage, BundledTheme>(createHighlighter);

export {
	bundledLanguages,
	bundledThemes,
	codeToHast,
	codeToHtml,
	codeToTokens,
	codeToTokensBase,
	codeToTokensWithThemes,
	createHighlighter,
	getLastGrammarState,
	getSingletonHighlighter,
};
export type { BundledLanguage, BundledTheme, Highlighter };
