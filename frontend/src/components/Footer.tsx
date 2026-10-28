import { MdManageSearch } from "react-icons/md";
import { HiOutlineDocumentSearch } from "react-icons/hi";
import { BsBookshelf } from "react-icons/bs";
import { CiExport } from "react-icons/ci";
import { useState } from "react"


function Footer() {
    const [isActive, setIsActive] = useState<"search" | "passage" | "workbench" >("search");
  return (
    <footer className="w-full mt-8 border-t border-gray-200 p-2 md:p-8 flex justify-between items-center font-grotesk">
      <div className="md:block hidden">
        <p>Refera</p>
        <ul className="flex gap-4 text-gray-500 text-sm">
          <li>Citation Standards</li>
          <li>Privacy Policy</li>
        </ul>
      </div>
      <div className="md:hidden flex flex-col gap-4 items-center w-full">
        <ul className="flex gap-4 justify-evenly w-full items-center ">
            <li className={`flex flex-col items-center ${
              isActive === "search" ? "text-[#050608] " : "hover:text-gray-700 text-gray-500"
            }`} onClick={() => setIsActive("search")}>
              <MdManageSearch /> Search
            </li>
            <li className={`flex flex-col items-center ${
              isActive === "passage" ? "text-[#050608] " : "hover:text-gray-700 text-gray-500"
            }`} onClick={() => setIsActive("passage")}>
              <HiOutlineDocumentSearch /> Passages
            </li>
            <li className={`flex flex-col items-center ${
              isActive === "workbench" ? "text-[#050608]" : "hover:text-gray-700 text-gray-500"
            }`} onClick={() => setIsActive("workbench")}>
              <BsBookshelf /> Workbench
            </li>
            {/* <li><CiExport /> Export</li> */}
        </ul>
      </div>
    </footer>
  );
}

export default Footer;
