import { CiBookmark } from "react-icons/ci";
import { IoBookmark } from "react-icons/io5";
import { GoCopy } from "react-icons/go";
import { FaArrowRight } from "react-icons/fa";

function Result() {
  return (
    <div className="w-200 max-w-[50vw] bg-white border-gray-200 border rounded-md p-4">
      <div className="flex flex-col">
        <div className="flex justify-between items-center">
          <h3 className='text-xl font-newsreader'>Epistemic Injustice: Power and the Ethics of Knowing</h3>
          <CiBookmark className="text-gray-500 hover:text-black " />
        </div>
        <p className='text-sm flex gap-1.5 justify-start'>
          Miranda Fricker<span className="italic text-gray-500">Oxford University Press,</span><span className='text-gray-500'> 2007, p. 148</span>
        </p>
      </div>
      <div className="my-4 ml-2 pl-2 border-l-2 border-solid border-yellow-500">
        <p className="text-left">
          "Hermeneutical injustice occurs at a prior stage, when a speaker's
          attempt to make sense of a social experience is impeded by a lacuna in
          collective hermeneutical resources—that is, a gap in available
          understanding that leaves their experience obscure both to themselves
          and to others. When this occurs as a result of structural prejudice,
          we witness hermeneutical marginalization, which unjustly impairs the
          subject's ability to contribute meaningfully to communal
          meaning-making."
        </p>
        <p className="text-sm font-jbmono text-gray-500 flex justify-start -ml-1">
          Chapter 7: Hermeneutical Injustice · § 7.2 The Structural Dimension
        </p>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            Cite <GoCopy />
          </span>
          <span className="flex items-center gap-2">
            View in Context (p.148) <FaArrowRight />
          </span>
        </div>
        <div className="flex gap-4 text-sm text-gray-500">
          <span>4,120 citations</span>
          <span>12 chapters</span>
        </div>
      </div>
    </div>
  );
}

export default Result;
