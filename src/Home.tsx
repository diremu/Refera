import Navbar from './components/Navbar'
import Search from './components/Search.tsx'
import Footer from './components/Footer.tsx'

function Home() {
  return (
    <div>
      <Navbar />
      <main className='my-6 mx-auto text-center'>
        <p className='font-jbmono text-[#64748b] uppercase'>Academic Media Searcher</p>
        <h1 className='font-newsreader text-4xl mb-2'>In-Text Paper & Passage Search</h1>
        <p className='font-grotesk letter-spacing-2 text-[#64748b]'>Locate Verbatim passages, verified page citations, and canonical quotes across academic press releases.</p>
      </main>
      <Search />
      <Footer/>
    </div>
  );
}

export { Home };
