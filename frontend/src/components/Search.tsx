import { IoSearchOutline } from "react-icons/io5";
import { FaArrowRight } from "react-icons/fa";
import { useState } from "react";
import { Result, ResultObject } from "./Result";
import { FaSpinner } from "react-icons/fa6";
// import { VscErrorSmall } from "react-icons/vsc";

function Search() {
  const [searchStr, setSearchStr] = useState<string>("");
  const [prOnly, setPrOnly] = useState<boolean>(false);
  const [era, setEra] = useState<string>("All");
  const [discipline, setDiscipline] = useState<string>("All");
  const [source, setSource] = useState<string>("All");
  const [error, setError] = useState<string>("");
  const [sortBy, setSortBy] = useState<"relevance" | "citations" | "recency">(
    "relevance",
  );
  const [searchResults, setSearchResults] = useState<ResultObject[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`http://localhost:3000/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ searchStr, prOnly, era, discipline, source }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error ?? `Request failed with a status code of ${res.status}`)
      };

      const data = await res.json();
      const list = data.results ?? [];
      setSearchResults(list);

      const messages: string[] = (data.errors ?? []).map(
        (er: { source: string; message: string }) =>
          `${er.source}: ${er.message}`,
      );
      if (list.length === 0) messages.unshift("No results. Try another query.");
      setError(messages.join("\n"));
    } catch (err) {
      setSearchResults([]);
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div>
      <form
        className="border-b-[1.5px] border-solid pb-10 border-b-gray-200 "
        onSubmit={onSubmit}
      >
        <div className="px-2 py-2 m-4 shadow-md md:rounded-md rounded-xl  md:w-[70vw] w-[90vw] mx-auto flex justify-start bg-white align-items-center border-[0.8px] border-gray-200">
          <IoSearchOutline className="my-auto mx-2" />
          <input
            placeholder="One small step for man ..."
            className="px-4 py-3 w-[80%] focus:outline-none"
            value={searchStr}
            onChange={(e) => setSearchStr(e.target.value)}
          />

          <button
            className="rounded-md text-white bg-[#0f172a] flex items-center py-3 px-4 font-grotesk ml-auto"
            type="submit"
          >
            Search <FaArrowRight className="mx-2" />
          </button>
        </div>
        <div className="flex justify-around w-[80vw] max-w-175 flex-wrap gap-2 md:gap-0 mx-auto font-grotesk">
          <div className="bg-white px-4 py-1 rounded-3xl border-gray-300 border mt-4">
            <label htmlFor="year" className="text-gray-400 mr-4">
              Era:{" "}
            </label>
            <select
              id="year"
              className="focus:border-none options"
              onChange={(e) => setEra(e.target.value)}
              value={era}
            >
              <option>All</option>
              <option>2020 - date</option>
              <option>2010 - 2019</option>
              <option>2000 - 2009</option>
              <option>1990 - 1999</option>
              <option>600 - 1699</option>

            </select>
          </div>
          <div className="bg-white px-4 py-1 rounded-3xl border-gray-300 border mt-4">
            <input
              type="checkbox"
              id="peer-review"
              className="text-black bg-black"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setPrOnly(e.target.checked);
              }}
            />
            {/* checkbox 'currently bugged and not storing properly */}
            <label htmlFor="peer-review" className="pl-2">
              Peer Reviewed Only
            </label>
          </div>
          <div className="bg-white px-4 py-1 rounded-3xl border-gray-300 border mt-4">
            <label htmlFor="discipline" className="text-gray-400 mr-4">
              Discipline:
            </label>
            <select
              id="discipline"
              value={discipline}
              className="focus:border-none options"
              onChange={(e) => setDiscipline(e.target.value)}
            >
              <option>All</option>
              <option>Computer Science</option>
              <option>Medicine</option>
              <option>Law</option>
            </select>
          </div>
          <div className="bg-white px-4 py-1 rounded-3xl border-gray-300 border mt-4">
            <label htmlFor="source" className="text-gray-400 mr-4">
              Source:
            </label>
            <select
              id="source"
              value={source}
              className="focus:border-none options"
              onChange={(e) => setSource(e.target.value)}
            >
              <option>All</option>
              <option>Google Scholar</option>
              <option>Bodleian Library</option>
              <option>OpenAlex</option>
            </select>
          </div>
        </div>
      </form>
      <div>
        <div
          id="controls"
          className="flex justify-between md:w-200 md:max-w-[70vw] w-[90vw] mx-auto font-grotesk mt-6 mb-4 border-b border-b-gray-200"
        >
          <p className="text-wrap">
            {searchResults.length} findings found across{" "}
            {source == "All" ? "all sources" : `the  ${source}`}
          </p>
          <span>
            <label htmlFor="sortBy" className=" text-gray-400 text-sm mr-4">
              Sort by:
            </label>
            <select
              id="sortBy"
              value={sortBy}
              className="text-sm focus:border-none options"
              onChange={(e) =>
                setSortBy(
                  e.target.value as "relevance" | "citations" | "recency",
                )
              }
            >
              <option value="relevance">Relevance</option>
              <option value="citations">Most Cited</option>
              <option value="recency">Most Recent</option>
            </select>
          </span>
        </div>
        <div id="results" className="flex flex-col gap-4 mb-4 items-center">
          {loading ? <FaSpinner className="text-2xl animate-spin" /> : null}
          {}
          {searchResults
            ? searchResults.map((re: ResultObject, index: number) => (
                <Result key={index} {...re} />
              ))
            : null}
        </div>
        <div
          id="pagination"
          className="flex justify-between align-center md:w-200 md:max-w-[70vw] w-[90vw] mx-auto font-grotesk text-gray-500 text-xs mt-2 mb-6"
        >
          <p className="text-wrap text-xs">Showing 1-5 of 85 results</p>
          <div className="flex gap-2">
            <button
              disabled
              className="min-w-10 p-2 border text-gray-300 border-gray-200 rounded-md"
            >
              Prev
            </button>
            <button className="min-w-10 p-2 border border-gray-200 rounded-md bg-black text-white">
              1
            </button>
            <button className="min-w-10 p-2 border border-gray-200 rounded-md">
              2
            </button>
            <button className="min-w-10 p-2 border border-gray-200 rounded-md">
              3
            </button>
            <span className="p-2">...</span>
            <button className="min-w-10 p-2 border border-gray-200 rounded-md">
              10
            </button>
            <button className="min-w-10 p-2 border border-gray-200 rounded-md">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Search;
