import { disciplines } from "./disciplines.ts";
import type { Result, SearchForm, EraObject, OpenAlexResult } from "./types.js";

const pad = (y: number) => String(y).padStart(4, "0");

function rebuildAbstract(index: Record<string, number[]> | null): string {
  if (!index) return "";
  const words = [];
  for (const [word, positions] of Object.entries(index)) {
    for (const p of positions) words[p] = word;
  }
  return words.filter(Boolean).join(" ");
}

function truncate(text: string, max = 300): string {
  if (text.length <= max) return text;
  return text.slice(0, max).replace(/\s+\S*$/, "") + "…";
}

// "2010-2019" -> { from: 2010, to: 2019 }, "2020-date" -> { from: 2020, to: <this year> }
function parseEra(
  eraObject: EraObject,
): { from: number | null; to: number | null } | null {
  if (!eraObject) return null;
  const now = new Date().getFullYear();
  const from = Number.isInteger(eraObject.yearStart)
    ? eraObject.yearStart
    : null;
  const to =
    eraObject.yearEnd !== null && typeof eraObject.yearEnd === "number"
      ? Math.min(eraObject.yearEnd, now)
      : from !== null
        ? now
        : null; // an open end means "up to this year"

  if (from === null && to === null) return null; // "All Eras"
  if (from !== null && to !== null && from > to) return { from: to, to: from };
  return { from, to };
}

export async function openAlexSearch({
  searchStr,
  eraObject,
  arOnly,
  page,
  discipline,
}: SearchForm): Promise<Result[]> {
  const filters: string[] = [];

  const range = parseEra(eraObject);
  if (range?.from != null)
    filters.push(`from_publication_date:${pad(range.from)}-01-01`);
  if (range?.to != null)
    filters.push(`to_publication_date:${pad(range.to)}-12-31`);

  if (arOnly === true) filters.push("type:article");

  const fieldId = Object.hasOwn(disciplines, discipline)
    ? disciplines[discipline]
    : undefined;
  if (Number.isInteger(fieldId)) filters.push(`topics.field.id:${fieldId}`);
  function requireEnv(name: string): string {
    const value = process.env[name];
    if (!value) throw new Error(`${name} is not set`);
    return value;
  }

  // inside openAlexSearch, before `new URLSearchParams(...)`:
  const apiKey = requireEnv("OPENALEX_KEY");
  const params = new URLSearchParams({
    search: searchStr.trim(),
    per_page: "20",
    page: String(page ?? 1),
    select: [
      "id",
      "doi",
      "title",
      "display_name",
      "authorships",
      "publication_year",
      "publication_date",
      "cited_by_count",
      "abstract_inverted_index",
      "primary_location",
      "type",
    ].join(","),
    api_key: apiKey,
  });
  if (filters.length) params.set("filter", filters.join(","));

  const res = await fetch(`${process.env.OPENALEX_API}/works?${params}`, {
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) {
    throw new Error(`OpenAlex request failed with status ${res.status}`);
  }

  const data = await res.json();
  return (data.results ?? []).map((re: OpenAlexResult) => {
    const year = re.publication_year ?? null;
    const venue = re.primary_location?.source?.display_name;
    const authors = (re.authorships ?? [])
      .map((a: any) => a.author?.display_name ?? a.raw_author_name)
      .filter(Boolean);
    const byline = authors.slice(0, 3).join(", ");
    const where = [venue, year].filter(Boolean).join(", ");

    return {
      id: re.id.split("/").pop(),
      source: "OpenAlex",
      title: re.title ?? re.display_name ?? "Untitled",
      url: re.doi ?? re.primary_location?.landing_page_url ?? re.id,
      snippet: truncate(rebuildAbstract(re.abstract_inverted_index)),
      authors,
      summary: [byline, where].filter(Boolean).join(" - "),
      citedBy: re.cited_by_count ?? 0,
      date: {
        date: re.publication_date ?? (year ? String(year) : null),
        yearStart: year,
        yearEnd: year,
        approximate: false,
      },
      doi: re.doi?.replace("https://doi.org/", "") ?? undefined,
      type: re.type,
    };
  });
}
