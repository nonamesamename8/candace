/**
 * Anchor Highlight Component
 *
 * Provides flash-fade animation when navigating to an anchor on the page.
 * This is a headless component - it only injects the script, no UI.
 */

// @ts-ignore
import anchorHighlightScript from "./scripts/anchor-highlight.inline"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const AnchorHighlight: QuartzComponent = (_props: QuartzComponentProps) => {
  // No visible UI - this component only injects the script
  return null
}

AnchorHighlight.afterDOMLoaded = anchorHighlightScript

export default (() => AnchorHighlight) satisfies QuartzComponentConstructor
