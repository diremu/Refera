import { getJson } from "serpapi";
import { requireEnv, PAGE_SIZE, safePage } from "./shared.ts";
import type { Result, SearchForm, SerpOrganicResult } from "./types.js";

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
  page,
}: SearchForm): Promise<Result[]> {
  const apiKey = requireEnv("SERPAPI_KEY");
  if (apiKey === "") throw new Error("SERPAPI_KEY is not set");
  const currentPage = safePage(page);
  const q = [
    searchStr.trim(),
    discipline && discipline !== "All" ? discipline : null,
    arOnly ? "articles" : null,
  ]
    .filter(Boolean)
    .join(" ");
    const data = await getJson({
      engine: "google_scholar",
      q,
      hl: "en",
      api_key: apiKey,
      start: currentPage * 10,
      num: String(PAGE_SIZE),
      ...(eraObject.yearStart !== null ? { as_ylo: eraObject.yearStart } : {}),
      ...(eraObject.yearEnd !== null ? { as_yhi: eraObject.yearEnd } : {}),
      json_restrictor: "organic_results, search_information",
      // can also add serpapi_pagination but unsure how to wield it for now
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
      citedBy: r.inline_links?.cited_by?.total ?? 0,
      date: {
        date: year ? String(year) : null,
        yearStart: year,
        yearEnd: year,
        approximate: false,
      },
    };
  });
}