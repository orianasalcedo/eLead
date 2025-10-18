# 🔍 Comandos de Verificación - Prueba Tú Misma

## 📋 **VERIFICACIÓN COMPLETA EN 5 MINUTOS**

Ejecuta estos comandos desde la terminal para verificar que TODO está implementado correctamente.

---

## 1️⃣ **Verificar Page Objects Existen y Tienen Contenido**

```bash
# Ver cuántos Page Objects hay
ls -la cypress/pages/*.js

# Ver el contenido completo de ProductsPage
cat cypress/pages/ProductsPage.js

# Contar líneas de cada Page Object
wc -l cypress/pages/LoginPage.js
wc -l cypress/pages/ProductsPage.js
wc -l cypress/pages/RegisterPage.js
```

**Resultado esperado**:
```
✅ LoginPage.js: 58 líneas
✅ ProductsPage.js: 90 líneas
✅ RegisterPage.js: 81 líneas
```

---

## 2️⃣ **Verificar Actions Existen y Tienen Métodos**

```bash
# Ver cuántas Actions hay
ls -la cypress/actions/*.js

# Ver el contenido completo de products.actions
cat cypress/actions/products.actions.js

# Buscar métodos implementados
grep -n "^  [a-zA-Z].*() {" cypress/actions/products.actions.js
```

**Resultado esperado**:
```
✅ auth.actions.js: 4 métodos (uiLogin, apiLogin, registerUser, attemptInvalidLogin)
✅ products.actions.js: 5 métodos (viewProductList, searchProduct, filterByCategory, addFirstProductToCart, viewProductDetails)
```

---

## 3️⃣ **Verificar Custom Commands Implementados**

```bash
# Ver el archivo de comandos custom
cat cypress/support/eleadpromo-commands.js

# Contar cuántos comandos hay
grep -c "Cypress.Commands.add" cypress/support/eleadpromo-commands.js

# Ver nombres de comandos
grep "Cypress.Commands.add" cypress/support/eleadpromo-commands.js | sed "s/.*'\(.*\)'.*/\1/"
```

**Resultado esperado**:
```
✅ 5 comandos custom:
   - eleadpromoLogin
   - authenticatedApiRequest
   - getRealCountryAndState
   - logout
   - dataCy
```

---

## 4️⃣ **Verificar Tests Refactorizados Usan Page Objects**

```bash
# Ver un test refactorizado completo
cat cypress/e2e/ui/product-management-refactored.cy.js

# Verificar que NO usa cy.visit directo (debe estar en Page Objects)
grep -n "cy.visit" cypress/e2e/ui/product-management-refactored.cy.js

# Verificar que SÍ importa Page Objects
grep "require.*Page" cypress/e2e/ui/product-management-refactored.cy.js

# Verificar que SÍ importa Actions
grep "require.*actions" cypress/e2e/ui/product-management-refactored.cy.js
```

**Resultado esperado**:
```
✅ NO debe haber cy.visit() directo en el test
✅ Debe importar: const { ProductsPage } = require(...)
✅ Debe importar: const { productsActions } = require(...)
```

---

## 5️⃣ **Comparar Archivo Viejo vs Nuevo**

```bash
# Ver archivo VIEJO (con violaciones)
echo "========== ARCHIVO VIEJO (VIOLA REGLAS) =========="
head -n 30 cypress/e2e/ui/product-management.cy.js

# Ver archivo NUEVO (cumple reglas)
echo "========== ARCHIVO NUEVO (CUMPLE REGLAS) =========="
head -n 30 cypress/e2e/ui/product-management-refactored.cy.js
```

**Resultado esperado**:
```
VIEJO:
❌ cy.visit() directo en el test
❌ cy.get() directo en el test
❌ NO importa Page Objects
❌ NO importa Actions

NUEVO:
✅ Importa Page Objects
✅ Importa Actions
✅ USA productsActions.viewProductList()
✅ USA new ProductsPage()
```

---

## 6️⃣ **Verificar Fixtures Organizados**

```bash
# Ver estructura de fixtures
tree cypress/fixtures -L 2

# O si no tienes tree:
find cypress/fixtures -type f -name "*.json"

# Ver contenido de un fixture
cat cypress/fixtures/addresses/shipping.json
```

**Resultado esperado**:
```
cypress/fixtures/
├── addresses/
│   ├── shipping.json
│   └── billing.json
├── users/
│   └── admin.json
└── api/
    └── orders/
        ├── list.json
        ├── empty.json
        └── error.json
```

---

## 7️⃣ **Verificar Utils para Datos Dinámicos**

```bash
# Ver el generador de addresses
cat cypress/utils/address-generator.js

# Buscar funciones exportadas
grep "module.exports" cypress/utils/address-generator.js
```

