import {disciplines} from './disciplines.js'

function rebuildAbstract(index) {
  if (!index) return "";
  const words = [];
  for (const [word, positions] of Object.entries(index)) {
    for (const p of positions) words[p] = word;
   }
  return words.filter(Boolean).join(" ");
}

function truncate(text, max = 300) {
  if (text.length <= max) return text;
  return text.slice(0, max).replace(/\s+\S*$/, "") + "…";
}

// "2010-2019" -> { from: 2010, to: 2019 }, "2020-date" -> { from: 2020, to: <this year> }
function parseEra(era) {
  if (!era || era === "All") return null;
  const [start, end] = era.split("-");
  const from = Number(start);
  const to = end === "date" ? new Date().getFullYear() : Number(end);
  if (!Number.isInteger(from) || !Number.isInteger(to) || from > to) return null;
  return { from, to };
}

export async function openAlexSearch({ searchStr, era, prOnly, page, discipline }) {
  const filters = [];

  const range = parseEra(era);
  if (range) {
    filters.push(`from_publication_date:${range.from}-01-01`);
    filters.push(`to_publication_date:${range.to}-12-31`);
  }
  if (prOnly === true) {
    filters.push("type:article"); 
  }
  const fieldId = disciplines[discipline]
  if (fieldId) filters.push(`topics.field.id:${fieldId}`)
  const params = new URLSearchParams({
    search: searchStr.trim(),
    per_page: "20",
    page: String(page ?? 1),
    select: [
      "id", "doi", "title", "display_name", "authorships",
      "publication_year", "publication_date", "cited_by_count",
      "abstract_inverted_index", "primary_location", "type",
    ].join(","),
    api_key: process.env.OPENALEX_KEY,
  });
  if (filters.length) params.set("filter", filters.join(","));

  const res = await fetch(`${process.env.OPENALEX_API}/works?${params}`, {
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) {
    throw new Error(`OpenAlex request failed with status ${res.status}`);
  }

  const data = await res.json();

  return (data.results ?? []).map((re) => {
    const year = re.publication_year ?? null;
    const venue = re.primary_location?.source?.display_name;
    const authors = (re.authorships ?? [])
      .map((a) => a.author?.display_name ?? a.raw_author_name)
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
      date: re.publication_date ?? (year ? String(year) : null),
      yearStart: year,
      yearEnd: year,
      approximate: false,
      doi: re.doi?.replace("https://doi.org/", "") ?? null,
      type: re.type,
    };
  });
}