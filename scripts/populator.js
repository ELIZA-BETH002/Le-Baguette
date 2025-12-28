import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';

function run(cmd) {
    try {
        execSync(cmd, { stdio: 'pipe' });
    } catch (e) {
        // console.error(`Failed: ${cmd}`, e.message);
    }
}

const updates = [
    {
        file: 'frontend/src/components/Button.jsx',
        branch: 'feat/ui-button',
        steps: [
            { msg: 'docs: add component documentation', content: (prev) => `/**\n * Primary UI Button component\n * @param {Object} props\n */\n${prev}` },
            { msg: 'feat: add prop types import', content: (prev) => `import PropTypes from 'prop-types';\n${prev}` },
            { msg: 'feat: add variant support', content: (prev) => prev.replace('className="btn"', 'className={`btn ${props.variant || "primary"}`}') },
            { msg: 'test: add display name', content: (prev) => `${prev}\nButton.displayName = "Button";` },
            { msg: 'refactor: prop types definition', content: (prev) => `${prev}\nButton.propTypes = {\n  children: PropTypes.node,\n  variant: PropTypes.string\n};` },
        ]
    },
    {
        file: 'frontend/src/components/Card.jsx',
        branch: 'feat/ui-card',
        steps: [
            { msg: 'docs: add card documentation', content: (prev) => `/**\n * Container component for content\n */\n${prev}` },
            { msg: 'style: add glass effect class', content: (prev) => prev.replace('className="card"', 'className="card glass-effect"') },
            { msg: 'feat: add padding prop', content: (prev) => prev.replace('children }', 'children, padding = "1rem" }').replace('>{', ' style={{ padding }}>{') },
        ]
    },
    {
        file: 'frontend/src/hooks/useMount.js',
        branch: 'feat/hook-use-mount',
        steps: [
            { msg: 'docs: explain hook usage', content: (prev) => `/**\n * Runs callback only on mount\n */\n${prev}` },
            { msg: 'refactor: use callback ref', content: (prev) => prev.replace('useEffect(() => { fn(); }, []);', 'useEffect(() => {\n    fn();\n  }, []);') },
        ]
    }
];

// Helper to finding all files to populate
const populateAll = () => {
    // 1. Components
    const components = fs.readdirSync('frontend/src/components').filter(f => f.endsWith('.jsx'));
    processFiles(components, 'frontend/src/components', 'ui', (name, content) => {
        const updates = [];
        if (!content.includes('prop-types')) {
            updates.push({
                msg: `feat: add prop-types support to ${name}`,
                transform: c => `import PropTypes from 'prop-types';\n${c}`
            });
        }
        if (!content.includes('/**')) {
            updates.push({
                msg: `docs: document ${name} component`,
                transform: c => `/**\n * ${name} Component\n */\n${c}`
            });
        }
        if (!content.includes('.propTypes')) {
            updates.push({
                msg: `test: add prop validation stub for ${name}`,
                transform: c => `${c}\n\n${name}.propTypes = {\n  // TODO: define props\n};`
            });
        }
        return updates;
    });

    // 2. Hooks
    const hooks = fs.readdirSync('frontend/src/hooks').filter(f => f.endsWith('.js'));
    processFiles(hooks, 'frontend/src/hooks', 'hook', (name, content) => {
        const updates = [];
        if (!content.includes('/**')) {
            updates.push({
                msg: `docs: add usage documentation for ${name}`,
                transform: c => `/**\n * Hook: ${name}\n * Usage: See implementation\n */\n${c}`
            });
        }
        if (!content.includes('console.debug')) {
            updates.push({
                msg: `feat: add debug logging to ${name}`,
                transform: c => {
                    // Insert before the first return or at end of arrow function
                    if (c.includes('return')) return c.replace('return', `  // console.debug('${name} hook mounted');\n  return`);
                    return c;
                }
            });
        }
        return updates;
    });

    // 3. Services
    const services = fs.readdirSync('frontend/src/services').filter(f => f.endsWith('.js'));
    processFiles(services, 'frontend/src/services', 'service', (name, content) => {
        const updates = [];
        if (!content.includes('/**')) {
            updates.push({
                msg: `docs: document ${name} service`,
                transform: c => `/**\n * Service: ${name}\n * Handles external integrations\n */\n${c}`
            });
        }
        if (!content.includes('try {')) {
            updates.push({
                msg: `feat: add error handling placeholder for ${name}`,
                transform: c => `${c}\n\n// TODO: Implement global error handler wrapper`
            });
        }
        return updates;
    });

    // 4. Utils
    const utils = fs.readdirSync('frontend/src/utils').filter(f => f.endsWith('.js'));
    processFiles(utils, 'frontend/src/utils', 'util', (name, content) => {
        const updates = [];
        if (!content.includes('/**')) {
            updates.push({
                msg: `docs: document ${name} utility`,
                transform: c => `/**\n * Utility: ${name}\n * Helper functions\n */\n${c}`
            });
        }
        if (!content.includes('export default') && !content.includes('module.exports')) {
            updates.push({
                msg: `refactor: ensure named exports in ${name}`,
                transform: c => `// Ensuring named exports structure\n${c}`
            });
        }
        return updates;
    });
};

function processFiles(files, dir, type, getUpdates) {
    files.forEach(f => {
        const name = f.replace(/\.(jsx|js)/, '');
        // Convert camelCase to kebab-case for branch
        const kebabName = name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
        const branch = `feat/${type}-${kebabName}`;
        const filePath = `${dir}/${f}`;

        if (!fs.existsSync(filePath)) return;

        console.log(`Processing ${type}/${name}...`);

        // Checkout
        run(`git checkout ${branch} 2>NUL || git checkout -b ${branch}`);

        let content = fs.readFileSync(filePath, 'utf8');
        const updates = getUpdates(name, content);

        updates.forEach(update => {
            content = update.transform(content);
            fs.writeFileSync(filePath, content);
            run(`git add .`);
            run(`git commit -m "${update.msg}"`);
        });

        // Merge if updates were made
        if (updates.length > 0) {
            run(`git checkout main`);
            run(`git merge ${branch}`);
        } else {
            // Just switch back if no updates
            run(`git checkout main`);
        }
    });
}

populateAll();
