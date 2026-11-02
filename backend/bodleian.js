const first = (v) => (Array.isArray(v) ? v[0] : v) ?? null;
const stripTags = (s) => s?.replace(/<[^>]*>/g, "") ?? null;
const MAX_YEAR = new Date().getFullYear() + 1

export function parseBodleianDate(raw) {
  const text = [].concat(raw ?? []).join("; ").trim()
  const empty = { date: null, yearStart: null, yearEnd: null, approximate: false }
  if (!text) return empty

  const approximate = /\bc\.|\bcirca\b|\bapprox|\?/i.test(text)
  const make = (start, end) => ({ date: text, yearStart: start, yearEnd: end, approximate })

  // 1. Explicit A.D. year wins over calendar-era noise ("savata 1883 / A.D. 1827")
  const ad = text.match(/A\.?\s?D\.?\s*(\d{3,4})/i)
  if (ad) return make(Number(ad[1]), Number(ad[1]))

  // 2. Centuries: "16th century", "15th and 16th century", "15th century, end"
  if (/century/i.test(text)) {
    const nums = [...text.matchAll(/(\d{1,2})(?:st|nd|rd|th)/gi)].map(m => Number(m[1]))
    if (nums.length) {
      return make((Math.min(...nums) - 1) * 100, Math.max(...nums) * 100 - 1)
    }
  }

  // 3. Short range: "1677-78" -> 1677-1678
  const short = text.match(/\b(\d{4})\s*[-–]\s*(\d{2})\b(?!\d)/)
  if (short) {
    const start = Number(short[1])
    const end = Number(short[1].slice(0, 2) + short[2])
    return make(start, end >= start ? end : start)
  }

  // 4. Any 3-4 digit numbers: "888", "1476–1500", "c.1660-1684", "[c. 1640]"
  const years = [...text.matchAll(/\b(\d{3,4})\b/g)]
    .map(m => Number(m[1]))
    .filter(y => y >= 1 && y <= MAX_YEAR)
  if (years.length) return make(Math.min(...years), Math.max(...years))

  return { ...empty, date: text }   // unparseable, still show the raw text
}

async function bodleianSearch(formData) {
  let searchStr = new URLSearchParams({ q: formData.searchStr.trim() });
  let era = formData.era
  let queryString = `${process.env.BODLEIAN_API}/search/?${searchStr}`
  if (era && era !== 'All') {
    let [startYear, endYear] = era.split('-')
    queryString += `&fq=date:[${startYear} TO ${endYear === 'date' ? new Date().getFullYear() : endYear}]`
    console.log(queryString)
  }
  const res = await fetch(queryString, {
    headers: { Accept: "application/json" },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(
      `Bodleian request failed with a status code of ${res.status}`,
    );
  }
    console.log(queryString)
  console.log("totalItems:", data.totalItems, "| parsed query:", JSON.stringify(data.query));
  const contentType = res.headers.get("Content-Type") ?? " "
  if (!contentType.includes("json")) {
    console.log("Body Preview: ", body.slice(0, 300));
    throw new Error("Bodleian API returned wrong format");
  }
  if (!Array.isArray(data.member)) {
    if (data.totalItems === 0) {
      return []
    }
  throw new Error(`Unexpected Bodleian response shape: keys = ${Object.keys(data)}`);
  }
  const results = data.member ?? [];
  // include handling for related searches
  return results.map((result, index) => ({
    id: results[index].id.split('/')[results[index].id.split('/').length - 2] ?? '',
    source: "Bodleian Library",
    title: stripTags(first(result.displayFields?.title ?? 'Unnamed')).slice(0,100),
    url: result.id,
    snippet: stripTags(result.displayFields?.snippet?.join(' ')),
    authors: (result.displayFields?.people ?? []).filter(Boolean),
    date: parseBodleianDate(result.displayFields.dateStatement)
    // summary: result.publication_info?.summary,
    // citedBy: result.inline_links?.cited_by?.total,
  }));
}

export default bodleianSearch;