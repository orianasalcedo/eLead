# 🔧 Plan de Refactorización - Cumplimiento Real de Rules

## 🚨 PROBLEMAS IDENTIFICADOS

### **Tests UI NO usan Page Object Model:**
```javascript
❌ PROBLEMA en cypress/e2e/ui/product-management.cy.js:
it('should display product list', () => {
  cy.visit('/products')                          // ❌ Directo en test
  cy.get('[data-cy="product-list"]')            // ❌ Selector en test
  cy.get('[data-cy="product-item"]')            // ❌ No usa Page Object
})
```

### **Tests UI NO usan Actions:**
```javascript
❌ PROBLEMA en cypress/e2e/ui/user-authentication.cy.js:
it('should register new user', () => {
  cy.visit('/register')                         // ❌ Directo en test
  cy.fillForm({...})                            // ❌ No usa Action
  cy.get('[data-cy="register-button"]').click() // ❌ No usa Page Object
})
```

### **Tests API usan Data Dummy:**
```javascript
❌ PROBLEMA en cypress/e2e/api/address-management-tests.cy.js:
const addressData = {
  country_id: 1,        // ❌ Hardcoded ID
  state_id: 1,          // ❌ No viene de API real
  city: 'Test City'     // ❌ Data dummy
}
```

---

## ✅ SOLUCIÓN: Refactorización Completa

### **1. Page Objects (para tests UI)**
### **2. Actions (para flujos de negocio)**  
### **3. Fixtures (para datos base)**
### **4. Utils (para datos dinámicos)**
### **5. Custom Commands (domain-specific)**

---

## 📊 AUDITORÍA COMPLETA

- **Total archivos de test**: 39
- **Tests UI sin Page Objects**: 3 archivos
- **Tests API con data dummy**: 1 archivo
- **Fixtures desorganizados**: 4 archivos
- **Actions faltantes**: Todos

---

## 🎯 PRIORIDAD DE REFACTORIZACIÓN

### **FASE 1: Page Objects + Actions (UI Tests)**
1. ProductsPage.js
2. LoginPage.js (ya existe, pero mejorar)
3. RegisterPage.js
4. CartPage.js

### **FASE 2: API Tests + Fixtures**
5. Refactorizar address-management-tests.cy.js
6. Crear fixtures organizados
7. Crear utils para data dinámica

### **FASE 3: Custom Commands**
8. Comandos específicos del dominio
9. Helpers para API

---

## 📁 ESTRUCTURA OBJETIVO

```
cypress/
├── pages/               ✅ Crear todos los Page Objects
│   ├── LoginPage.js    
│   ├── ProductsPage.js ← CREAR
│   ├── RegisterPage.js ← CREAR
│   ├── CartPage.js     ← CREAR
│   └── components/
│       ├── Header.js   ← CREAR
│       └── ProductCard.js ← CREAR
├── actions/            ✅ Crear todas las Actions
│   ├── auth.actions.js (ya existe)
│   ├── products.actions.js ← CREAR
│   ├── cart.actions.js ← CREAR
│   └── orders.actions.js ← CREAR
├── fixtures/           ✅ Organizar fixtures
│   ├── users/
│   ├── products/       ← CREAR
│   ├── addresses/      (ya existe)
│   └── orders/         ← CREAR
└── utils/              ✅ Crear utilities
    ├── data.js (ya existe)
    ├── address-generator.js (ya existe)
    └── product-generator.js ← CREAR
```

---

## 🔄 EJEMPLO DE REFACTORIZACIÓN

### ❌ ANTES (Viola Rules):
```javascript
// cypress/e2e/ui/product-management.cy.js
it('should add product to cart', () => {
  cy.visit('/products')                    // ❌ No usa Page Object
  cy.get('[data-cy="product-item"]')      // ❌ Selector directo
    .first()
    .within(() => {
      cy.get('[data-cy="add-to-cart"]').click()
    })
  cy.get('[data-cy="cart-count"]').should('contain', '1')
})
```

### ✅ DESPUÉS (Cumple Rules):
```javascript
// cypress/pages/ProductsPage.js
class ProductsPage {
  visit() { cy.visit('/products') }
  getProductItems() { return cy.get('[data-cy="product-item"]') }
  getFirstProduct() { return this.getProductItems().first() }
  getAddToCartButton() { return cy.get('[data-cy="add-to-cart"]') }
}

// cypress/actions/cart.actions.js
const { ProductsPage } = require('../pages/ProductsPage')
const cartActions = {
  addFirstProductToCart() {
    const productsPage = new ProductsPage()
    productsPage.visit()
    productsPage.getFirstProduct().within(() => {
      productsPage.getAddToCartButton().click()
    })
  }
}

// cypress/e2e/ui/product-management.cy.js
const { cartActions } = require('../../actions/cart.actions')
it('should add product to cart', () => {
  cartActions.addFirstProductToCart()     // ✅ Usa Action
  cy.get('[data-cy="cart-count"]').should('contain', '1')
})
```

---

## 📝 CHECKLIST DE CUMPLIMIENTO

### ✅ Para cada test UI:
- [ ] Usa Page Objects para interacción con UI
- [ ] Usa Actions para flujos de negocio
- [ ] No tiene selectores directos en el test
- [ ] No tiene cy.visit() directo en el test
- [ ] Usa fixtures para datos

### ✅ Para cada test API:
- [ ] Usa fixtures para datos base
- [ ] Usa utils para datos dinámicos
- [ ] Obtiene IDs reales de la API
- [ ] No tiene data hardcoded
- [ ] Usa custom commands

---

## 🎯 MÉTRICAS DE ÉXITO

| Métrica | Antes | Objetivo |
|---------|-------|----------|
| Tests con Page Objects | 0% | 100% |
| Tests con Actions | 0% | 100% |
| Tests con data real | 0% | 100% |
| Fixtures organizados | 25% | 100% |
| Custom commands | 20% | 100% |

---

## 🚀 COMENZAR REFACTORIZACIÓN

Archivos prioritarios para refactorizar:
1. `cypress/e2e/ui/product-management.cy.js` - 5 tests
2. `cypress/e2e/ui/user-authentication.cy.js` - 4 tests  
3. `cypress/e2e/api/address-management-tests.cy.js` - Data dummy

---

## ✅ CÓMO VALIDAR CUMPLIMIENTO

### **Test Manual:**
```bash
# 1. Buscar violaciones
grep -r "cy.visit\|cy.get" cypress/e2e/ui/*.cy.js
# Resultado esperado: NO debe haber resultados

# 2. Verificar uso de Page Objects
grep -r "const.*Page.*require" cypress/e2e/ui/*.cy.js
# Resultado esperado: Todos los tests deben importar Pages

# 3. Verificar uso de Actions
grep -r "const.*actions.*require" cypress/e2e/ui/*.cy.js
# Resultado esperado: Todos los tests deben importar Actions
```

### **Test Automatizado:**
```bash
# Ejecutar tests refactorizados
npm run cy:run:qa

# Todos deben pasar
```

