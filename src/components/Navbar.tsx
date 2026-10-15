import {IoIosNotifications} from 'react-icons/io'
import {useState} from 'react'

function Navbar() {
    const active = 'bg-[#eff4ff] bg-surface-container-low text-[#0f172a]'

    return <>
        <nav className="px-12 py-4 flex justify-between items-center w-full">
            <div className="flex items-center space-x-4 h-20">
                <div id='title-bar' className="flex items-center space-x-2">
                    <img src='../../public/popup-bg.jpg' className="w-10 h-10 rounded-md" />
                    <div className="flex flex-col justify-items-center ">
                        <h1 className="font-newsreader text-4xl py-0">Refera</h1>
                        <span className="font-jbmono text-[#64748b]">Reference Finder</span>
                    </div>
                </div>
                <ul className="flex items-center space-x-4 font-grotesk h-full list-none">
                    <li className="text-wrap hover:bg-[#f1f5f9] text-[#64748b] hover:text-[#1e293b] h-full flex items-center font-semibold text-center transition-colors duration-150 rounded-md ">Search Monograph Corpus</li>
                    <li className="text-wrap hover:bg-[#f1f5f9] text-[#64748b] hover:text-[#1e293b] h-full flex items-center font-semibold text-center transition-colors duration-150 rounded-md">In-Text Passage Finder</li>
                    <li className="text-wrap hover:bg-[#f1f5f9] text-[#64748b] hover:text-[#1e293b] h-full flex items-center font-semibold text-center transition-colors duration-150 rounded-md">Citation Workbench</li>
                </ul>
            </div>
            <div>
                <ul className="flex items-center space-x-4">
                    <li><input type="text" placeholder="Search..." className="px-4 py-2  placeholder:text-[#64748B] bg-[#f8fafc] rounded-sm font-jbmono placeholder:font-jbmono shadow-sm" /></li>
                    <li><IoIosNotifications className="w-8 h-8" /></li>
                    <li><button><img src="../../public/popup-bg.jpg" alt="User" className="w-14 h-auto rounded-3xl border-3 border-gray-400" /></button></li>
                </ul>
            </div>
        </nav>
    </>
}

export default Navbar;