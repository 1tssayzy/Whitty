// scripts/jest-setup.js
const { execSync } = require('child_process');

module.exports = async () => {
    require('dotenv').config({ path: '.env.test' });
    console.log('\n[TEST SETUP] Resetting whitty_test database...');
    
    // --force-reset: Видаляє всі дані та таблиці, потім створює їх заново.
    // Це замінює необхідність робити очищення в кінці.
    execSync('npx prisma db push --force-reset --skip-generate', { stdio: 'inherit' });
    
    console.log('[TEST SETUP] whitty_test is clean and ready.');
};