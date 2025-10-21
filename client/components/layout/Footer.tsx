'use client';

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Gamepad2, Github, Mail, Heart } from "lucide-react";

export default function Footer() {
  const t = useTranslations("layout.footer");

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Gamepad2 className="h-8 w-8 text-blue-400 dark:text-blue-500" />
              <span className="text-xl font-bold">Mini Games Hub</span>
            </div>
            <p className="text-gray-300 dark:text-gray-400 mb-6 max-w-md">
              {t("description")}
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-300 transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-6 w-6" />
              </a>
              <a 
                href="mailto:contact@minigameshub.com" 
                className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-300 transition-colors"
                aria-label="Email"
              >
                <Mail className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white dark:text-gray-100">{t("quickLinks")}</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/" 
                  className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-200 transition-colors"
                >
                  {t("nav.home")}
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-200 transition-colors"
                >
                  {t("contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Games */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white dark:text-gray-100">{t("games")}</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/game/duck-race" 
                  className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-200 transition-colors"
                >
                  Duck Race
                </Link>
              </li>
              <li>
                <Link 
                  href="/game/flip-card" 
                  className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-200 transition-colors"
                >
                  Flip Card
                </Link>
              </li>
              <li>
                <Link 
                  href="/game/memory-game" 
                  className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-200 transition-colors"
                >
                  Memory Game
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 dark:border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 dark:text-gray-500 text-sm mb-4 md:mb-0">
              {t("copyright")}
            </p>
            <div className="flex items-center space-x-1 text-gray-400 dark:text-gray-500 text-sm">
              <span>{t("madeWith")}</span>
              <Heart className="h-4 w-4 text-red-500 dark:text-red-400" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
