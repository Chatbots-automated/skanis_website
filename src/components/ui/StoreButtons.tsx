import { APP_STORE_URL, PLAY_STORE_URL } from "@/lib/site";
import { cn } from "@/lib/utils";

function AppleLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 384 512" aria-hidden="true" className={className} fill="currentColor">
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
    </svg>
  );
}

function PlayLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 512 512" aria-hidden="true" className={className}>
      <path fill="#00d7fe" d="M48 59.5v393c0 6.3 3.7 11.7 9 14.3L284.6 256 57 45.2c-5.3 2.6-9 8-9 14.3z" />
      <path fill="#ffce00" d="M376.6 164.6 284.6 256l92 91.4 104.6-59.4c18.2-10.3 18.2-36.7 0-47z" />
      <path fill="#ff3a44" d="M284.6 256 57 466.8c5 2.4 11 2.4 16.4-.6l303.2-118.8z" />
      <path fill="#00f076" d="M376.6 164.6 73.4 45.8c-5.4-3-11.4-3-16.4-.6L284.6 256z" />
    </svg>
  );
}

const STORES = [
  { key: "apple", name: "Apple App Store", url: APP_STORE_URL, Logo: AppleLogo },
  { key: "google", name: "Google Play Store", url: PLAY_STORE_URL, Logo: PlayLogo },
] as const;

/**
 * App Store / Google Play buttons. Each one is a real link once its URL is set
 * (NEXT_PUBLIC_APP_STORE_URL / NEXT_PUBLIC_PLAY_STORE_URL); until then it is a
 * placeholder with a small "Netrukus" tag that isn't clickable.
 */
export function StoreButtons({
  className,
  tone = "dark",
  align = "center",
}: {
  className?: string;
  tone?: "dark" | "light";
  align?: "center" | "start";
}) {
  return (
    <div className={cn("flex flex-wrap gap-3", align === "center" ? "justify-center" : "justify-start", className)}>
      {STORES.map(({ key, name, url, Logo }) => {
        const inner = (
          <>
            <Logo className="size-[1.1rem] shrink-0" />
            <span className="font-semibold">{name}</span>
            {!url && (
              <span className={cn("rounded-full px-2 py-0.5 text-[0.68rem] font-bold", tone === "dark" ? "bg-white/15 text-white/80" : "bg-ink/[0.07] text-ink/60")}>
                Netrukus
              </span>
            )}
          </>
        );
        const base = cn(
          "inline-flex h-14 items-center gap-2.5 rounded-full px-7 text-[1.05rem] transition-[transform,background-color] duration-300",
          tone === "dark" ? "bg-ink text-white" : "bg-white text-ink",
        );
        return url ? (
          <a key={key} href={url} target="_blank" rel="noopener" className={cn(base, "hover:-translate-y-0.5 hover:bg-grape hover:text-white")}>
            {inner}
          </a>
        ) : (
          <span key={key} role="img" aria-label={`${name} – netrukus`} className={cn(base, "cursor-default")}>
            {inner}
          </span>
        );
      })}
    </div>
  );
}
