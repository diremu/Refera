import { getJson } from "serpapi";
import type { Result, SearchForm } from "./types.js";

interface SerpOrganicResult {
  result_id: string;
  title: string;
  link?: string;
  snippet?: string;
  publication_info?: {
    summary?: string;
    authors?: { name: string }[];
  };
  inline_links?: { cited_by?: { total?: number } };
}

function extractYear(summary: string | null | undefined): number | null {
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

export async function googleSearch({
  searchStr,
  eraObject,
  discipline,
  arOnly,
}: SearchForm): Promise<Result[]> {
  const apiKey = process.env.SERPAPI_KEY;
  if (!apiKey) throw new Error("SERPAPI_KEY is not set");

  const q = [
    searchStr.trim(),
    discipline && discipline !== "All" ? discipline : null,
    arOnly ? " articles" : null,
  ]
    .filter(Boolean)
    .join(" ");

  const data = await getJson({
    engine: "google_scholar",
    q,
    hl: "en",
    api_key: apiKey,
    ...(eraObject.yearStart !== null ? { as_ylo: eraObject.yearStart } : {}),
    ...(eraObject.yearEnd !== null ? { as_yhi: eraObject.yearEnd } : {}),
  });

  const organic: SerpOrganicResult[] = data.organic_results ?? [];

  return organic.map((r): Result => {
    const year = extractYear(r.publication_info?.summary);

    return {
      id: r.result_id,
      source: "Google Scholar",
      title: r.title,
      url: r.link ?? "",
      snippet: r.snippet ?? "",
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