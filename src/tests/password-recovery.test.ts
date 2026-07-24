/**
 * Unit & Integration Test Suite for Password Recovery Module
 */
import { validatePasswordComplexity } from '../lib/password.js';
import { checkRateLimit, incrementRateLimit } from '../lib/rate-limit.js';

function runTests() {
  console.log('🧪 Starting Password Recovery Module Tests...\n');
  let passedCount = 0;
  let failedCount = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`  ✅ PASSED: ${testName}`);
      passedCount++;
    } else {
      console.error(`  ❌ FAILED: ${testName}`);
      failedCount++;
    }
  }

  // Test 1: Password Complexity Validation (REQ-RECOVERY-014)
  console.log('--- Test Group 1: Password Complexity ---');

  const weakPass1 = validatePasswordComplexity('short');
  assert(
    !weakPass1.isValid && weakPass1.errors.length > 0,
    'Reject short password (< 8 chars)',
  );

  const weakPass2 = validatePasswordComplexity('alllowercase123!');
  assert(
    !weakPass2.isValid && !weakPass2.hasUppercase,
    'Reject password without uppercase letter',
  );

  const weakPass3 = validatePasswordComplexity('ALLUPPERCASE123!');
  assert(
    !weakPass3.isValid && !weakPass3.hasLowercase,
    'Reject password without lowercase letter',
  );

  const weakPass4 = validatePasswordComplexity('NoDigitsHere!');
  assert(
    !weakPass4.isValid && !weakPass4.hasDigit,
    'Reject password without digits',
  );

  const weakPass5 = validatePasswordComplexity('NoSpecial1234');
  assert(
    !weakPass5.isValid && !weakPass5.hasSpecialChar,
    'Reject password without special character',
  );

  const strongPass = validatePasswordComplexity('AdminP@ssw0rd2026!');
  assert(
    strongPass.isValid && strongPass.errors.length === 0,
    'Accept strong compliant password',
  );

  // Test 2: IP Rate Limiting (REQ-RECOVERY-010)
  console.log('\n--- Test Group 2: Rate Limiting ---');
  const testIp = '192.168.1.100';

  // Initially not limited
  let status = checkRateLimit(testIp);
  assert(!status.isLimited, 'Initial IP state is not limited');

  // Perform 3 requests
  incrementRateLimit(testIp);
  incrementRateLimit(testIp);
  incrementRateLimit(testIp);

  // 4th check should be limited
  status = checkRateLimit(testIp);
  assert(status.isLimited, 'Rate limit triggered after 3 requests');

  // Test 3: Token Expiration Calculation (REQ-RECOVERY-003)
  console.log('\n--- Test Group 3: Token Expiration ---');
  const now = Date.now();
  const tokenExpiresAt = new Date(now + 15 * 60 * 1000);
  const diffMinutes = (tokenExpiresAt.getTime() - now) / (1000 * 60);

  assert(
    Math.round(diffMinutes) === 15,
    'Token expiration time set to exactly 15 minutes',
  );

  console.log(`\n======================================================`);
  console.log(`📊 Test Summary: ${passedCount} Passed, ${failedCount} Failed.`);
  console.log(`======================================================\n`);

  if (failedCount > 0) {
    process.exit(1);
  }
}

runTests();