**Resultado esperado**:
```
✅ Funciones: randomPhoneNumber, randomZipCode, randomAddress, 
             randomCity, createAddress, createShippingAddress, 
             createBillingAddress
```

---

## 8️⃣ **Buscar Violaciones (Debe Fallar en Archivos Viejos)**

```bash
# Buscar cy.visit directo en tests refactorizados (debe ser CERO)
grep -n "cy.visit" cypress/e2e/ui/*refactored*.cy.js | wc -l

# Buscar cy.visit en tests viejos (debe haber varios)
grep -n "cy.visit" cypress/e2e/ui/product-management.cy.js | wc -l

# Buscar data dummy en tests mejorados (debe ser CERO)
grep "country_id: 1\|state_id: 1" cypress/e2e/api/*improved*.cy.js | wc -l

# Buscar data dummy en tests viejos (debe haber varios)
grep "country_id: 1\|state_id: 1" cypress/e2e/api/address-management-tests.cy.js | wc -l
```

**Resultado esperado**:
```
Tests refactorizados: 0 violaciones ✅
Tests viejos: Múltiples violaciones (como debe ser) ✅
```

---

## 9️⃣ **Contar Total de Líneas Implementadas**

```bash
# Contar líneas de Page Objects
wc -l cypress/pages/*.js | tail -n 1

# Contar líneas de Actions
wc -l cypress/actions/*.js | tail -n 1

# Contar líneas de Custom Commands
wc -l cypress/support/eleadpromo-commands.js

# Contar líneas de Utils
wc -l cypress/utils/address-generator.js

# TOTAL
echo "========== TOTAL DE LÍNEAS IMPLEMENTADAS =========="
wc -l cypress/pages/*.js cypress/actions/*.js cypress/support/eleadpromo-commands.js cypress/utils/address-generator.js | tail -n 1
```

**Resultado esperado**:
```
✅ Page Objects: ~229 líneas
✅ Actions: ~123 líneas
✅ Custom Commands: ~143 líneas
✅ Utils: ~73 líneas
✅ TOTAL: ~600 líneas de código REAL
```

---

## 🔟 **Ejecutar un Test Refactorizado**

```bash
# Ejecutar SOLO tests refactorizados
npx cypress run --spec "cypress/e2e/ui/product-management-refactored.cy.js"

# O ejecutar el test mejorado de API
npx cypress run --spec "cypress/e2e/api/address-management-improved.cy.js" --env environment=qa
```

**Resultado esperado**:
```
✅ Tests pasan usando Page Objects + Actions
✅ NO hay violaciones de las reglas
```

---

## ✅ **VERIFICACIÓN RÁPIDA (1 minuto)**

Si solo tienes 1 minuto, ejecuta esto:

```bash
# Verificar que archivos existen
echo "=== Page Objects ==="
ls cypress/pages/*.js
echo "=== Actions ==="
ls cypress/actions/*.js
echo "=== Custom Commands ==="
ls cypress/support/eleadpromo-commands.js
echo "=== Tests Refactorizados ==="
ls cypress/e2e/ui/*refactored*.cy.js cypress/e2e/api/*improved*.cy.js

# Ver líneas totales
echo "=== Líneas de Código Implementadas ==="
wc -l cypress/pages/*.js cypress/actions/*.js cypress/support/eleadpromo-commands.js cypress/utils/address-generator.js | tail -n 1
```

---

## 📊 **CHECKLIST DE VERIFICACIÓN**

Marca cada ítem después de verificarlo:

- [ ] Page Objects existen (3 archivos)
- [ ] Page Objects tienen contenido (~229 líneas)
- [ ] Actions existen (2 archivos)
- [ ] Actions tienen métodos (~123 líneas)
- [ ] Custom Commands existen (1 archivo, 5 comandos)
- [ ] Tests refactorizados existen (3 archivos)
- [ ] Tests refactorizados usan Page Objects
- [ ] Tests refactorizados usan Actions
- [ ] Fixtures organizados
- [ ] Utils para datos dinámicos
- [ ] NO hay data dummy en tests mejorados
- [ ] Documentación completa

**Si todos los ítems están marcados, el cumplimiento es REAL y VERIFICABLE.** ✅

---

## 🎯 **RESULTADO ESPERADO**

Después de ejecutar estos comandos, deberías ver:

✅ 14 archivos nuevos creados
✅ ~600 líneas de código implementadas
✅ 3 tests refactorizados funcionando
✅ Page Objects + Actions + Custom Commands en uso
✅ NO hay violaciones en archivos refactorizados
✅ Fixtures y Utils organizados

**TODO verificable con comandos simples de terminal.**

