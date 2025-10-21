import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import { Gamepad2, Zap, Brain, RotateCcw } from "lucide-react";

export default async function HomePage() {
  const t = await getTranslations("home");

  const games = [
    {
      id: "duck-race",
      name: t("games.duckRace.name"),
      description: t("games.duckRace.description"),
      icon: Zap,
      href: "/game/duck-race",
      color: "from-yellow-400 to-orange-500"
    },
    {
      id: "flip-card",
      name: t("games.flipCard.name"),
      description: t("games.flipCard.description"),
      icon: RotateCcw,
      href: "/game/flip-card",
      color: "from-blue-400 to-purple-500"
    },
    {
      id: "memory-game",
      name: t("games.memoryGame.name"),
      description: t("games.memoryGame.description"),
      icon: Brain,
      href: "/game/memory-game",
      color: "from-green-400 to-teal-500"
    }
  ];

  return (
    <div className="min-h-screen bg-background-secondary">
      <section className="relative overflow-hidden bg-background-secondary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Gamepad2 className="h-16 w-16 text-yellow-300" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {t("hero.title")}
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 dark:text-blue-200 mb-8 max-w-3xl mx-auto">
              {t("hero.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/game/duck-race"
                className="bg-yellow-400 hover:bg-yellow-500 dark:bg-yellow-500 dark:hover:bg-yellow-400 text-gray-900 dark:text-gray-900 font-bold py-3 px-8 rounded-lg transition-colors duration-200"
              >
                {t("hero.cta.playNow")}
              </Link>
              <Link
                href="/contact"
                className="border-2 border-white hover:bg-white hover:text-blue-600 dark:hover:text-blue-800 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200"
              >
                {t("hero.cta.contact")}
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t("games.title")}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t("games.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {games.map((game) => {
              const IconComponent = game.icon;
              return (
                <Link
                  key={game.id}
                  href={game.href as any}
                  className="group relative bg-background rounded-2xl shadow-lg hover:shadow-2xl dark:shadow-gray-900/50 transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-0 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity duration-300`}></div>
                  <div className="relative p-8">
                    <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${game.color} text-white mb-6`}>
                      <IconComponent className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      {game.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      {game.description}
                    </p>
                    <div className="flex items-center text-blue-600 dark:text-blue-400 font-semibold group-hover:text-blue-800 dark:group-hover:text-blue-300 transition-colors">
                      {t("games.playButton")}
                      <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t("features.title")}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t("features.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex p-4 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 mb-4">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{t("features.fast.title")}</h3>
              <p className="text-gray-600 dark:text-gray-300">{t("features.fast.description")}</p>
            </div>

            <div className="text-center">
              <div className="inline-flex p-4 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 mb-4">
                <Brain className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{t("features.brain.title")}</h3>
              <p className="text-gray-600 dark:text-gray-300">{t("features.brain.description")}</p>
            </div>

            <div className="text-center">
              <div className="inline-flex p-4 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 mb-4">
                <Gamepad2 className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{t("features.diverse.title")}</h3>
              <p className="text-gray-600 dark:text-gray-300">{t("features.diverse.description")}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}