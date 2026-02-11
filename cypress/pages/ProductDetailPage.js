/**
 * Product detail page (e.g. /shop/12345).
 * Detects and selects optional attribute dropdowns: Size, Color, Logo (native select or custom).
 * Adapts to products that have one, two, or all three.
 */

/** Order matters: Color first, then Size, then Logo (selecting later can clear earlier if order is wrong). */
const ATTRIBUTE_LABELS = ['Color', 'Size', 'Logo']
const ATTRIBUTE_TEST_IDS = ['product-color', 'product-size', 'product-logo']
const PLACEHOLDER_OPTION_REGEX = /^(select|choose|--|elegir|seleccionar|\s*)$/i
const ADD_TO_CART_TEXTS = ['add to cart', 'add to bag', 'añadir al carrito', 'add to basket']
const ADD_TO_CART_MODAL_TEXT = 'We noticed you added apparel to your cart. Please note,'
const ADD_TO_CART_MODAL_ACCEPT_TEXT = /^(acept(ar)?|accept)$/i

/** Returns the second valid option value if there are ≥2, otherwise the first. Skips placeholders. */
function getSecondOrFirstValidOptionValue($select) {
  const valid = $select.find('option').toArray().filter((o) => {
    const v = o.value
    const t = (o.textContent || '').trim()
    return v && !PLACEHOLDER_OPTION_REGEX.test(t)
  })
  if (valid.length === 0) return null
  const index = valid.length >= 2 ? 1 : 0
  return valid[index].value
}

function findSelectForAttribute($body, attributeLabel, dataTestId) {
  if (dataTestId) {
    const $byTestId = $body.find(`[data-testid="${dataTestId}"]`).first()
    if ($byTestId.length) {
      const $sel = $byTestId[0].tagName === 'SELECT' ? $byTestId : $byTestId.find('select').first()
      if ($sel.length) return $sel
    }
  }
  const name = attributeLabel.toLowerCase()
  const $labels = $body.find('label, legend').filter((i, el) => {
    const t = (el.textContent || '').trim()
    return new RegExp(`^${attributeLabel}$`, 'i').test(t)
  })
  if ($labels.length) {
    const $sel = $labels.first().parent().find('select').first()
    if ($sel.length) return $sel
  }
  const $byName = $body.find(`select[name*="${name}"]`)
  if ($byName.length) return $byName.first()
  return null
}

/**
 * Find the button that opens the dropdown for this attribute.
 * Looks for data-testid wrapper, or any element with label text (Size/Color/Logo) then walks up to find ancestor that contains a button.
 */
function findCustomAttributeTrigger($body, attributeLabel, dataTestId) {
  if (dataTestId) {
    const $wrap = $body.find(`[data-testid="${dataTestId}"]`).first()
    if ($wrap.length) {
      const $trigger = $wrap.closest('div, section, form, fieldset').find('button, [role="button"], [role="combobox"]').first()
      if ($trigger.length) return $trigger
      if ($wrap[0].tagName === 'BUTTON' || $wrap.attr('role') === 'button' || $wrap.attr('role') === 'combobox') return $wrap
    }
  }
  const reExact = new RegExp(`^\\s*${attributeLabel}\\s*[*:]?\\s*$`, 'i')
  const reStarts = new RegExp(`^\\s*${attributeLabel}\\b`, 'i')
  const $labelCandidates = $body.find('label, legend, span, div, p, dt, th').filter((i, el) => {
    const t = (el.textContent || '').trim()
    return reExact.test(t) || reStarts.test(t)
  })
  for (let i = 0; i < $labelCandidates.length; i++) {
    let $el = $labelCandidates.eq(i)
    while ($el.length && $el[0] !== $body[0]) {
      const $btn = $el.find('button, [role="button"], [role="combobox"]').first()
      if ($btn.length) return $btn
      $el = $el.parent()
    }
  }
  const $anyButton = $body.find('button, [role="button"]').filter((i, el) => {
    const t = (el.textContent || '').trim().toLowerCase()
    const name = attributeLabel.toLowerCase()
    return t.includes(name) || (el.getAttribute('aria-label') || '').toLowerCase().includes(name)
  }).first()
  if ($anyButton.length) return $anyButton
  return null
}

