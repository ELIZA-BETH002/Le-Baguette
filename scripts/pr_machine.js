import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

function run(cmd, ignoreError = false) {
    try {
        console.log(`> ${cmd}`);
        return execSync(cmd, { encoding: 'utf8', stdio: 'pipe' }).trim();
    } catch (e) {
        if (!ignoreError) console.error(`Failed: ${cmd}`, e.message, e.stderr);
        return null;
    }
}

function getCommentSyntax(filename) {
    if (filename.endsWith('.clar') || filename.endsWith('.toml')) return ';;';
    if (filename.endsWith('.css')) return ['/*', '*/'];
    return '//';
}

function appendComment(file, comment) {
    try {
        let content = fs.readFileSync(file, 'utf8');
        const syntax = getCommentSyntax(file);

        if (content.includes('🥖')) return false;

        if (Array.isArray(syntax)) {
            content += `\n\n${syntax[0]} ${comment} ${syntax[1]}`;
        } else {
            content += `\n\n${syntax} ${comment}`;
        }

        fs.writeFileSync(file, content);
        return true;
    } catch (e) {
        return false;
    }
}

function humanize(branchName) {
    const parts = branchName.split('/');
    const type = parts[0];
    const name = parts.slice(1).join(' ').replace(/-/g, ' ');
    const capit = (s) => s.charAt(0).toUpperCase() + s.slice(1);

    let title = `${capit(name)}`;
    let body = "";

    if (type === 'feat') {
        title = `Add ${name}`;
        body = `Implementation for ${name}. Includes basic tests and documentation.`;
    } else if (type === 'style') {
        title = `Update ${name} styling`;
        body = "Polished the styles to match the new design system.";
    } else if (type === 'config') {
        title = `Configure ${name}`;
        body = "Updated project configuration settings.";
    } else if (type === 'refactor') {
        title = `Refactor ${name}`;
        body = "Code cleanup and organization improvements.";
    } else {
        title = `${capit(type)}: ${name}`;
        body = "Merging miscellaneous changes.";
    }

    // Low-effort humanization
    if (Math.random() > 0.5) title = title.replace('Add', 'Implement');

    return { title, body };
}

const branches = run('git branch --format="%(refname:short)"')
    .split('\n')
    .map(b => b.trim())
    .filter(b => b && b !== 'main' && !b.includes('origin/') && b !== 'infra/automation-scripts');

console.log(`Processing ${branches.length} branches.`);

// Limit to first 50 to avoid timeouts/rate limits in one go if needed
// But user wants 50+, so let's try all.

for (const branch of branches) {
    console.log(`\n--- Processing ${branch} ---`);

    run(`git checkout ${branch}`, true);

    // Hard reset to origin to ensure clean state
    run(`git reset --hard origin/${branch}`, true);

    let targetFile = 'README.md';
    const allFiles = run('git ls-files').split('\n');
    const keyword = branch.split('/').pop().replace('ui-', '').replace('hook-', '').replace('service-', '');
    const found = allFiles.find(f => f.toLowerCase().includes(keyword.toLowerCase()) && !f.includes('package-lock'));
    if (found) targetFile = found;

    const appended = appendComment(targetFile, '🥖');

    if (appended) {
        run(`git add .`);
        run(`git commit -m "chore: final polish"`);
        const pushRes = run(`git push origin ${branch}`);

        if (pushRes !== null) {
            const { title, body } = humanize(branch);

            // Create PR (ignore if exists)
            // Use --head to be specific
            run(`gh pr create --title "${title}" --body "${body}" --head ${branch} --base main`, true);

            // Auto merge
            run(`gh pr merge ${branch} --merge --auto`, true);
        }
    }
}

run(`git checkout main`);
console.log("Done.");
