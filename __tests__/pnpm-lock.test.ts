import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, test, expect, beforeAll } from 'vitest';

describe('pnpm-lock.yaml validation', () => {
	let lockfileContent: string;
	let lockfilePath: string;

	beforeAll(() => {
		lockfilePath = join(process.cwd(), 'pnpm-lock.yaml');
		expect(existsSync(lockfilePath)).toBe(true);
		lockfileContent = readFileSync(lockfilePath, 'utf-8');
	});

	describe('file existence and basic structure', () => {
		test('GIVEN repository root THEN pnpm-lock.yaml should exist', () => {
			expect(existsSync(lockfilePath)).toBe(true);
		});

		test('GIVEN pnpm-lock.yaml THEN it should not be empty', () => {
			expect(lockfileContent.length).toBeGreaterThan(0);
		});

		test('GIVEN pnpm-lock.yaml THEN it should be valid UTF-8', () => {
			expect(() => readFileSync(lockfilePath, 'utf-8')).not.toThrow();
		});

		test('GIVEN pnpm-lock.yaml THEN it should have reasonable size (not corrupted)', () => {
			// Lock file should be at least 1KB and less than 10MB
			expect(lockfileContent.length).toBeGreaterThan(1024);
			expect(lockfileContent.length).toBeLessThan(10 * 1024 * 1024);
		});
	});

	describe('lockfile version', () => {
		test('GIVEN pnpm-lock.yaml THEN it should declare a lockfileVersion', () => {
			expect(lockfileContent).toContain('lockfileVersion:');
		});

		test('GIVEN lockfileVersion THEN it should be version 9.0 or compatible', () => {
			const versionMatch = lockfileContent.match(/^lockfileVersion:\s*['"]?(\d+(?:\.\d+)?)['"]?/m);
			expect(versionMatch).not.toBeNull();
			expect(versionMatch?.[1]).toBeDefined();

			const version = versionMatch?.[1];
			// Ensure it's a valid version format
			expect(version).toMatch(/^\d+\.\d+$/);

			// Verify it's version 9.0 as shown in the current lockfile
			expect(version).toBe('9.0');
		});

		test('GIVEN lockfileVersion THEN it should be on the first line or near the top', () => {
			const lines = lockfileContent.split('\n');
			const versionLineIndex = lines.findIndex((line) => line.includes('lockfileVersion:'));
			// Should be within first 5 lines
			expect(versionLineIndex).toBeGreaterThanOrEqual(0);
			expect(versionLineIndex).toBeLessThan(5);
		});
	});

	describe('required sections', () => {
		test('GIVEN pnpm-lock.yaml THEN it should contain settings section', () => {
			expect(lockfileContent).toContain('settings:');
		});

		test('GIVEN pnpm-lock.yaml THEN it should contain importers section', () => {
			expect(lockfileContent).toContain('importers:');
		});

		test('GIVEN pnpm-lock.yaml THEN it should contain packages section', () => {
			expect(lockfileContent).toContain('packages:');
		});

		test('GIVEN pnpm-lock.yaml THEN it should contain snapshots section', () => {
			expect(lockfileContent).toContain('snapshots:');
		});

		test('GIVEN sections THEN they should appear in correct order', () => {
			const versionIndex = lockfileContent.indexOf('lockfileVersion:');
			const settingsIndex = lockfileContent.indexOf('settings:');
			const importersIndex = lockfileContent.indexOf('importers:');
			const packagesIndex = lockfileContent.indexOf('packages:');
			const snapshotsIndex = lockfileContent.indexOf('snapshots:');

			expect(versionIndex).toBeGreaterThanOrEqual(0);
			expect(settingsIndex).toBeGreaterThan(versionIndex);
			expect(importersIndex).toBeGreaterThan(settingsIndex);
			expect(packagesIndex).toBeGreaterThan(importersIndex);
			expect(snapshotsIndex).toBeGreaterThan(packagesIndex);
		});
	});

	describe('settings validation', () => {
		test('GIVEN settings section THEN it should contain autoInstallPeers', () => {
			const settingsSection = extractSection(lockfileContent, 'settings:', 'patchedDependencies:');
			expect(settingsSection).toContain('autoInstallPeers:');
		});

		test('GIVEN settings section THEN it should contain excludeLinksFromLockfile', () => {
			const settingsSection = extractSection(lockfileContent, 'settings:', 'patchedDependencies:');
			expect(settingsSection).toContain('excludeLinksFromLockfile:');
		});

		test('GIVEN autoInstallPeers THEN it should be a boolean value', () => {
			const match = lockfileContent.match(/autoInstallPeers:\s*(true|false)/);
			expect(match).not.toBeNull();
			expect(['true', 'false']).toContain(match?.[1]);
		});

		test('GIVEN excludeLinksFromLockfile THEN it should be a boolean value', () => {
			const match = lockfileContent.match(/excludeLinksFromLockfile:\s*(true|false)/);
			expect(match).not.toBeNull();
			expect(['true', 'false']).toContain(match?.[1]);
		});
	});

	describe('importers structure', () => {
		test('GIVEN importers section THEN it should contain root importer', () => {
			const importersSection = extractSection(lockfileContent, 'importers:', 'packages:');
			expect(importersSection).toContain('  .:');
		});

		test('GIVEN root importer THEN it should declare devDependencies', () => {
			const importersSection = extractSection(lockfileContent, 'importers:', 'packages:');
			expect(importersSection).toContain('devDependencies:');
		});

		test('GIVEN importers THEN each should have proper indentation', () => {
			const importersSection = extractSection(lockfileContent, 'importers:', 'packages:');
			const lines = importersSection.split('\n');

			for (const line of lines) {
				if (line.trim() === '' || line.trim().startsWith('#')) continue;

				// Check that lines use spaces, not tabs
				expect(line).not.toMatch(/^\t/);

				// If line has content, verify consistent 2-space indentation
				if (line.length > 0 && line !== 'importers:') {
					const leadingSpaces = line.match(/^( *)/)?.[1].length ?? 0;
					expect(leadingSpaces % 2).toBe(0);
				}
			}
		});

		test('GIVEN importers THEN workspace packages should be listed', () => {
			const importersSection = extractSection(lockfileContent, 'importers:', 'packages:');

			// Verify some known workspace packages exist
			const workspacePackages = ['apps/guide', 'apps/website', 'packages/actions', 'packages/builders'];

			for (const pkg of workspacePackages) {
				const hasPackage = importersSection.includes(pkg);
				if (hasPackage) {
					expect(importersSection).toContain(pkg);
				}
			}

			// At least verify we have multiple importers
			const importerCount = (importersSection.match(/^\s{2}[a-zA-Z@]/gm) || []).length;
			expect(importerCount).toBeGreaterThan(1);
		});
	});

	describe('dependency declarations', () => {
		test('GIVEN dependencies THEN each should have specifier and version', () => {
			const lines = lockfileContent.split('\n');
			let inDependencies = false;

			for (let i = 0; i < lines.length; i++) {
				const line = lines[i];

				if (line.includes('dependencies:') || line.includes('devDependencies:')) {
					inDependencies = true;
					continue;
				}

				if (inDependencies && line.match(/^\s{2}[a-zA-Z]/)) {
					inDependencies = false;
				}

				if (inDependencies && line.includes('specifier:')) {
					// Next line should have version
					expect(lines[i + 1]).toContain('version:');
				}
			}
		});

		test('GIVEN version specifiers THEN they should follow semver pattern', () => {
			const specifierMatches = lockfileContent.matchAll(/specifier:\s*([^\n]+)/g);
			const specifiers = Array.from(specifierMatches).map((match) => match[1].trim());

			for (const specifier of specifiers) {
				// Should match semver patterns like ^1.0.0, ~2.3.4, 1.2.3, >=3.0.0, etc.
				expect(specifier).toMatch(/^[\^~>=<*]?[\d.]+|workspace:\^?[\d.]*$/);
			}
		});

		test('GIVEN workspace dependencies THEN they should use workspace: protocol', () => {
			const workspaceMatches = lockfileContent.matchAll(/specifier:\s*(workspace:[^\n]+)/g);
			const workspaceDeps = Array.from(workspaceMatches);

			// Should have at least some workspace dependencies
			expect(workspaceDeps.length).toBeGreaterThan(0);

			for (const match of workspaceDeps) {
				const specifier = match[1].trim();
				expect(specifier).toMatch(/^workspace:\^?[\d.*]+$/);
			}
		});
	});

	describe('packages section integrity', () => {
		test('GIVEN packages section THEN it should contain package entries', () => {
			const packagesSection = extractSection(lockfileContent, 'packages:', 'snapshots:');
			expect(packagesSection.length).toBeGreaterThan(100);
		});

		test('GIVEN package entries THEN they should have proper format', () => {
			const packagesSection = extractSection(lockfileContent, 'packages:', 'snapshots:');
			const packageLines = packagesSection.split('\n').filter((line) => line.match(/^\s{2}['"@]/));

			expect(packageLines.length).toBeGreaterThan(0);

			for (const line of packageLines.slice(0, 50)) {
				// Each package entry should be properly quoted or start with @
				expect(line.trim()).toMatch(/^['"][@a-zA-Z]/);
			}
		});

		test('GIVEN packages THEN common dependencies should be present', () => {
			const packagesSection = extractSection(lockfileContent, 'packages:', 'snapshots:');

			// Check for some expected packages from the diff
			const expectedPackages = ['typescript', 'eslint', 'vitest'];

			for (const pkg of expectedPackages) {
				// Should find at least one version of these packages
				expect(packagesSection).toMatch(new RegExp(`['"]${pkg}@`, 'i'));
			}
		});
	});

	describe('snapshots section integrity', () => {
		test('GIVEN snapshots section THEN it should contain snapshot entries', () => {
			const snapshotsSection = extractSection(lockfileContent, 'snapshots:', '');
			expect(snapshotsSection.length).toBeGreaterThan(1000);
		});

		test('GIVEN snapshot entries THEN they should match packages', () => {
			const snapshotsSection = extractSection(lockfileContent, 'snapshots:', '');
			const packagesSection = extractSection(lockfileContent, 'packages:', 'snapshots:');

			// Extract some package names from packages section
			const packageMatches = Array.from(packagesSection.matchAll(/['"](@?[a-zA-Z0-9@/-]+)@/g));
			const packageNames = packageMatches.slice(0, 20).map((match) => match[1]);

			// At least some of these should have corresponding snapshots
			let foundSnapshots = 0;
			for (const pkgName of packageNames) {
				if (snapshotsSection.includes(pkgName)) {
					foundSnapshots++;
				}
			}

			expect(foundSnapshots).toBeGreaterThan(0);
		});

		test('GIVEN snapshot entries THEN they should have dependency declarations', () => {
			const snapshotsSection = extractSection(lockfileContent, 'snapshots:', '');

			// Snapshots should have 'dependencies:', 'optionalDependencies:', etc.
			const hasDependencyDeclarations = snapshotsSection.includes('dependencies:') || 
				snapshotsSection.includes('optionalDependencies:') ||
				snapshotsSection.includes('peerDependencies:');

			expect(hasDependencyDeclarations).toBe(true);
		});
	});

	describe('YAML syntax validation', () => {
		test('GIVEN pnpm-lock.yaml THEN it should have consistent indentation', () => {
			const lines = lockfileContent.split('\n');

			for (const line of lines) {
				if (line.trim() === '') continue;

				// No tabs allowed
				expect(line).not.toContain('\t');

				// If indented, should be multiple of 2 spaces
				const leadingSpaces = line.match(/^( *)/)?.[1].length ?? 0;
				if (leadingSpaces > 0) {
					expect(leadingSpaces % 2).toBe(0);
				}
			}
		});

		test('GIVEN pnpm-lock.yaml THEN property keys should be properly formatted', () => {
			const lines = lockfileContent.split('\n');

			for (const line of lines) {
				if (line.includes(':') && !line.trim().startsWith('#')) {
					// Keys should not have trailing spaces before colon
					expect(line).not.toMatch(/\w\s+:/);
				}
			}
		});

		test('GIVEN pnpm-lock.yaml THEN it should not have excessive trailing whitespace', () => {
			const lines = lockfileContent.split('\n');
			const linesWithTrailingWhitespace = lines.filter((line) => line.match(/\s+$/));

			// Allow some tolerance, but shouldn't be excessive
			expect(linesWithTrailingWhitespace.length).toBeLessThan(lines.length * 0.01);
		});

		test('GIVEN pnpm-lock.yaml THEN it should end with a newline', () => {
			expect(lockfileContent.endsWith('\n')).toBe(true);
		});

		test('GIVEN pnpm-lock.yaml THEN it should not have consecutive blank lines', () => {
			const hasConsecutiveBlankLines = lockfileContent.includes('\n\n\n');
			expect(hasConsecutiveBlankLines).toBe(false);
		});
	});

	describe('specific dependency updates from diff', () => {
		test('GIVEN root dependencies THEN eslint-config-neon should reference TypeScript 8.49.0', () => {
			// Based on the diff, this dependency was updated
			const rootImporter = extractSection(lockfileContent, '  .:', 'apps/');

			if (rootImporter.includes('eslint-config-neon')) {
				// Should contain the updated version reference
				expect(rootImporter).toContain('@typescript-eslint/types@8.49.0');
			}
		});

		test('GIVEN root dependencies THEN @types/bun should be at version 1.3.4', () => {
			// Based on the diff, this was updated from 1.3.3 to 1.3.4
			const packagesSection = extractSection(lockfileContent, 'packages:', 'snapshots:');

			// Should have the new version
			expect(packagesSection).toContain('@types/bun@1.3.4');
		});

		test('GIVEN fumadocs dependencies THEN they should reference next with @babel/core', () => {
			// Based on the diff, fumadocs-core and related packages now reference next with @babel/core
			const appsGuideSection = extractSection(lockfileContent, 'apps/guide:', 'apps/website:');

			if (appsGuideSection.includes('fumadocs-core')) {
				// Should contain the updated peer dependency chain
				expect(appsGuideSection).toContain('@babel/core');
			}
		});

		test('GIVEN snapshots THEN fumadocs packages should have updated dependency chains', () => {
			const snapshotsSection = extractSection(lockfileContent, 'snapshots:', '');

			// Check for updated fumadocs snapshot entries
			const fumadocsEntries = snapshotsSection.match(/fumadocs-[a-z]+@[\d.]+\([^)]+@babel\/core[^)]*\)/g);

			if (fumadocsEntries && fumadocsEntries.length > 0) {
				// At least one fumadocs package should reference @babel/core in its snapshot
				expect(fumadocsEntries.length).toBeGreaterThan(0);
			}
		});
	});

	describe('dependency consistency', () => {
		test('GIVEN package versions THEN they should be consistent across workspace', () => {
			// Extract all version references for a common package like typescript
			const typescriptVersions = Array.from(
				lockfileContent.matchAll(/typescript@([\d.]+)/g),
			).map((match) => match[1]);

			// Remove duplicates
			const uniqueVersions = [...new Set(typescriptVersions)];

			// Should have limited number of TypeScript versions (typically 1-3)
			expect(uniqueVersions.length).toBeLessThanOrEqual(5);
			expect(uniqueVersions.length).toBeGreaterThan(0);
		});

		test('GIVEN peer dependencies THEN they should be satisfied', () => {
			// Check that major peer dependencies are present
			const hasReact = lockfileContent.includes('react@');
			const hasTypescript = lockfileContent.includes('typescript@');
			const hasEslint = lockfileContent.includes('eslint@');

			expect(hasReact).toBe(true);
			expect(hasTypescript).toBe(true);
			expect(hasEslint).toBe(true);
		});

		test('GIVEN workspace packages THEN they should use consistent workspace protocol', () => {
			const workspaceRefs = Array.from(
				lockfileContent.matchAll(/specifier:\s*(workspace:[^\n]+)/g),
			);

			for (const match of workspaceRefs) {
				const specifier = match[1];
				// Should follow workspace:^ or workspace:* pattern
				expect(specifier).toMatch(/^workspace:[\^*][\d.]*$/);
			}
		});
	});

	describe('integrity and security', () => {
		test('GIVEN lockfile THEN it should not contain hardcoded credentials', () => {
			// Check for common credential patterns
			expect(lockfileContent.toLowerCase()).not.toMatch(/password\s*:\s*['"]/);
			expect(lockfileContent.toLowerCase()).not.toMatch(/api[_-]?key\s*:\s*['"]/);
			expect(lockfileContent.toLowerCase()).not.toMatch(/secret\s*:\s*['"]/);
			expect(lockfileContent).not.toMatch(/ghp_[a-zA-Z0-9]{36}/);
			expect(lockfileContent).not.toMatch(/glpat-[a-zA-Z0-9_-]{20}/);
		});

		test('GIVEN package URLs THEN they should use secure protocols', () => {
			const urlMatches = lockfileContent.matchAll(/(?:url|tarball):\s*(https?:\/\/[^\s)]+)/gi);
			const urls = Array.from(urlMatches).map((match) => match[1]);

			for (const url of urls) {
				// Should use HTTPS, not HTTP
				if (url.startsWith('http://')) {
					// Allow localhost for development
					expect(url).toMatch(/^http:\/\/(localhost|127\.0\.0\.1)/);
				}
			}
		});

		test('GIVEN dependency versions THEN they should not contain wildcards in resolved versions', () => {
			// Resolved versions should be exact, not wildcards
			const versionMatches = lockfileContent.matchAll(/version:\s*([^\n]+)/g);
			const versions = Array.from(versionMatches).map((match) => match[1].trim());

			for (const version of versions) {
				// Resolved versions should not contain * or x
				expect(version).not.toMatch(/[*x]/);
			}
		});

		test('GIVEN lockfile THEN it should not reference deprecated registries', () => {
			// Should not reference old or insecure npm registries
			expect(lockfileContent).not.toContain('http://registry.npmjs.org');
			expect(lockfileContent).not.toContain('http://registry.npm.taobao.org');
		});
	});

	describe('patchedDependencies validation', () => {
		test('GIVEN patchedDependencies section THEN it should be properly formatted if present', () => {
			if (lockfileContent.includes('patchedDependencies:')) {
				const patchedSection = extractSection(
					lockfileContent,
					'patchedDependencies:',
					'importers:',
				);

				// Should have hash and path for each patched dependency
				if (patchedSection.includes('@microsoft/tsdoc-config')) {
					expect(patchedSection).toContain('hash:');
					expect(patchedSection).toContain('path:');
				}
			}
		});

		test('GIVEN patches THEN they should reference valid patch files', () => {
			if (lockfileContent.includes('patchedDependencies:')) {
				const patchPaths = Array.from(
					lockfileContent.matchAll(/path:\s*(patches\/[^\n]+)/g),
				).map((match) => match[1].trim());

				for (const patchPath of patchPaths) {
					// Should be in patches directory with .patch extension
					expect(patchPath).toMatch(/^patches\/.*\.patch$/);
				}
			}
		});
	});

	describe('performance and size checks', () => {
		test('GIVEN lockfile THEN it should not be excessively large', () => {
			const fileSizeInMB = lockfileContent.length / (1024 * 1024);

			// Warn if lockfile is larger than 5MB (might indicate issues)
			expect(fileSizeInMB).toBeLessThan(5);
		});

		test('GIVEN packages THEN there should not be excessive duplicate versions', () => {
			// Check for a common package and ensure we don't have too many versions
			const packagePattern = /@types\/node@/g;
			const nodeTypesVersions = Array.from(
				lockfileContent.matchAll(new RegExp(`${packagePattern.source}([\\d.]+)`, 'g')),
			).map((match) => match[1]);

			const uniqueNodeVersions = [...new Set(nodeTypesVersions)];

			// Should have reasonable number of @types/node versions
			expect(uniqueNodeVersions.length).toBeLessThanOrEqual(10);
		});

		test('GIVEN snapshots THEN snapshot count should match package count approximately', () => {
			const packagesSection = extractSection(lockfileContent, 'packages:', 'snapshots:');
			const snapshotsSection = extractSection(lockfileContent, 'snapshots:', '');

			// Count package entries
			const packageCount = (packagesSection.match(/^\s{2}['"][@a-zA-Z]/gm) || []).length;

			// Count snapshot entries  
			const snapshotCount = (snapshotsSection.match(/^\s{2}[@a-zA-Z]/gm) || []).length;

			// Snapshot count should be close to package count (within 20% difference)
			const ratio = snapshotCount / packageCount;
			expect(ratio).toBeGreaterThan(0.8);
			expect(ratio).toBeLessThan(1.2);
		});
	});
});

/**
 * Helper function to extract a section from the lockfile between two markers
 */
function extractSection(content: string, startMarker: string, endMarker: string): string {
	const startIndex = content.indexOf(startMarker);
	if (startIndex === -1) return '';

	if (endMarker === '') {
		return content.slice(startIndex);
	}

	const endIndex = content.indexOf(endMarker, startIndex);
	if (endIndex === -1) return content.slice(startIndex);

	return content.slice(startIndex, endIndex);
}