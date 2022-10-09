import { GITHUB_BASE_PAGES_PATH } from './constants.js';

export function generateGithubURL(pageURL: string) {
	return `${GITHUB_BASE_PAGES_PATH}${pageURL}.mdx`;
}
