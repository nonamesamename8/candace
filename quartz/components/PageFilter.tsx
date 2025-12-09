// @ts-ignore
import pageFilterScript from "./scripts/pagefilter.inline"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const PageFilter: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
  return <></>
}

PageFilter.afterDOMLoaded = pageFilterScript

export default (() => PageFilter) satisfies QuartzComponentConstructor
