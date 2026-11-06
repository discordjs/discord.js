# Preparing releases

Use the [Prepare Release workflow](../../../../.github/workflows/prepare-release.yml) to open a PR with package version and
changelog updates. Merging the PR automatically starts the **Release** workflow for the prepared packages and their unreleased dependencies.

## Usage

Run **Prepare Release** from GitHub Actions, then review the PR linked in the job summary. Changes are pushed to a separate
`prepare-release-<run_id>-<attempt>` branch. If no packages need bumping, no branch or PR is created. Publishing creates the release tags.

PR titles list the package versions being released, with a count for larger batches. The full selection is recorded in the
PR body and `release-plan-<attempt>` artifact, which the publisher checks against the merged versions.

| Input        | Default         | Purpose                                                                                       |
| ------------ | --------------- | --------------------------------------------------------------------------------------------- |
| `branch`     | Workflow branch | Base branch for the release PR.                                                               |
| `mode`       | `auto`          | Detect packages changed since their last release, or use `manual` to select packages.         |
| `packages`   | Empty           | Manual selection, separated by commas or whitespace. Accepts folder names or published names. |
| `request_id` | Empty           | Optional non-secret ID for associating a run with the caller.                                 |

For example, select `manual` mode with `builders,core,discord.js`. Published names such as `@discordjs/builders` work too.

For a maintenance release, run the workflow from `main` and set `branch` to the maintenance branch, such as `v14`.
This uses the tools from `main` with the maintenance branch's packages and release configs.

## Setup

The workflow uses the `DISCORDJS_APP_ID` repository variable and `DISCORDJS_APP_KEY_RELEASE` secret. The release App needs
**Contents: write** and **Pull requests: write**. The PR follows the base branch's normal protection and review rules.

The action respects the target branch's package release configs. Those configs should generate changelogs and skip
package-level commits and tags (`skipChangelog: false`, `skipTag: true`).

Optional HTTP status callbacks for preparation and publishing use the `RELEASE_WEBHOOK_URL` and `RELEASE_WEBHOOK_SECRET`
repository secrets. Publishing reports success or failure with published and skipped packages. Manual publishing accepts
`request_id`; publishing after a merge includes the PR number and URL for correlation with preparation.
