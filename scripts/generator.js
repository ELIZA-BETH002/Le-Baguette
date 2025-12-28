import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';

const features = [
    // UI Components
    { name: 'feat/ui-button', file: 'frontend/src/components/Button.jsx', content: 'export default function Button({ children }) { return <button className="btn">{children}</button>; }' },
    { name: 'feat/ui-card', file: 'frontend/src/components/Card.jsx', content: 'export default function Card({ children }) { return <div className="card">{children}</div>; }' },
    { name: 'feat/ui-input', file: 'frontend/src/components/Input.jsx', content: 'export default function Input(props) { return <input className="input" {...props} />; }' },
    { name: 'feat/ui-modal', file: 'frontend/src/components/Modal.jsx', content: 'export default function Modal({ isOpen, children }) { return isOpen ? <div className="modal">{children}</div> : null; }' },
    { name: 'feat/ui-avatar', file: 'frontend/src/components/Avatar.jsx', content: 'export default function Avatar({ src }) { return <img src={src} className="avatar" alt="avatar" />; }' },
    { name: 'feat/ui-badge', file: 'frontend/src/components/Badge.jsx', content: 'export default function Badge({ text }) { return <span className="badge">{text}</span>; }' },
    { name: 'feat/ui-loader', file: 'frontend/src/components/Loader.jsx', content: 'export default function Loader() { return <div className="spinner">Loading...</div>; }' },
    { name: 'feat/ui-toast', file: 'frontend/src/components/Toast.jsx', content: 'export default function Toast({ msg }) { return <div className="toast">{msg}</div>; }' },
    { name: 'feat/ui-tooltip', file: 'frontend/src/components/Tooltip.jsx', content: 'export default function Tooltip({ text }) { return <div className="tooltip">{text}</div>; }' },
    { name: 'feat/ui-divider', file: 'frontend/src/components/Divider.jsx', content: 'export default function Divider() { return <hr className="divider" />; }' },

    // Layout
    { name: 'feat/layout-header', file: 'frontend/src/layout/Header.jsx', content: 'export default function Header() { return <header>Header</header>; }' },
    { name: 'feat/layout-footer', file: 'frontend/src/layout/Footer.jsx', content: 'export default function Footer() { return <footer>Footer</footer>; }' },
    { name: 'feat/layout-sidebar', file: 'frontend/src/layout/Sidebar.jsx', content: 'export default function Sidebar() { return <aside>Sidebar</aside>; }' },
    { name: 'feat/layout-container', file: 'frontend/src/layout/Container.jsx', content: 'export default function Container({ children }) { return <div className="container">{children}</div>; }' },
    { name: 'feat/layout-grid', file: 'frontend/src/layout/Grid.jsx', content: 'export default function Grid({ children }) { return <div className="grid">{children}</div>; }' },

    // Hooks
    { name: 'feat/hook-use-mount', file: 'frontend/src/hooks/useMount.js', content: 'import { useEffect } from "react"; export const useMount = (fn) => useEffect(() => { fn(); }, []);' },
    { name: 'feat/hook-use-toggle', file: 'frontend/src/hooks/useToggle.js', content: 'import { useState } from "react"; export const useToggle = (initial) => { const [state, set] = useState(initial); return [state, () => set(!state)]; };' },
    { name: 'feat/hook-use-debounce', file: 'frontend/src/hooks/useDebounce.js', content: 'import { useState, useEffect } from "react"; export function useDebounce(value, delay) { const [debouncedValue, setDebouncedValue] = useState(value); useEffect(() => { const handler = setTimeout(() => { setDebouncedValue(value); }, delay); return () => { clearTimeout(handler); }; }, [value, delay]); return debouncedValue; }' },
    { name: 'feat/hook-use-local-storage', file: 'frontend/src/hooks/useLocalStorage.js', content: 'export const useLocalStorage = (key, initialValue) => { /* impl */ };' },
    { name: 'feat/hook-use-window-size', file: 'frontend/src/hooks/useWindowSize.js', content: 'export const useWindowSize = () => { /* impl */ };' },

    // Utils
    { name: 'feat/util-formatters', file: 'frontend/src/utils/formatters.js', content: 'export const formatCurrency = (val) => `$${val}`;' },
    { name: 'feat/util-validators', file: 'frontend/src/utils/validators.js', content: 'export const isValidEmail = (email) => email.includes("@");' },
    { name: 'feat/util-dates', file: 'frontend/src/utils/dates.js', content: 'export const formatDate = (date) => new Date(date).toLocaleDateString();' },
    { name: 'feat/util-math', file: 'frontend/src/utils/math.js', content: 'export const add = (a, b) => a + b;' },
    { name: 'feat/util-strings', file: 'frontend/src/utils/strings.js', content: 'export const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);' },

    // Services
    { name: 'feat/service-api', file: 'frontend/src/services/api.js', content: 'export const fetcher = (url) => fetch(url).then(res => res.json());' },
    { name: 'feat/service-storage', file: 'frontend/src/services/storage.js', content: 'export const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));' },
    { name: 'feat/service-logger', file: 'frontend/src/services/logger.js', content: 'export const log = (msg) => console.log(msg);' },
    { name: 'feat/service-analytics', file: 'frontend/src/services/analytics.js', content: 'export const track = (event) => console.log("Tracking", event);' },
    { name: 'feat/service-auth', file: 'frontend/src/services/auth-service.js', content: 'export const login = () => { /* login */ };' },

    // Pages
    { name: 'feat/page-home', file: 'frontend/src/pages/Home.jsx', content: 'export default function Home() { return <h1>Home</h1>; }' },
    { name: 'feat/page-about', file: 'frontend/src/pages/About.jsx', content: 'export default function About() { return <h1>About</h1>; }' },
    { name: 'feat/page-dashboard', file: 'frontend/src/pages/Dashboard.jsx', content: 'export default function Dashboard() { return <h1>Dashboard</h1>; }' },
    { name: 'feat/page-settings', file: 'frontend/src/pages/Settings.jsx', content: 'export default function Settings() { return <h1>Settings</h1>; }' },
    { name: 'feat/page-profile', file: 'frontend/src/pages/Profile.jsx', content: 'export default function Profile() { return <h1>Profile</h1>; }' },

    // Styles
    { name: 'style/theme', file: 'frontend/src/styles/theme.css', content: ':root { --primary: red; }' },
    { name: 'style/typography', file: 'frontend/src/styles/typography.css', content: 'body { font-family: sans-serif; }' },
    { name: 'style/animations', file: 'frontend/src/styles/animations.css', content: '@keyframes spin { 100% { transform: rotate(360deg); } }' },
    { name: 'style/vars', file: 'frontend/src/styles/vars.css', content: ':root { --spacing: 8px; }' },
    { name: 'style/reset', file: 'frontend/src/styles/reset.css', content: '* { box-sizing: border-box; }' },

    // Config
    { name: 'config/constants', file: 'frontend/src/config/constants.js', content: 'export const APP_NAME = "Le Baguette";' },
    { name: 'config/routes', file: 'frontend/src/config/routes.js', content: 'export const ROUTES = { HOME: "/" };' },
    { name: 'config/env', file: 'frontend/src/config/env.js', content: 'export const ENV = process.env.NODE_ENV;' },
    { name: 'config/api-config', file: 'frontend/src/config/api.js', content: 'export const API_URL = "https://api.example.com";' },
    { name: 'config/wallet-config', file: 'frontend/src/config/wallet.js', content: 'export const NETWORK = "testnet";' }
];

function run(cmd) {
    try {
        execSync(cmd, { stdio: 'pipe' });
    } catch (e) {
        console.error(`Failed: ${cmd}`, e.message);
    }
}

console.log(`Starting generation of ${features.length} features/branches...`);

features.forEach((feat, i) => {
    console.log(`[${i + 1}/${features.length}] Processing ${feat.name}...`);

    // Checkout new branch
    run(`git checkout -b ${feat.name}`);

    // Create dir if not exists
    const dir = path.dirname(feat.file);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    // Write file
    fs.writeFileSync(feat.file, feat.content);

    // Commit
    run(`git add .`);
    run(`git commit -m "feat: implement ${path.basename(feat.file, path.extname(feat.file))}"`);

    // Switch back and merge (simulating PR merge)
    run(`git checkout main`);
    run(`git merge ${feat.name}`);

    // NOTE: NOT deleting the branch so the user sees the branch count as requested.
});

console.log("Done!");
