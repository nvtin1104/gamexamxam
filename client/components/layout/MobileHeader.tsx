"use client"
import { useTranslations } from "next-intl"
import { useState, useEffect } from "react"
import { Link } from "@/i18n/routing"
import { Menu, X } from "lucide-react"

export default function MobileHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const t = useTranslations("layout.header")

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isMenuOpen])

  return (
    <>
      <button
        className="md:hidden p-2 rounded-md hover:bg-white/10 transition-all duration-300"
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        {isMenuOpen ? (
          <X className="h-6 w-6 animate-in fade-in  rotate-in duration-300" />
        ) : (
          <Menu className="h-6 w-6 animate-in fade-in  duration-300" />
        )}
      </button>

      {isMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setIsMenuOpen(false)}
          />

           <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white dark:bg-gray-800 shadow-xl dark:shadow-gray-900/50 animate-in slide-in-from-right duration-300 ease-out">
             <div className="flex flex-col h-full">
               <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                 <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Menu</h2>
                 <button
                   onClick={() => setIsMenuOpen(false)}
                   className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                   aria-label="Close menu"
                 >
                   <X className="h-5 w-5" />
                 </button>
               </div>

              <nav className="flex-1 px-4 py-6 space-y-4 overflow-y-auto">
                <Link
                  href="/"
                  className="block px-4 py-3 text-lg font-medium text-gray-900 dark:text-white hover:bg-blue-50 dark:hover:bg-blue-900/50 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-all duration-200 animate-in fade-in slide-in-from-left"
                  style={{
                    animationDelay: "50ms",
                    animationFillMode: "both",
                  }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t("nav.home")}
                </Link>

                <div className="space-y-2">
                  <div
                    className="px-4 py-2 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide animate-in fade-in slide-in-from-left"
                    style={{
                      animationDelay: "100ms",
                      animationFillMode: "both",
                    }}
                  >
                    {t("nav.games")}
                  </div>
                  <div className="space-y-1">
                    <Link
                      href="/game/duck-race"
                      className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/50 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-all duration-200 animate-in fade-in slide-in-from-left"
                      style={{
                        animationDelay: "150ms",
                        animationFillMode: "both",
                      }}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t("games.duckRace")}
                    </Link>
                    <Link
                      href="/game/flip-card"
                      className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/50 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-all duration-200 animate-in fade-in slide-in-from-left"
                      style={{
                        animationDelay: "200ms",
                        animationFillMode: "both",
                      }}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t("games.flipCard")}
                    </Link>
                    <Link
                      href="/game/memory-game"
                      className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/50 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-all duration-200 animate-in fade-in slide-in-from-left"
                      style={{
                        animationDelay: "250ms",
                        animationFillMode: "both",
                      }}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t("games.memoryGame")}
                    </Link>
                  </div>
                </div>

                <Link
                  href="/contact"
                  className="block px-4 py-3 text-lg font-medium text-gray-900 dark:text-white hover:bg-blue-50 dark:hover:bg-blue-900/50 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-all duration-200 animate-in fade-in slide-in-from-left"
                  style={{
                    animationDelay: "300ms",
                    animationFillMode: "both",
                  }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t("nav.contact")}
                </Link>
              </nav>

              <div
                className="p-4 border-t border-gray-200 dark:border-gray-700 animate-in fade-in slide-in-from-left"
                style={{
                  animationDelay: "350ms",
                  animationFillMode: "both",
                }}
              >
                <div className="text-center text-sm text-gray-500 dark:text-gray-400">GameXamXam</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
