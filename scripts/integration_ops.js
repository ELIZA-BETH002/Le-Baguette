import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';

function run(cmd) {
    try {
        console.log(`Running: ${cmd}`);
        execSync(cmd, { stdio: 'inherit' });
    } catch (e) {
        console.error(`Command failed: ${cmd}`);
    }
}

const steps = [
    {
        name: 'feat/chainhooks-setup',
        action: () => {
            const path = 'frontend/src/services/chainhooks.js';
            const content = `import { ChainhooksClient } from '@hirosystems/chainhooks-client';

const API_KEY = import.meta.env.VITE_CHAINHOOKS_API_KEY;

export const client = new ChainhooksClient({
    apiKey: API_KEY,
    network: 'testnet' 
});

/**
 * Initialize Chainhooks connection
 */
export const initChainhooks = () => {
    // console.debug('Initializing Chainhooks...');
};
`;
            fs.writeFileSync(path, content);
            return "feat: setup chainhooks client instance";
        }
    },
    {
        name: 'feat/chainhooks-watcher',
        action: () => {
            const path = 'frontend/src/services/chainhooks.js';
            let content = fs.readFileSync(path, 'utf8');
            content += `
/**
 * Watch for NFT mint events
 * @param {Function} callback 
 */
export const watchMintEvents = (callback) => {
    // Placeholder for actual WebSocket subscription
    // client.subscribe('nft-mint', (event) => {
    //     callback(event);
    // });
    
    // Simulating event for development
    setTimeout(() => {
        callback({ type: 'mint', tokenId: 1, recipient: 'ST1...' });
    }, 5000);
};
`;
            fs.writeFileSync(path, content);
            return "feat: add mint event watcher stub";
        }
    },
    {
        name: 'feat/ui-toast-integration',
        action: () => {
            // Create a simple toast context manager if not exists, or update the Toast component
            const path = 'frontend/src/components/Toast.jsx';
            let content = fs.readFileSync(path, 'utf8');
            if (!content.includes('useEffect')) {
                content = `import { useEffect, useState } from 'react';\n${content}`;
                content = content.replace('export default function Toast({ msg }) {',
                    'export default function Toast({ msg, duration = 3000, onClose }) {\n  const [visible, setVisible] = useState(true);\n\n  useEffect(() => {\n    const timer = setTimeout(() => {\n      setVisible(false);\n      if (onClose) onClose();\n    }, duration);\n    return () => clearTimeout(timer);\n  }, [duration, onClose]);\n\n  if (!visible) return null;');
            }
            fs.writeFileSync(path, content);
            return "feat: enhance Toast with auto-dismiss logic";
        }
    },
    {
        name: 'feat/app-event-listener',
        action: () => {
            const path = 'frontend/src/App.jsx';
            let content = fs.readFileSync(path, 'utf8');

            // Add imports
            if (!content.includes('watchMintEvents')) {
                content = `import { useState, useEffect } from 'react';\nimport { watchMintEvents } from './services/chainhooks';\nimport Toast from './components/Toast';\n${content}`;
            }

            // Add state and effect
            if (!content.includes('const [lastEvent')) {
                const insertionPoint = 'function App() {';
                const logic = `
  const [lastEvent, setLastEvent] = useState(null);

  useEffect(() => {
    watchMintEvents((event) => {
      console.log('Chainhook Event:', event);
      setLastEvent(event);
    });
  }, []);
`;
                content = content.replace(insertionPoint, `${insertionPoint}${logic}`);

                // Add logic to render toast
                const renderPoint = '<div className="app-container">';
                content = content.replace(renderPoint, `${renderPoint}\n      {lastEvent && <Toast msg={"New Baguette Minted: #" + lastEvent.tokenId} />}`);
            }

            fs.writeFileSync(path, content);
            return "feat: listen for chainhook events in App";
        }
    }
];

function execute() {
    for (const step of steps) {
        console.log(`Executing step: ${step.name}`);
        run(`git checkout ${step.name} 2>NUL || git checkout -b ${step.name}`);
        const msg = step.action();
        run(`git add .`);
        run(`git commit -m "${msg}"`);
        run(`git checkout main`);
        run(`git merge ${step.name}`);
    }
}

execute();
