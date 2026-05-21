import Image from "next/image";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-outline/30 bg-surface/80 backdrop-blur sticky top-0 z-30">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2.5 group">
          <Image
            src="/icon.png"
            alt="KOUP"
            width={36}
            height={36}
            className="rounded-xl shadow-md ring-1 ring-primary/30 transition-transform group-hover:scale-105"
            priority
          />
          <div className="leading-tight">
            <span className="block text-lg font-black tracking-tight text-primary">
              KOUP
            </span>
            <span className="block text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Réservation web
            </span>
          </div>
        </Link>
        <span className="hidden sm:inline text-xs text-muted-foreground">
          Style. Beauté. Instantané.
        </span>
      </div>
    </header>
  );
}
