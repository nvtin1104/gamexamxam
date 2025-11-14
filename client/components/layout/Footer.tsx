'use client';

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Gamepad2, Github, Mail } from "lucide-react";

export default function Footer() {
  const t = useTranslations("layout");

  return (
    <footer className="bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Gamepad2 className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">{t("title")}</span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md">
              {t("description")}
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-6 w-6" />
              </a>
              <a
                href="mailto:contact@minigameshub.com"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Email"
              >
                <Mail className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t("quickLinks")}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t("nav.home")}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t("contact")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">{t("game")}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/game/duck-race"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t("games.duckRace")}
                </Link>
              </li>
              <li>
                <Link
                  href="/game/flip-card"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t("games.flipCard")}
                </Link>
              </li>
              <li>
                <Link
                  href="/game/memory-game"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t("games.memoryGame")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 dark:border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 dark:text-gray-500 text-sm mb-4 md:mb-0">
              {t("copyright")}
            </p>
            <div className="flex items-center space-x-1 text-gray-400 dark:text-gray-500 text-sm">
              <span>{t("madeWith")}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
