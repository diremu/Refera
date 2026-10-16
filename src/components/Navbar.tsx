import {IoIosNotifications} from 'react-icons/io'

function Navbar() {
    const active = 'bg-[#eff4ff] bg-surface-container-low text-[#0f172a]'
    return <>
        <nav className="px-12 py-2 flex justify-between items-center w-full border-[1.5px] border-gray-200">
            <div className="flex items-center space-x-4 h-20">
                <div id='title-bar' className="flex items-center space-x-2">
                    <img src='/popup-bg.jpg' className="w-10 h-10 rounded-md" />
                        <h1 className="font-newsreader text-4xl py-0 pr-2">Refera</h1>
                        <span className="font-jbmono text-[#64748b] text-center uppercase">Reference Finder</span>
                </div>
            </div>
                <ul className="flex items-center space-x-4 font-grotesk h-full list-none">
                    <li className="text-wrap hover:bg-[#f1f5f9] text-[#64748b] hover:text-[#1e293b] h-full flex items-center text-[18px] text-center transition-colors duration-150 rounded-md px-2 py-2">Search Corpus</li>
                    <li className="text-wrap hover:bg-[#f1f5f9] text-[#64748b] hover:text-[#1e293b] h-full flex items-center text-[18px] text-center transition-colors duration-150 rounded-md px-2 py-2">Passage Finder</li>
                    <li className="text-wrap hover:bg-[#f1f5f9] text-[#64748b] hover:text-[#1e293b] h-full flex items-center text-[18px] text-center transition-colors duration-150 rounded-md px-2 py-2">Workbench</li>
                </ul>
            <div>
                <ul className="flex items-center space-x-4">
                    <li><IoIosNotifications className="w-8 h-8" /></li>
                    <li><button><img src="/popup-bg.jpg" alt="User" className="w-14 h-auto rounded-3xl border-3 border-gray-400" /></button></li>
                </ul>
            </div>
        </nav>
    </>
}

export default Navbar;