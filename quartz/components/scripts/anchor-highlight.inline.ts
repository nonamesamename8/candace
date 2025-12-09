/**
 * Anchor Highlight Script
 *
 * Adds a flash-fade animation when navigating to an anchor on the page.
 * Works with both direct URL navigation and SPA navigation.
 *
 * Key insight: The Quartz SPA router already handles scrolling to anchors,
 * so we primarily just need to add the highlight effect. We only need to
 * scroll ourselves in specific cases where the SPA doesn't handle it.
 */

function findTarget(targetId: string): Element | null {
  // Try to find element by ID
  let target: Element | null = document.getElementById(targetId)

  // If not found by ID, try querySelector (handles special characters better)
  if (!target) {
    try {
      target = document.querySelector(`[id="${CSS.escape(targetId)}"]`)
    } catch (e) {
      // CSS.escape might not be available in all browsers
    }
  }

  // If still not found, search for data attribute (fallback)
  if (!target) {
    target = document.querySelector(`[data-block-id="${targetId}"]`)
  }

  return target
}

function highlightElement(target: Element) {
  // Remove any existing highlight
  document.querySelectorAll('.highlight-flash').forEach(el => {
    el.classList.remove('highlight-flash')
  })

  // Add highlight class
  target.classList.add('highlight-flash')

  // Remove class after animation completes
  setTimeout(() => {
    target?.classList.remove('highlight-flash')
  }, 2000)
}

function highlightCurrentAnchor(shouldScroll: boolean = false) {
  const hash = window.location.hash
  if (!hash) return

  const targetId = decodeURIComponent(hash.substring(1))
  const target = findTarget(targetId)

  if (target) {
    highlightElement(target)
    if (shouldScroll) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }
}

// Run on initial page load - browser handles scrolling, we just highlight
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => highlightCurrentAnchor(false), 150)
})

// Run after SPA navigation - SPA router already scrolled, we just highlight
document.addEventListener('nav', () => {
  setTimeout(() => highlightCurrentAnchor(false), 150)
})

// Handle hash changes (same-page anchor clicks) - SPA router already scrolled
window.addEventListener('hashchange', () => {
  setTimeout(() => highlightCurrentAnchor(false), 50)
})

// Intercept clicks on anchor links to add highlighting
// The SPA router handles scrolling, we just need to highlight
document.addEventListener('click', (event) => {
  const target = event.target as Element
  const link = target.closest('a')
  if (!link) return

  const href = link.getAttribute('href')
  if (!href || !href.includes('#')) return

  // Parse the link
  const url = new URL(href, window.location.href)

  // For any link with a hash, highlight after navigation
  if (url.hash) {
    const targetId = decodeURIComponent(url.hash.substring(1))
    // Delay to let SPA router or browser handle navigation first
    setTimeout(() => {
      const el = findTarget(targetId)
      if (el) {
        highlightElement(el)
      }
    }, 200)
  }
})

// Handle popstate (back/forward navigation) with hash
// The SPA router passes isBack=true which skips scrolling, so we need to scroll ourselves
window.addEventListener('popstate', () => {
  const hash = window.location.hash
  if (hash) {
    // Delay to let the SPA router process the page change first
    setTimeout(() => {
      highlightCurrentAnchor(true) // Scroll because SPA skips it for back nav
    }, 250)
  }
})
