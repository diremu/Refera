import { CiBookmark } from "react-icons/ci";
import { IoBookmark } from "react-icons/io5";
import { GoCopy } from "react-icons/go";
import { FaArrowRight } from "react-icons/fa";
import { useState } from "react";

export interface ResultObject {
  id: string,
  source: string, 
  title: string, 
  url: string, 
  snippet: string, 
  authors: string[], 
  summary: string, 
  citedBy?: number, 
  date: {
    date: string | null,
    yearStart: number | null,
    yearEnd: number | null,
    approximate: boolean
  }
}

function Result(data: ResultObject) {
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  return (
    <div className="md:w-200 md:max-w-[70vw] w-[90vw] min-w-50  bg-white border-gray-200 border rounded-md p-4">
      <div className="flex flex-col">
        <div className="flex justify-between items-start">
          <h3 className='text-xl font-newsreader'>{data.title}</h3>
          <button onClick={() => setIsBookmarked(!isBookmarked)}>
            {isBookmarked ? (
              <IoBookmark className="text-gray-500 hover:text-black mt-1 md:mt-0" />
            ) : (
              <CiBookmark className="text-gray-500 hover:text-black mt-1 md:mt-0" />
            )}
          </button>
        </div>
        <p className='text-sm flex gap-1.5 justify-start'>
          {/* {data.authors.length > 1 ? data.authors.join(", ") : data.authors[0]}<span className="italic text-gray-500">{data.source},</span><span className='text-gray-500'>{data.date.date}, {data.citedBy ?? ""}</span> */}
        </p>
      </div>
      <div className="my-4 ml-2 pl-4 border-l-2 border-solid border-yellow-500">
        <p className="text-left font-grotesk">
          "{data.snippet}"
        </p>
        <p className="text-sm font-jbmono text-gray-500 flex justify-start -ml-1 my-1 text-left">
          {data.summary}
        </p>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            Cite <GoCopy />
          </span>
          <a className="flex items-center gap-2 hover:text-black transition duration-300" href={`${data.url}`} target='_blank'>
            View (p.148) <FaArrowRight className="hidden md:block"/>
          </a>
        </div>
      </div>
    </div>
  );
}

export { Result };
