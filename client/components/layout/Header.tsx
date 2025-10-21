import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Gamepad2 } from "lucide-react";
import LocaleSwitcher from "../LocaleSwitcher";
import MobileHeader from "./MobileHeader";
import ModeToggle from "./theme-buton";

export default function Header() {
  const t = useTranslations("layout.header");

  return (
    <header className="bg-background text-foreground shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <Gamepad2 className="h-8 w-8" />
            <span className="text-xl font-bold">{t("title")}</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="hover:text-blue-200 dark:hover:text-blue-300 transition-colors duration-200 font-medium"
            >
              {t("nav.home")}
            </Link>

            <div className="relative group">
              <button className="flex items-center space-x-1 hover:text-blue-200 dark:hover:text-blue-300 transition-colors duration-200 font-medium">
                <span>{t("nav.games")}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg shadow-lg dark:shadow-gray-900/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  <Link
                    href="/game/duck-race"
                    className="block px-4 py-2 hover:bg-blue-50 dark:hover:bg-blue-900/50 transition-colors"
                  >
                    {t("games.duckRace")}
                  </Link>
                  <Link
                    href="/game/flip-card"
                    className="block px-4 py-2 hover:bg-blue-50 dark:hover:bg-blue-900/50 transition-colors"
                  >
                    {t("games.flipCard")}
                  </Link>
                  <Link
                    href="/game/memory-game"
                    className="block px-4 py-2 hover:bg-blue-50 dark:hover:bg-blue-900/50 transition-colors"
                  >
                    {t("games.memoryGame")}
                  </Link>
                </div>
              </div>
            </div>

            <Link
              href="/contact"
              className="hover:text-blue-200 dark:hover:text-blue-300 transition-colors duration-200 font-medium"
            >
              {t("nav.contact")}
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <LocaleSwitcher />
            <ModeToggle />
          </div>
        </div>

        <MobileHeader />
      </div>
    </header>
  );
}
