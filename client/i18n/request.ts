import { getRequestConfig } from "next-intl/server";
import { Locale, routing } from "./routing";
import { loadMessages } from "@/lib/load-messages";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as Locale)) {
    locale = routing.defaultLocale;
  }

  const messages = await loadMessages(locale as Locale);

  return {
    locale,
    messages,
  };
});
