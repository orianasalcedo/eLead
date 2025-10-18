function randomEmail(prefix = 'user') {
  const n = Math.floor(Math.random() * 1e6)
  return `${prefix}${n}@example.com`
}

module.exports = { randomEmail }
