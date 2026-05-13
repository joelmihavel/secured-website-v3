import Image from "next/image"

export function Footer() {
  return (
    <footer className="border-t border-border bg-background px-5 py-10 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 text-center">
        <Image
          src="/flent-logo.png"
          alt="Flent"
          width={80}
          height={32}
          className="h-8"
          style={{ width: "auto" }}
        />
        <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
          Fully furnished designer homes in Bangalore for folks looking
          for a better living.
        </p>
        <a
          href="https://flent.in"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-flent-green transition-colors hover:text-flent-green/80"
        >
          flent.in
        </a>
      </div>
    </footer>
  )
}
