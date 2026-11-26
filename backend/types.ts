export type SourceName = "Google Scholar" | "OpenAlex" | "Bodleian Library";

export interface EraObject {
  yearStart: number | null;
  yearEnd: number | null;
}

export interface SearchForm {
  searchStr: string;
  eraObject: EraObject;
  arOnly: boolean;
  discipline: string;
  source: SourceName | "All";
  page: number;
}

export interface Result {
  id: string;
  source: SourceName;
  title: string;
  url: string;
  snippet: string;
  authors: string[];
  summary?: string;
  citedBy?: number;
  doi?: string;
  type?: string;
  sources?: SourceName[];
  date: {
    date: string | null;
    yearStart: number | null;
    yearEnd: number | null;
    approximate: boolean;
  };
}

export interface OpenAlexResult {
    id: string;
    doi: string | null;
    title: string;
    display_name: string;
    authorships: string[];
    publication_year: number | null;
    publication_date: Date | null;
    cited_by_count: number | null;
    abstract_inverted_index: Record<string, number[]> | null;
    primary_location: {
        doi: string | null;
        id: string | null;
        is_accepted: boolean;
        is_oa: boolean;
        is_published: boolean;
        landing_page_url: string | null;
        source: {
            id: string | null;
            display_name: string | null;
            issn_l: string | null;
            type: string | null;
        }
    } | null;
    type: string | null
}

export interface SerpOrganicResult {
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

export interface BodleianMember {
  id: string;
  shelfmark?: string;
  displayFields?: {
    title?: string[];
    snippet?: string[];
    people?: (string | null)[];
    dateStatement?: string[];
  };
}

export interface BodleianResponse {
  totalItems?: number;
  member?: BodleianMember[];
}
