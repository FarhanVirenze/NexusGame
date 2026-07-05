const CATEGORY_STYLES = {
  MOBA: 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-blue-500/30',
  FPS: 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-red-500/30',
  RPG: 'bg-gradient-to-r from-purple-600 to-violet-500 text-white shadow-purple-500/30',
  'Battle Royale': 'bg-gradient-to-r from-amber-500 to-yellow-400 text-amber-950 shadow-amber-500/30',
  Hot: 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-rose-500/30',
  Trending: 'bg-gradient-to-r from-emerald-500 to-teal-400 text-white shadow-emerald-500/30',
  Sale: 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-orange-500/30',
};

const DEFAULT_STYLE = 'bg-gradient-to-r from-primary to-primary-container text-white shadow-primary/30';

export function getCategoryStyle(category) {
  if (!category) return DEFAULT_STYLE;
  return CATEGORY_STYLES[category] || DEFAULT_STYLE;
}

export function getUniqueCategories(games) {
  return [...new Set(games.map(g => g.category).filter(Boolean))].sort();
}
