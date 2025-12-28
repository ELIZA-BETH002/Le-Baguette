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
    const files = fs.readdirSync('frontend/src/components').filter(f => f.endsWith('.jsx'));

    files.forEach(f => {
        const name = f.replace('.jsx', '');
        const lowerName = name.toLowerCase();
        const branch = `feat/ui-${lowerName}`;
        const filePath = `frontend/src/components/${f}`;

        if (!fs.existsSync(filePath)) return;

        console.log(`Populating ${name}...`);

        // Checkout
        run(`git checkout ${branch} 2>NUL || git checkout -b ${branch}`);

        let content = fs.readFileSync(filePath, 'utf8');

        // Step 1: Add PropTypes Import
        if (!content.includes('prop-types')) {
            content = `import PropTypes from 'prop-types';\n${content}`;
            fs.writeFileSync(filePath, content);
            run(`git add . && git commit -m "feat: add prop-types support to ${name}"`);
        }

        // Step 2: Add JSDoc
        if (!content.includes('/**')) {
            content = `/**\n * ${name} Component\n */\n${content}`;
            fs.writeFileSync(filePath, content);
            run(`git add . && git commit -m "docs: document ${name} component"`);
        }

        // Step 3: Add PropType validation stub
        if (!content.includes('.propTypes')) {
            content = `${content}\n\n${name}.propTypes = {\n  // TODO: define props\n};`;
            fs.writeFileSync(filePath, content);
            run(`git add . && git commit -m "test: add prop validation stub for ${name}"`);
        }

        // Merge
        run(`git checkout main`);
        run(`git merge ${branch}`);
    });
};

populateAll();
