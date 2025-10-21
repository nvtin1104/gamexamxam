import { Locale } from "@/i18n/routing";

// Cache để tránh load lại messages
const messagesCache = new Map<Locale, any>();

export async function loadMessages(locale: Locale) {
  // Kiểm tra cache trước
  if (messagesCache.has(locale)) {
    return messagesCache.get(locale);
  }

  // Import cả 2 file en và vi
  const [viConfig, enConfig] = await Promise.all([
    import(`@/messages/vi.json`),
    import(`@/messages/en.json`),
  ]);

  // Lấy config cho locale hiện tại
  const config = (viConfig.default as any)[locale] || (enConfig.default as any)[locale];
  
  if (!config) {
    throw new Error(`No configuration found for locale: ${locale}`);
  }

  // Load tất cả namespace files dựa trên config
  const [home, games, contact, common, layout] = await Promise.all([
    import(`@/messages/${config.home}`),
    import(`@/messages/${config.games}`),
    import(`@/messages/${config.contact}`),
    import(`@/messages/${config.common}`),
    import(`@/messages/${config.layout}`),
  ]);

  const messages = {
    home: home.default,
    games: games.default,
    contact: contact.default,
    common: common.default,
    layout: layout.default,
  };

  // Cache kết quả
  messagesCache.set(locale, messages);
  
  return messages;
}
