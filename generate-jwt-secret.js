const crypto = require('crypto');

console.log(' Generating JWT Secret Key...\n');

const jwtSecret = crypto.randomBytes(64).toString('hex');

console.log(' JWT Secret Key generated successfully!\n');
console.log('Copy this to your .env file:\n');
console.log('━'.repeat(80));
console.log(`JWT_SECRET=${jwtSecret}`);
console.log(`JWT_EXPIRATION_TIME=7d`);
console.log('━'.repeat(80));
console.log('\nExplanation:');
console.log('  • JWT_SECRET: Random secure key for signing JWT tokens');
console.log('  • JWT_EXPIRATION_TIME: Token will expire in 7 days');
console.log('\n  IMPORTANT:');
console.log('  • Keep this secret SAFE and NEVER commit to Git');
console.log('  • Use different secrets for development and production');
console.log('  • If compromised, generate a new one immediately');
console.log('\n Alternative expiration times:');
console.log('  • 1h  = 1 hour');
console.log('  • 24h = 24 hours');
console.log('  • 7d  = 7 days (recommended)');
console.log('  • 30d = 30 days');
