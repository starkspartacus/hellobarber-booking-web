"use client";

import { Button } from "@/components/ui/Button";

export function AppOpenBanner({ slug }: { slug: string }) {
  const scheme = process.env.NEXT_PUBLIC_DEEP_LINK_SCHEME ?? "koup";
  const deepLink = `${scheme}://r/${slug}`;
  const playUrl =
    process.env.NEXT_PUBLIC_PLAY_STORE_URL ??
    "https://play.google.com/store/apps/details?id=com.koup.app";
  const appStoreUrl =
    process.env.NEXT_PUBLIC_APP_STORE_URL ?? "https://apps.apple.com/app/koup";

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-primary/30 bg-primary/10 p-4 animate-slide-up">
      <div className="flex-1 min-w-[200px]">
        <p className="text-sm font-bold text-primary">Application KOUP</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Ouvrez ce salon dans l&apos;app pour une expérience complète.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant="primary"
          onClick={() => {
            window.location.href = deepLink;
          }}
        >
          Ouvrir l&apos;app
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => window.open(playUrl, "_blank")}
        >
          Play Store
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => window.open(appStoreUrl, "_blank")}
        >
          App Store
        </Button>
      </div>
    </div>
  );
}