class ProductDetailPage {
  /**
   * Detects Size, Color, and Logo dropdowns on the page and selects the first valid option for each that exists.
   * Supports native <select> and custom dropdowns ([role="combobox"] / button + [role="option"]).
   * Safe when only one or two attributes are present; no-op for missing attributes.
   */
  selectProductAttributesWhenPresent() {
    cy.get('body').then(($body) => {
      ATTRIBUTE_LABELS.forEach((attributeLabel, index) => {
        const dataTestId = ATTRIBUTE_TEST_IDS[index] || null
        const $sel = findSelectForAttribute($body, attributeLabel, dataTestId)
        if ($sel?.length && $sel.is(':visible')) {
          const val = getSecondOrFirstValidOptionValue($sel)
          if (!val) return
          const name = $sel.attr('name')
          const selector = name ? `select[name="${name}"]` : null
          if (selector) {
            cy.get(selector).select(val)
          } else {
            cy.wrap($sel).select(val)
          }
          return
        }
        const $trigger = findCustomAttributeTrigger($body, attributeLabel, dataTestId)
        if ($trigger?.length && $trigger.is(':visible')) {
          cy.wrap($trigger).click()
          // Allow dropdown open animation to finish so options are visible (not hidden by transform)
          // eslint-disable-next-line cypress/no-unnecessary-waiting -- dropdown animation
          cy.wait(300, { log: false })
          // Scope options to this dropdown only (walk up from trigger to find the ul that belongs to it).
          // Otherwise we match options from a closed dropdown and get "hidden by transform".
          cy.wrap($trigger).then(($t) => {
            let $el = $t
            let $opts = Cypress.$()
            while ($el.length && $el[0] !== document.body) {
              const $ul = $el.find('ul')
              if ($ul.length) {
                const $li = $ul.first().find('li')
                if ($li.length) {
                  $opts = $li
                  break
                }
              }
              $el = $el.parent()
            }
            if (!$opts.length) return
            const index = $opts.length >= 2 ? 1 : 0
            const $option = $opts.eq(index)
            const optionEl = $option[0]
            if (optionEl) {
              let scrollParent = optionEl.parentElement
              while (scrollParent && scrollParent !== document.body) {
                const style = window.getComputedStyle(scrollParent)
                const oy = style.overflowY || style.overflow
                if (oy === 'auto' || oy === 'scroll' || oy === 'overlay') {
                  const rect = optionEl.getBoundingClientRect()
                  const parentRect = scrollParent.getBoundingClientRect()
                  if (rect.top < parentRect.top) {
                    scrollParent.scrollTop -= parentRect.top - rect.top
                  } else if (rect.bottom > parentRect.bottom) {
                    scrollParent.scrollTop += rect.bottom - parentRect.bottom
                  }
                  break
                }
                scrollParent = scrollParent.parentElement
              }
            }
            cy.wrap($option).click()
          })
        }
      })
    })
  }

  /**
   * Waits for Add to cart button to be enabled (after attributes are selected), then clicks. No force; only clicks when enabled.
   */
  clickAddToCartWhenPresent() {
    cy.get('body').then(($body) => {
      const $byTestId = $body.find('[data-testid="add-to-cart"]').first()
      if ($byTestId.length) {
        cy.get('[data-testid="add-to-cart"]').first().should('not.be.disabled', { timeout: 10000 }).click()
        return
      }
      const $buttons = $body.find('button, [role="button"]').filter((i, el) => {
        const t = (el.textContent || '').trim().toLowerCase()
        return ADD_TO_CART_TEXTS.some((text) => t.includes(text))
      })
      if ($buttons.length) {
        cy.get('button, [role="button"]')
          .filter((i, el) => {
            const t = (el.textContent || '').trim().toLowerCase()
            return ADD_TO_CART_TEXTS.some((text) => t.includes(text))
          })
          .first()
          .should('not.be.disabled', { timeout: 10000 })
          .click()
      }
    })
  }

  /**
   * If the "apparel added to cart" confirmation modal appears, clicks "Aceptar" / "Accept" to close it. No-op if modal does not appear (some stores).
   */
  dismissAddToCartModalWhenPresent() {
    const modalText = ADD_TO_CART_MODAL_TEXT
    const maxWait = 5000
    const interval = 200
    const start = Date.now()
    const check = () => {
      return cy.document().then((doc) => {
        const $body = Cypress.$(doc.body)
        const $el = $body.find('*').filter(function () {
          return (this.textContent || '').indexOf(modalText) !== -1
        })
        if ($el.length) {
          const $container = $el.first().closest('[role="dialog"], [class*="modal"], [class*="Modal"], div')
          const $btn = $container.find('button, [role="button"], a').filter(function () {
            return ADD_TO_CART_MODAL_ACCEPT_TEXT.test((this.textContent || '').trim())
          })
          if ($btn.length) {
            return cy.wrap($btn.first()).click()
          }
        }
        if (Date.now() - start >= maxWait) return
        return cy.wait(interval, { log: false }).then(() => check())
      })
    }
    check()
  }
}

module.exports = { ProductDetailPage }
