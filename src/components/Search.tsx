import { IoSearchOutline } from "react-icons/io5";
import { GrFormNextLink } from "react-icons/gr";
import { useState } from 'react';

function Search() {
    const [searchStr, setSearchStr] = useState<string>('');
    const [prOnly, setPrOnly] = useState<boolean>(false);
    const [era, setEra] = useState<string>('All');
    const [discipline, setDiscipline] = useState<string>('All');
    return (
        <form className="border-b-[1.5px] border-solid pb-10 border-b-gray-200 " onSubmit="">
            <div className="px-2 py-2  m-4 shadow-md rounded-md w-[800px] mx-auto flex justify-start bg-white align-items-center border-[0.8px] border-gray-200">
                <IoSearchOutline className="my-auto mx-2" />                
                <input placeholder="One small step for man ..." className="px-4 py-3 w-[80%] focus:outline-none" value={searchStr} onChange={(e) => setSearchStr(e.target.value)}  />

                <button className='rounded-md text-white bg-[#0f172a] flex items-center py-3 px-4 font-grotesk ml-auto' type='submit'>Search <GrFormNextLink className="mx-2" /></button>
            </div>
            <div className="flex justify-around w-[70vw] max-w-[700px] flex-wrap mx-auto font-grotesk">
                <div className="bg-white px-4 py-1 rounded-3xl border-gray-300 border">
                    <label for="year" className="text-gray-400 mr-4">Era: </label>
                    <select id="year" className='focus:border-none options' onChange={(e) => setEra(e.target.value)}>
                        <option selected={true}>All</option>
                        <option>2020 till date</option>
                        <option>2010 till 2019</option>
                        <option>2000 till 2009</option>
                        <option>1990 till 1999</option>
                    </select>
                </div>
                <div className="bg-white px-4 py-1 rounded-3xl border-gray-300 border">
                    <input type="checkbox" id="peer-review" className='text-black bg-black' onChange={(e: Event) => { 
                        console.log(e.target.value)}} />
                        {/* checkbox 'currently bugged and not storing properly */}
                    <label for="peer-review" className="pl-2">Peer Reviewed Only</label>
                </div>
                <div className="bg-white px-4 py-1 rounded-3xl border-gray-300 border">
                    <label for="discipline" className="text-gray-400 mr-4">Discipline:</label>
                    <select id="discipline" className='focus:border-none options'>
                        <option selected={true}>All</option>
                        <option>Computer Science</option>
                        <option>Medicine</option>
                        <option>Law</option>
                    </select>
                </div>
            </div>
        </form>
    )
}

export default Search