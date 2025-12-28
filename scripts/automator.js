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
