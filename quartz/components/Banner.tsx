import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

interface Options {
  text: string
  buttonText: string
  href: string
}

export default ((opts?: Options) => {
  const Banner: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
    const text = opts?.text ?? "Support this project"
    const buttonText = opts?.buttonText ?? "Donate"
    const href = opts?.href ?? "#"

    return (
      <div class={`donate-banner ${displayClass ?? ""}`}>
        <span class="banner-text">{text}</span>
        <a href={href} class="banner-button" target="_blank" rel="noopener noreferrer">
          {buttonText}
        </a>
      </div>
    )
  }

  Banner.css = `
    .site-banner {
      width: 100%;
    }

    .donate-banner {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      padding: 0.6rem 1rem;
      background: linear-gradient(135deg, var(--secondary) 0%, var(--tertiary) 100%);
      color: var(--light);
      font-size: 0.9rem;
      flex-wrap: wrap;
      width: 100%;
      box-sizing: border-box;
    }

    .donate-banner .banner-text {
      font-weight: 500;
    }

    .donate-banner .banner-button {
      display: inline-block;
      padding: 0.4rem 1rem;
      background: var(--light);
      color: var(--secondary);
      border-radius: 4px;
      font-weight: 600;
      text-decoration: none;
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }

    .donate-banner .banner-button:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    }

    @media (max-width: 800px) {
      .donate-banner {
        padding: 0.5rem 0.75rem;
        font-size: 0.85rem;
        gap: 0.75rem;
      }

      .donate-banner .banner-button {
        padding: 0.35rem 0.8rem;
      }
    }
  `

  return Banner
}) satisfies QuartzComponentConstructor
