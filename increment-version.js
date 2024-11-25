const fs = require('fs');
const path = require('path');

const envFilePath = path.join(__dirname, '.env');

// Read the current .env file
let envContent = fs.existsSync(envFilePath) ? fs.readFileSync(envFilePath, 'utf8') : '';

// Find the current version
const versionMatch = envContent.match(/VITE_APP_VERSION=(\d+\.\d+\.\d+)/);
let currentVersion = versionMatch ? versionMatch[1] : '0.0.0';

// Increment the patch version
const [major, minor, patch] = currentVersion.split('.').map(Number);
const newVersion = `${major}.${minor}.${patch + 1}`;

// Update or add the version in the .env file
if (versionMatch) {
  envContent = envContent.replace(/VITE_APP_VERSION=\d+\.\d+\.\d+/, `VITE_APP_VERSION=${newVersion}`);
} else {
  envContent += `\nVITE_APP_VERSION=${newVersion}`;
}

// Write the updated content back to the .env file
fs.writeFileSync(envFilePath, envContent);

console.log(`Version incremented to ${newVersion}`);