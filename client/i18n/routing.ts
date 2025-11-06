import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["vi", "en"],

  defaultLocale: "vi",
  pathnames: {
    "/": {
      en: "/",
      vi: "/",
    },
    "/contact": {
      en: "/contact-me",
      vi: "/lien-he",
    },
    "/game/duck-race": {
      en: "/game/duck-race",
      vi: "/tro-choi/dua-vit",
    },
    "/game/flip-card": {
      en: "/game/flip-card",
      vi: "/tro-choi/doi-anh",
    },
    "/game/memory-game": {
      en: "/game/memory-game",
      vi: "/tro-choi/do-mau",
    },
  },
});

export type Locale = (typeof routing.locales)[number];
export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
