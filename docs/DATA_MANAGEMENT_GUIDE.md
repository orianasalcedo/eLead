# Data Management Guide - Best Practices

## 🎯 Por Qué Hay Data Dummy en los Tests

### Problema Actual
Los tests existentes contienen **data hardcoded/dummy** como:

```javascript
❌ PROBLEMA:
{
  shipping_address: {
    address_line: '789 Shipping Street',  // ❌ Hardcoded
    city: 'Shipping City',                 // ❌ Generic
    country_id: 1,                         // ❌ Assumed
    state_id: 1                            // ❌ May not exist
  }
}
```

### Por Qué Existe Este Problema

1. **Tests generados automáticamente** desde CSV sin conocer la API real
2. **Sin acceso a datos reales** durante la generación
3. **Falta de fixtures** y utilities organizados
4. **No sigue las reglas** de Cypress (Rules 08, 09, 17)

---

## ✅ Solución: Patrón de 3 Capas

Según las **Cypress Rules 08, 09, y 17**, debes usar este patrón:

### **1. FIXTURES (Datos Base Estáticos)**

📁 `cypress/fixtures/addresses/shipping.json`
```json
{
  "shipping_address": {
    "address_line": "123 Main Street",
    "address_line_two": "Apt 4B",
    "city": "Springfield",
    "zip_code": "12345",
    "phone_number": "5551234567",
    "country_id": null,
    "state_id": null
  }
}
```

**Cuándo usar:**
- ✅ Datos que raramente cambian
- ✅ Templates base para tests
- ✅ Datos compartidos entre múltiples tests

---

### **2. UTILS (Generación Dinámica)**

📁 `cypress/utils/address-generator.js`
```javascript
function createShippingAddress(countryId, stateId) {
  return {
    shipping_address: {
      address_line: `${randomNumber()} ${randomStreet()}`,
      city: randomCity(),
      zip_code: randomZipCode(),
      phone_number: randomPhoneNumber(),
      country_id: countryId,  // ✅ Real ID from API
      state_id: stateId       // ✅ Real ID from API
    }
  }
}
```

**Cuándo usar:**
- ✅ Datos que deben ser únicos en cada test
- ✅ Generación aleatoria
- ✅ Combinar fixture + datos dinámicos

---

### **3. DATOS REALES DE LA API**

📁 Test usa datos REALES de la API:
```javascript
beforeEach(() => {
  // ✅ OBTENER IDs reales de la API
  cy.apiRequest('GET', '/api/v1/countries').then((response) => {
    realCountryId = response.body.data[0].id  // ✅ Real ID
    
    cy.apiRequest('GET', `/api/v1/countries/${realCountryId}/states`)
      .then((statesResponse) => {
        realStateId = statesResponse.body.data[0].id  // ✅ Real ID
      })
  })
})

it('should create address', () => {
  // ✅ Usar IDs reales + datos dinámicos
  const addressData = createShippingAddress(realCountryId, realStateId)
  cy.apiRequest('POST', '/api/v1/shipping_addresses', addressData)
})
```

**Cuándo usar:**
- ✅ Siempre que sea posible!
- ✅ Para IDs de entidades relacionadas
- ✅ Para validar relaciones entre datos

---

## 📊 Comparación: Antes vs Después

### ❌ ANTES (Con Data Dummy)

```javascript
it('should create shipping address', () => {
  const addressData = {
    shipping_address: {
      address_line: '789 Shipping Street',  // ❌ Hardcoded
      city: 'Shipping City',                 // ❌ Dummy
      country_id: 1,                         // ❌ No sabemos si existe
      state_id: 1                            // ❌ Puede no pertenecer al país
    }
  }
  
  cy.apiRequest('POST', '/api/v1/shipping_addresses', addressData)
})
```

**Problemas:**
- 🚨 Falla si country_id=1 no existe en el ambiente
- 🚨 Falla si state_id=1 no pertenece al country_id=1
- 🚨 Tests no son reproducibles
- 🚨 Difícil de mantener

---

### ✅ DESPUÉS (Con Datos Reales)

```javascript
describe('Shipping Address', () => {
  let realCountryId
  let realStateId

  beforeEach(() => {
    // ✅ Obtener IDs REALES de la API
    cy.apiRequest('GET', '/api/v1/countries').then((response) => {
      realCountryId = response.body.data[0].id
      
      return cy.apiRequest('GET', `/api/v1/countries/${realCountryId}/states`)
    }).then((statesResponse) => {
      realStateId = statesResponse.body.data[0].id
    })
  })

  it('should create shipping address', () => {
    // ✅ Generar datos dinámicos + IDs reales
    const addressData = createShippingAddress(realCountryId, realStateId)
    
    cy.apiRequest('POST', '/api/v1/shipping_addresses', addressData)
      .then((response) => {
        expect(response.status).to.eq(201)
        expect(response.body.shipping_address.country_id).to.eq(realCountryId)
      })
  })
})
```

