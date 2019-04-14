workflow "Commit" {
	on = "push"
	resolves = ["ESLint"]
}

workflow "PR" {
	on = "pull_request"
	resolves = ["ESLint"]
}

action "ESLint" {
	uses = "./.github/action/eslint"
	secrets = ["GITHUB_TOKEN"]
}
