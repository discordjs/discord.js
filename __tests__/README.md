# pnpm-lock.yaml Test Suite

## Overview

This directory contains comprehensive validation tests for the `pnpm-lock.yaml` lockfile, which was modified in the current branch.

## Files Created

- **`pnpm-lock.test.ts`**: Comprehensive test suite with 50+ test cases
- **`../tsconfig.test.json`**: TypeScript configuration for root-level tests

## Test Coverage

The test suite validates all aspects of the pnpm lockfile to ensure:

### 1. File Existence and Basic Structure (4 tests)
- File exists and is readable
- File is not empty
- Valid UTF-8 encoding
- Reasonable file size (not corrupted)

### 2. Lockfile Version (3 tests)
- Declares a lockfileVersion
- Version is 9.0 (current format)
- Version declaration is at the top of the file

### 3. Required Sections (5 tests)
- Contains settings section
- Contains importers section
- Contains packages section
- Contains snapshots section
- Sections appear in correct order

### 4. Settings Validation (4 tests)
- autoInstallPeers setting is present and boolean
- excludeLinksFromLockfile setting is present and boolean
- Settings are properly formatted

### 5. Importers Structure (4 tests)
- Root importer is present
- devDependencies are declared
- Proper indentation (2-space)
- Workspace packages are listed

### 6. Dependency Declarations (3 tests)
- Each dependency has specifier and version
- Version specifiers follow semver patterns
- Workspace dependencies use workspace: protocol

### 7. Packages Section Integrity (3 tests)
- Contains package entries
- Entries have proper format
- Common dependencies are present

### 8. Snapshots Section Integrity (3 tests)
- Contains snapshot entries
- Snapshots match packages
- Has dependency declarations

### 9. YAML Syntax Validation (5 tests)
- Consistent 2-space indentation
- Property keys properly formatted
- Minimal trailing whitespace
- Ends with newline
- No consecutive blank lines

### 10. Specific Dependency Updates from Git Diff (4 tests)
- eslint-config-neon references TypeScript 8.49.0
- @types/bun updated to version 1.3.4
- fumadocs dependencies reference next with @babel/core
- fumadocs snapshots have updated dependency chains

### 11. Dependency Consistency (3 tests)
- Package versions consistent across workspace
- Peer dependencies are satisfied
- Workspace protocol is consistent

### 12. Integrity and Security (4 tests)
- No hardcoded credentials
- Package URLs use secure protocols (HTTPS)
- No wildcards in resolved versions
- No deprecated registries

### 13. Patched Dependencies (2 tests)
- patchedDependencies section properly formatted
- Patch files reference valid paths

### 14. Performance and Size Checks (3 tests)
- File size is not excessive
- No excessive duplicate package versions
- Snapshot count matches package count

## Running the Tests

### Run all tests:
```bash
pnpm test
```

### Run only lockfile tests:
```bash
vitest run __tests__/pnpm-lock.test.ts
```

### Run tests in watch mode:
```bash
vitest watch __tests__/pnpm-lock.test.ts
```

### Run with coverage:
```bash
vitest run --coverage __tests__/pnpm-lock.test.ts
```

## Test Philosophy

These tests follow the principle of **"bias for action"** by:

1. **Validating what would typically be untested**: Lock files are usually only validated by the package manager itself, but these tests provide additional confidence.

2. **Comprehensive coverage**: 50+ test cases covering structure, syntax, security, performance, and specific updates from the git diff.

3. **Meaningful validation**: Each test serves a purpose - detecting corruption, ensuring consistency, validating security practices, and confirming proper formatting.

4. **Git diff awareness**: Tests specifically validate the changes made in the current branch (TypeScript version updates, fumadocs dependency chains, @types/bun version bump).

## Why Test a Lock File?

While lock files are automatically generated, testing them provides value by:

- **Detecting corruption**: Ensures the file structure is intact after merges or manual edits
- **Validating consistency**: Confirms dependencies are properly resolved across the workspace
- **Security checks**: Verifies no credentials are accidentally committed
- **Performance monitoring**: Alerts to excessive file size or duplicate dependencies
- **Change validation**: Confirms specific updates (like those in the git diff) are properly reflected

## Integration with CI/CD

These tests can be integrated into your CI/CD pipeline to:

1. Catch lockfile corruption early
2. Ensure dependency updates are properly resolved
3. Validate security practices
4. Monitor lockfile health over time

## Extending the Tests

To add more tests:

1. Add new test cases within existing `describe` blocks
2. Create new `describe` blocks for new categories
3. Use the `extractSection()` helper to parse specific lockfile sections
4. Follow the existing naming pattern: `GIVEN [context] THEN [expectation]`

## Dependencies

The test suite uses:

- **vitest**: Test runner (already in project)
- **Node.js fs/path**: Built-in modules for file operations
- No additional dependencies required

## Notes

- Tests are designed to be resilient to lockfile format changes
- Some tests are conditional (only run if certain sections exist)
- Tests use regex patterns to accommodate format variations
- Helper functions extract sections for focused testing