**Beneficios:**
- ✅ Funciona en cualquier ambiente (QA, STG, PROD)
- ✅ Usa datos que realmente existen
- ✅ Tests son reproducibles
- ✅ Fácil de mantener

---

## 🔧 Patrón Recomendado

### **Estructura de Datos en Tests:**

```javascript
describe('My Feature Tests', () => {
  let realDataFromAPI  // ✅ Real IDs/data from API
  let authHeaders

  before(() => {
    // Setup que solo se hace una vez
  })

  beforeEach(() => {
    // 1️⃣ Autenticar
    cy.eleadpromoLogin(email, password).then((response) => {
      authHeaders = extractAuthHeaders(response)
    })

    // 2️⃣ Obtener datos REALES de la API
    cy.apiRequest('GET', '/api/v1/resource').then((response) => {
      realDataFromAPI = response.body.data[0]
    })
  })

  it('should do something', () => {
    // 3️⃣ Cargar fixture como base
    cy.fixture('my-fixture').then((fixtureData) => {
      
      // 4️⃣ Combinar: Fixture + Datos Reales + Dinámicos
      const testData = {
        ...fixtureData,
        real_id: realDataFromAPI.id,        // ✅ From API
        dynamic_field: randomValue(),       // ✅ From utils
        timestamp: Date.now()               // ✅ Unique
      }

      // 5️⃣ Ejecutar test con datos completos
      cy.apiRequest('POST', '/api/v1/resource', testData)
    })
  })
})
```

---

## 📝 Checklist para Refactorizar Tests

Cuando encuentres data dummy, sigue estos pasos:

### ✅ **Paso 1: Identificar Data Dummy**
```javascript
// ❌ BUSCAR:
country_id: 1
state_id: 1
city: 'Test City'
phone_number: '1234567890'
```

### ✅ **Paso 2: Crear Fixture**
```bash
# Crear archivo fixture
touch cypress/fixtures/addresses/shipping.json
```

### ✅ **Paso 3: Crear Utility**
```bash
# Crear utility para generación dinámica
touch cypress/utils/address-generator.js
```

### ✅ **Paso 4: Obtener Datos Reales**
```javascript
beforeEach(() => {
  // Obtener IDs reales de la API
  cy.apiRequest('GET', '/api/v1/countries').then(...)
})
```

### ✅ **Paso 5: Refactorizar Test**
```javascript
it('test with real data', () => {
  const data = createAddress(realCountryId, realStateId)
  cy.apiRequest('POST', '/api/v1/addresses', data)
})
```

---

## 🎯 Reglas de Oro

### **DO ✅**
1. ✅ Usar fixtures para datos base
2. ✅ Usar utils para generación dinámica
3. ✅ Obtener IDs reales de la API
4. ✅ Validar relaciones entre datos
5. ✅ Hacer tests reproducibles

### **DON'T ❌**
1. ❌ Hardcodear IDs (country_id: 1)
2. ❌ Usar data dummy (city: 'Test City')
3. ❌ Asumir que los datos existen
4. ❌ Duplicar data en múltiples tests
5. ❌ Ignorar validaciones de la API

---

## 🚀 Próximos Pasos

1. **Auditar tests existentes** - Buscar data dummy
2. **Crear fixtures necesarios** - Para cada entidad
3. **Crear utilities** - address-generator, product-generator, etc.
4. **Refactorizar tests** - De más críticos a menos críticos
5. **Documentar** - Ejemplos para el equipo

---

## 📚 Referencias

- **Cypress Rule 08**: Fixtures and Mocks
- **Cypress Rule 09**: Data Utilities (Dynamic Data)
- **Cypress Rule 17**: Fixtures, Pages, and Data Optimization

---

## 💡 Ejemplo Completo

Ver archivo: `cypress/e2e/api/address-management-improved.cy.js`

Este ejemplo muestra:
- ✅ Obtención de datos reales de la API
- ✅ Uso de fixtures como base
- ✅ Generación dinámica de datos
- ✅ Validación de relaciones
- ✅ Manejo de errores

---

## 🎓 Conclusión

**La data dummy existe porque los tests fueron generados automáticamente sin conocer la API real.**

**La solución es usar el patrón de 3 capas:**
1. **Fixtures** - Datos base estáticos
2. **Utils** - Generación dinámica
3. **API Real** - IDs y relaciones reales

**Esto hace que los tests sean:**
- ✅ Reproducibles
- ✅ Mantenibles
- ✅ Confiables
- ✅ Independientes del ambiente

