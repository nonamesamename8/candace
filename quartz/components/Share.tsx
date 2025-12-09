// @ts-ignore
import shareScript from "./scripts/share.inline"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const Share: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
  return <></>
}

Share.afterDOMLoaded = shareScript

export default (() => Share) satisfies QuartzComponentConstructor
