/**
 * Address data utilities following Cypress Rule 09
 * Dynamic data generation for testing
 */

function randomPhoneNumber() {
  const areaCode = Math.floor(Math.random() * 900) + 100
  const prefix = Math.floor(Math.random() * 900) + 100
  const lineNumber = Math.floor(Math.random() * 9000) + 1000
  return `${areaCode}${prefix}${lineNumber}`
}

function randomZipCode() {
  return String(Math.floor(Math.random() * 90000) + 10000)
}

function randomAddress() {
  const streetNumber = Math.floor(Math.random() * 9000) + 1000
  const streets = ['Main St', 'Oak Ave', 'Pine Rd', 'Maple Dr', 'Cedar Ln']
  const street = streets[Math.floor(Math.random() * streets.length)]
  return `${streetNumber} ${street}`
}

function randomCity() {
  const cities = ['Springfield', 'Riverside', 'Fairview', 'Georgetown', 'Salem']
  return cities[Math.floor(Math.random() * cities.length)]
}

/**
 * Create a complete address with real data from API
 * @param {number} countryId - Real country ID from GET /api/v1/countries
 * @param {number} stateId - Real state ID from GET /api/v1/countries/{id}/states
 */
function createAddress(countryId, stateId) {
  return {
    address_line: randomAddress(),
    address_line_two: `Apt ${Math.floor(Math.random() * 100) + 1}`,
    city: randomCity(),
    zip_code: randomZipCode(),
    phone_number: randomPhoneNumber(),
    country_id: countryId,
    state_id: stateId,
  }
}

/**
 * Create shipping address with fixture as base + dynamic data
 */
function createShippingAddress(countryId, stateId) {
  return {
    shipping_address: createAddress(countryId, stateId),
  }
}

/**
 * Create billing address with fixture as base + dynamic data
 */
function createBillingAddress(countryId, stateId) {
  return {
    billing_address: createAddress(countryId, stateId),
  }
}

module.exports = {
  randomPhoneNumber,
  randomZipCode,
  randomAddress,
  randomCity,
  createAddress,
  createShippingAddress,
  createBillingAddress,
}

