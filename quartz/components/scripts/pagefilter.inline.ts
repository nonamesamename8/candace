// Page filter functionality - filters list items and sections as user types
document.addEventListener("nav", () => {
  const filter = document.querySelector('.page-filter') as HTMLInputElement
  const clearBtn = document.querySelector('.filter-clear') as HTMLElement
  const countSpan = document.querySelector('.filter-count') as HTMLElement
  if (!filter) return

  function doFilter() {
    const term = filter.value.toLowerCase().trim()

    // First, handle filter-item divs (timeline events, etc.)
    // When a filter-item matches, all its children should stay visible
    const filterItems = document.querySelectorAll('article .filter-item')
    filterItems.forEach(item => {
      const text = item.textContent?.toLowerCase() || ''
      const match = !term || text.includes(term)
      item.classList.toggle('filter-hidden', !match)
      // Mark children so we don't filter them separately
      if (match && term) {
        item.querySelectorAll('li').forEach(li => li.classList.add('filter-parent-match'))
      }
    })

    // Find filterable list items NOT inside a matched filter-item
    const listItems = document.querySelectorAll('article li:not(.filter-parent-match)')
    let visible = 0
    const total = listItems.length + filterItems.length

    // Show/hide list items that aren't inside a matched filter-item
    listItems.forEach(item => {
      // Skip if inside a filter-item (handled above)
      if (item.closest('.filter-item')) {
        item.classList.remove('filter-hidden')
        return
      }
      const text = item.textContent?.toLowerCase() || ''
      const match = !term || text.includes(term)
      item.classList.toggle('filter-hidden', !match)
      if (match) visible++
    })

    // Clean up the marker class
    document.querySelectorAll('.filter-parent-match').forEach(el =>
      el.classList.remove('filter-parent-match')
    )

    // Count visible filter-items
    filterItems.forEach(item => {
      if (!item.classList.contains('filter-hidden')) visible++
    })

    // Second pass: hide empty parent details sections
    // But keep details visible if they're inside a matched filter-item or summary matches
    document.querySelectorAll('article details').forEach(details => {
      const parentFilterItem = details.closest('.filter-item')
      if (parentFilterItem && !parentFilterItem.classList.contains('filter-hidden')) {
        // Parent filter-item matched, keep this details visible
        details.classList.remove('filter-hidden')
        if (term) (details as HTMLDetailsElement).open = true
        return
      }

      // Check if summary text matches the search term
      const summary = details.querySelector('summary')
      const summaryText = summary?.textContent?.toLowerCase() || ''
      const summaryMatches = term && summaryText.includes(term)

      // If summary matches, show details and all its contents
      if (summaryMatches) {
        details.classList.remove('filter-hidden')
        ;(details as HTMLDetailsElement).open = true
        // Show all li items inside this details since the section header matched
        details.querySelectorAll('li').forEach(li => li.classList.remove('filter-hidden'))
        return
      }

      const visibleItems = details.querySelectorAll('li:not(.filter-hidden), .filter-item:not(.filter-hidden)')
      const hasVisible = visibleItems.length > 0
      details.classList.toggle('filter-hidden', !!term && !hasVisible)
      if (term && hasVisible) (details as HTMLDetailsElement).open = true
    })

    // Third pass: hide empty year/month headers (h2, h3 with no visible siblings)
    document.querySelectorAll('article h2, article h3').forEach(heading => {
      if (term) {
        let hasVisibleContent = false
        let sibling = heading.nextElementSibling
        while (sibling && !sibling.matches('h2, h3')) {
          // Skip if sibling itself is hidden
          if (!sibling.classList.contains('filter-hidden')) {
            // For ul/ol, check if any li children are visible
            if (sibling.matches('ul, ol')) {
              if (sibling.querySelector('li:not(.filter-hidden)')) {
                hasVisibleContent = true
                break
              }
            }
            // For details, check if it has visible items
            else if (sibling.matches('details')) {
              if (sibling.querySelector('li:not(.filter-hidden), .filter-item:not(.filter-hidden)')) {
                hasVisibleContent = true
                break
              }
            }
            // For filter-item, it's visible if not hidden
            else if (sibling.matches('.filter-item')) {
              hasVisibleContent = true
              break
            }
          }
          sibling = sibling.nextElementSibling
        }
        heading.classList.toggle('filter-hidden', !hasVisibleContent)
      } else {
        heading.classList.remove('filter-hidden')
      }
    })

    // Update count
    if (countSpan) {
      countSpan.textContent = term ? `${visible} of ${total}` : ''
    }

    // Show/hide clear button
    if (clearBtn) {
      clearBtn.style.display = filter.value ? 'block' : 'none'
    }
  }

  filter.addEventListener('input', doFilter)
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filter.value = ''
      doFilter()
      filter.focus()
    })
  }

  // Clear filter on page navigation (prevents stale filter from previous page)
  filter.value = ''
  if (clearBtn) clearBtn.style.display = 'none'
  if (countSpan) countSpan.textContent = ''
  // Remove any filter-hidden classes from previous page
  document.querySelectorAll('.filter-hidden').forEach(el => el.classList.remove('filter-hidden'))
})
