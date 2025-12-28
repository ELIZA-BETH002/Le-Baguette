const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function runCommand(command) {
    try {
        console.log(`Executing: ${command}`);
        const output = execSync(command, { encoding: 'utf8' });
        console.log(output);
        return output.trim();
    } catch (error) {
        console.error(`Error executing command: ${command}`);
        console.error(error.message);
        process.exit(1);
    }
}

const args = process.argv.slice(2);
const action = args[0];
const param = args[1];

if (!action) {
    console.log("Usage: node automator.js <action> [param]");
    process.exit(1);
}

if (action === 'create-branch') {
    if (!param) {
        console.error("Please provide branch name");
        process.exit(1);
    }
    runCommand(`git checkout -b ${param}`);
}
