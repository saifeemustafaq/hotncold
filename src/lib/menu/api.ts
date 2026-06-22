export const COLORS = {
  bg: "#091a0f",
  surface: "#0d2415",
  card: "#1a3a27",
  cardDeep: "#163020",
  border: "#2d5a3d",
  borderLight: "#1e3d28",
  gold: "#d4a017",
  goldLight: "#f0c842",
  text: "#f5f0e8",
  textMuted: "#8aab97",
  textFaint: "#5a7a68",
  textGhost: "#4a6a56",
};

export const MENU_EMOJIS: string[] = [
  "🍽️",
  "🥗",
  "🍛",
  "🍖",
  "🍗",
  "🍜",
  "🥘",
  "🍱",
  "🍣",
  "🥟",
  "🍰",
  "🧁",
  "🥙",
  "🍔",
  "🍕",
  "🥩",
  "🍝",
  "🍤",
  "🥤",
  "🎂",
  "🍮",
  "🥧",
  "🧆",
  "🫕",
];

export function formatPrice(price: number): string {
  return price % 1 === 0 ? `$${price}` : `$${price.toFixed(2)}`;
}

export function adminFetch(
  pin: string,
  url: string,
  options?: RequestInit
): Promise<Response> {
  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${pin}`,
      ...(options?.headers ?? {}),
    },
  });
}
