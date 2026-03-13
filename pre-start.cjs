const { execSync } = require('child_process');
const { existsSync } = require('fs');

const SKIP_PRESTART = process.env.BOLT_SKIP_PRESTART === '1';

if (SKIP_PRESTART) {
  process.exit(0);
}

// Get git hash with fallback. For local dev speed, support override and avoid git spawn when repo metadata is absent.
const getGitHash = () => {
  if (process.env.BOLT_GIT_HASH) {
    return process.env.BOLT_GIT_HASH;
  }

  if (!existsSync('.git')) {
    return 'no-git-info';
  }

  try {
    return execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
  } catch {
    return 'no-git-info';
  }
};

const commitJson = {
  hash: JSON.stringify(getGitHash()),
  version: JSON.stringify(process.env.npm_package_version || 'unknown'),
};

console.log(`
★═══════════════════════════════════════★
          B O L T . D I Y
         ⚡️  Welcome  ⚡️
★═══════════════════════════════════════★
`);
console.log('📍 Current Version Tag:', `v${commitJson.version}`);
console.log('📍 Current Commit Version:', commitJson.hash);
console.log('  Please wait until the URL appears here');
console.log('★═══════════════════════════════════════★');
