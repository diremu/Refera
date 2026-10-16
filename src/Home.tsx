import Navbar from './components/Navbar'
import Search from './components/Search.tsx'

function Home() {
  return (
    <div>
      <Navbar />
      <div className='my-6 mx-auto text-center'>
        <p className='font-jbmono text-[#64748b] uppercase'>Academic Media Searcher</p>
        <h1 className='font-newsreader text-4xl mb-2'>In-Text Paper & Passage Search</h1>
        <p className='font-grotesk letter-spacing-2 text-[#64748b]'>Locate Verbatim passages, verified page citations, and canonical quotes across academic press releases.</p>
      </div>
      <Search />
    </div>
  );
}

export { Home };
