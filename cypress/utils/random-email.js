/**
 * Random email generator for sign-up tests
 * Rule 07: Dynamic data - use for temporary/random user registration
 */
function randomEmail(prefix = 'user') {
  return `${prefix}${Date.now()}@example.com`
}

module.exports = { randomEmail }
