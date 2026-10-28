import { getJson } from "serpapi";

// Pulls the year from "Authors - Venue, Year - domain"
function extractYear(summary) {
  if (!summary) return null;
  const maxYear = new Date().getFullYear() + 1;

  const parts = summary.split(/\s+-\s+/);

  for (let i = parts.length - 1; i >= 1; i--) {
    const m = parts[i].match(/(?:^|[\s,(])((?:1[5-9]|20)\d{2})\s*$/);
    if (m) {
      const year = Number(m[1]);
      if (year <= maxYear) return year;
    }
  }
  return null;
}

export async function googleSearch({ searchStr }) {
  const data = await getJson({
    engine: "google_scholar",
    q: searchStr.trim(),
    hl: "en",
    api_key: process.env.SERPAPI_KEY,
  });

  return (data.organic_results ?? []).map((r) => {
    const year = extractYear(r.publication_info?.summary);

    return {
      id: r.result_id,
      source: "Google Scholar",
      title: r.title,
      url: r.link,
      snippet: r.snippet,
      authors: r.publication_info?.authors?.map((a) => a.name) ?? [],
      summary: r.publication_info?.summary,
      citedBy: r.inline_links?.cited_by?.total,
      date: {
        date: year ? String(year) : null,
        yearStart: year,
        yearEnd: year,
        approximate: false,
      },
    };
  });
}
