import { execSync } from 'child_process';

console.log('Starting NPM Install...');
try {
  const stdout = execSync('npm install --no-audit', { stdio: 'inherit' });
  console.log('NPM Install completed successfully!');
} catch (error) {
  console.error('NPM Install failed:', error.message);
}
