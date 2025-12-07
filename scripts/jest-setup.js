// scripts/jest-setup.js
const { execSync } = require('child_process');

module.exports = async () => {
    require('dotenv').config({ path: '.env.test' });
    console.log('\n[TEST SETUP] Resetting whitty_test database...');
    execSync('npx prisma db push --force-reset --skip-generate', { stdio: 'inherit' });
    
    console.log('[TEST SETUP] whitty_test is clean and ready.');
};