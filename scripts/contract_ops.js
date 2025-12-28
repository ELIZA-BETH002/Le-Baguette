import fs from 'fs';
import { execSync } from 'child_process';

function run(cmd) {
    try {
        console.log(`Running: ${cmd}`);
        execSync(cmd, { stdio: 'inherit' });
    } catch (e) {
        console.error(`Command failed: ${cmd}`);
        // process.exit(1);
    }
}

const steps = [
    // 1. Remove as-contract from LeBaguette (Refactor)
    {
        name: 'refactor/remove-as-contract',
        action: () => {
            const path = 'contracts/LeBaguette.clar';
            let content = fs.readFileSync(path, 'utf8');

            // Remove withdraw-funds function entirely as it uses as-contract
            // and current mint logic sends STX directly to owner anyway.
            const regex = /\(define-public \(withdraw-funds\)[\s\S]*?\)/;
            content = content.replace(regex, '');

            fs.writeFileSync(path, content);
            return "refactor: remove withdraw-funds and as-contract usage";
        }
    },
    // 2. Create Crumbs Token (New Feature)
    {
        name: 'feat/token-crumbs-init',
        action: () => {
            const path = 'contracts/Crumbs.clar';
            const content = `;; Crumbs Token (CRUMB)
;; Reward token for staking Baguettes

(impl-trait 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-010-trait-ft-standard.sip-010-trait)

(define-fungible-token crumbs)

(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-token-owner (err u101))

(define-data-var token-uri (optional (string-utf8 256)) none)
`;
            fs.writeFileSync(path, content);
            return "feat: init Crumbs fungible token";
        }
    },
    {
        name: 'feat/token-crumbs-core',
        action: () => {
            const path = 'contracts/Crumbs.clar';
            let content = fs.readFileSync(path, 'utf8');
            content += `
;; SIP-010 Standard Functions
(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
    (begin
        (asserts! (is-eq tx-sender sender) err-not-token-owner)
        (try! (ft-transfer? crumbs amount sender recipient))
        (match memo to-print (print to-print) 0x)
        (ok true)
    )
)

(define-read-only (get-name)
    (ok "Crumbs")
)

(define-read-only (get-symbol)
    (ok "CRUMB")
)

(define-read-only (get-decimals)
    (ok u6)
)
`;
            fs.writeFileSync(path, content);
            return "feat: implement SIP-010 core functions for Crumbs";
        }
    },
    {
        name: 'feat/token-crumbs-access',
        action: () => {
            const path = 'contracts/Crumbs.clar';
            let content = fs.readFileSync(path, 'utf8');
            content += `
(define-read-only (get-balance (who principal))
    (ok (ft-get-balance crumbs who))
)

(define-read-only (get-total-supply)
    (ok (ft-get-supply crumbs))
)

(define-read-only (get-token-uri)
    (ok (var-get token-uri))
)

(define-public (set-token-uri (value (string-utf8 256)))
    (begin
        (asserts! (is-eq tx-sender contract-owner) err-owner-only)
        (var-set token-uri (some value))
        (ok true)
    )
)
`;
            fs.writeFileSync(path, content);
            return "feat: implement Crumbs accessors and admin";
        }
    },
    {
        name: 'feat/token-crumbs-minting',
        action: () => {
            const path = 'contracts/Crumbs.clar';
            let content = fs.readFileSync(path, 'utf8');
            content += `
(define-public (mint (amount uint) (recipient principal))
    (begin
        (asserts! (is-eq tx-sender contract-owner) err-owner-only)
        (ft-mint? crumbs amount recipient)
    )
)
`;
            fs.writeFileSync(path, content);
            return "feat: implement Crumbs minting capability";
        }
    },
    // 3. Register Crumbs in Clarinet.toml
    {
        name: 'config/register-crumbs',
        action: () => {
            const path = 'Clarinet.toml';
            let content = fs.readFileSync(path, 'utf8');
            if (!content.includes('[contracts.Crumbs]')) {
                content += `
[contracts.Crumbs]
path = 'contracts/Crumbs.clar'
clarity_version = 4
epoch = "3.3"
`;
                fs.writeFileSync(path, content);
            }
            return "config: register Crumbs contract";
        }
    }
];

function execute() {
    for (const step of steps) {
        console.log(`Executing step: ${step.name}`);

        // Checkout branch
        run(`git checkout ${step.name} 2>NUL || git checkout -b ${step.name}`);

        // Perform action
        const msg = step.action();

        // Commit and Merge
        run(`git add .`);
        run(`git commit -m "${msg}"`);
        run(`git checkout main`);
        run(`git merge ${step.name}`);
    }
}

execute();
