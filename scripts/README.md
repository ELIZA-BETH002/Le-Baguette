# Automator Script

Helper script for micro-commit strategy.

## Usage
Run with Node.js (requires "type": "module" in package.json):
```bash
node scripts/automator.js <action> [param]
```

## Actions

### `create-branch`
Creates and switches to a new branch.
```bash
node scripts/automator.js create-branch feat/my-feature
```

### `commit`
Stages all changes and commits with message.
```bash
node scripts/automator.js commit "feat: add amazing feature"
```

### `create-pr`
Pushes current branch and creates a GitHub PR.
```bash
node scripts/automator.js create-pr "Implement Amazing Feature"
```

### `merge-pr`
Auto-merges the current PR.
```bash
node scripts/automator.js merge-pr
```
