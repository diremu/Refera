import type { Result } from "./types.js";
import type { SearchForm } from "./types.js";

type DateInfo = Result["date"];

interface BodleianMember {
  id: string;
  shelfmark?: string;
  displayFields?: {
    title?: string[];
    snippet?: string[];
    people?: (string | null)[];
    dateStatement?: string[];
  };
}

interface BodleianResponse {
  totalItems?: number;
  member?: BodleianMember[];
}

  function requireEnv(name: string): string {
    const value = process.env[name];
    if (!value) throw new Error(`${name} is not set`);
    return value;
  }

const MAX_YEAR = new Date().getFullYear() + 1;

const first = (v: string | string[] | null | undefined): string | null =>
  (Array.isArray(v) ? v[0] : v) ?? null;

const stripTags = (s: string | null | undefined): string | null =>
  s?.replace(/<[^>]*>/g, "") ?? null;

export function parseBodleianDate(
  raw: string | string[] | null | undefined,
): DateInfo {
  const text = ([] as string[]).concat(raw ?? []).join("; ").trim();
  const empty: DateInfo = {
    date: null,
    yearStart: null,
    yearEnd: null,
    approximate: false,
  };
  if (!text) return empty;

  const approximate = /\bc\.|\bcirca\b|\bapprox|\?/i.test(text);
  const make = (start: number, end: number): DateInfo => ({
    date: text,
    yearStart: start,
    yearEnd: end,
    approximate,
  });

  // 1. Explicit A.D. year wins over calendar-era noise ("savata 1883 / A.D. 1827")
  const ad = text.match(/A\.?\s?D\.?\s*(\d{3,4})/i);
  if (ad) return make(Number(ad[1]), Number(ad[1]));

  // 2. Centuries: "16th century", "15th and 16th century", "15th century, end"
  if (/century/i.test(text)) {
    const nums = [...text.matchAll(/(\d{1,2})(?:st|nd|rd|th)/gi)].map((m) =>
      Number(m[1]),
    );
    if (nums.length) {
      return make((Math.min(...nums) - 1) * 100, Math.max(...nums) * 100 - 1);
    }
  }

  // 3. Short range: "1677-78" -> 1677-1678
  const short = text.match(/\b(\d{4})\s*[-–]\s*(\d{2})\b(?!\d)/);
  if (short) {
    const start = Number(short[1]);
    const end = Number(short[1].slice(0, 2) + short[2]);
    return make(start, end >= start ? end : start);
  }

  // 4. Any 3-4 digit numbers: "888", "1476–1500", "c.1660-1684", "[c. 1640]"
  const years = [...text.matchAll(/\b(\d{3,4})\b/g)]
    .map((m) => Number(m[1]))
    .filter((y) => y >= 1 && y <= MAX_YEAR);
  if (years.length) return make(Math.min(...years), Math.max(...years));

  return { ...empty, date: text }; // unparseable, still show the raw text
}

export default async function bodleianSearch({
  searchStr,
  eraObject,
  page,
}: SearchForm): Promise<Result[]> {
  const baseUrl = requireEnv("BODLEIAN_API");
  const params = new URLSearchParams({ q: searchStr.trim() });

  // the request body is untrusted, so tolerate a missing era object
  const { yearStart, yearEnd } = eraObject ?? { yearStart: null, yearEnd: null };
  if (yearStart !== null || yearEnd !== null) {
    let from: number | "*" = yearStart ?? "*";
    let to = yearEnd ?? new Date().getFullYear();
    if (from !== "*" && from > to) [from, to] = [to, from];
    params.append("fq", `date:[${from} TO ${to}]`);
  }
  if (page && page > 1) params.set("page", String(page));

  const res = await fetch(`${baseUrl}/search/?${params}`, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(10000),
  });

  if (!res.ok) {
    throw new Error(`Bodleian request failed with status ${res.status}`);
  }
  const contentType = res.headers.get("content-type") ?? "";
  if (!contentType.includes("json")) {
    throw new Error("Bodleian API returned a non-JSON response");
  }

  const data = (await res.json()) as BodleianResponse;

  if (!Array.isArray(data.member)) {
    if (data.totalItems === 0) return []; // a genuine empty result omits `member`
    throw new Error(
      `Unexpected Bodleian response shape: keys = ${Object.keys(data)}`,
    );
  }

  return data.member.map((item): Result => {
    const f = item.displayFields ?? {};
    return {
      id: item.id.split("/").filter(Boolean).pop() ?? item.id,
      source: "Bodleian Library",
      title: (stripTags(first(f.title)) ?? "Untitled").slice(0, 100),
      url: item.id,
      snippet: stripTags(f.snippet?.join(" ")) ?? "",
      authors: (f.people ?? []).filter((p): p is string => Boolean(p)),
      date: parseBodleianDate(f.dateStatement),
    };
  });
}