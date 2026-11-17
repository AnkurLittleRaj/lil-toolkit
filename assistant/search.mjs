const stop = new Set(
  "a an the is are was be to for of and or in on with how what which should i me my our it do does can use using please show little design system".split(
    " ",
  ),
);
const terms = (text) =>
  (text.toLowerCase().match(/[a-z0-9]+/g) || []).filter((t) => !stop.has(t));

/** Local keyword search is a free documentation fallback, not an AI answer. */
export function searchKnowledge(
  knowledge,
  question,
  framework = "all",
  limit = 5,
) {
  const query = [...new Set(terms(question))];
  if (!query.length) return [];
  const docs = knowledge.documents.filter(
    (d) =>
      d.framework === "all" || framework === "all" || d.framework === framework,
  );
  const indexed = docs.map((d) => ({
    d,
    words: terms(`${d.title} ${d.text}`),
  }));
  const avg = indexed.reduce((n, d) => n + d.words.length, 0) / indexed.length;
  return indexed
    .map(({ d, words }) => {
      let score = 0;
      for (const term of query) {
        const tf = words.filter((w) => w === term).length;
        if (!tf) continue;
        const df = indexed.filter((x) => x.words.includes(term)).length;
        score +=
          (Math.log(1 + (docs.length - df + 0.5) / (df + 0.5)) * tf * 2.2) /
          (tf + 1.2 * (0.25 + (0.75 * words.length) / avg));
        if (terms(d.title).includes(term)) score += 2;
      }
      return { ...d, score };
    })
    .filter((d) => d.score > 1)
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id))
    .slice(0, limit);
}
