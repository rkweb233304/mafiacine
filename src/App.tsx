import React, { useState, useEffect } from 'react';
import { 
  Play, Search, Menu, X, Settings, HelpCircle, 
  Home, Grid, History
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Movie {
  id: string;
  title: string;
  description: string;
  posterUrl: string;
  videoUrl: string;
  genre: string;
  rating: string;
  releaseYear: string;
  duration: string;
}

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/data');
      const { movies: movieData } = await res.json();
      if (movieData) {
        setMovies(movieData.map((row: any) => ({
          id: row[0], title: row[1], description: row[2], posterUrl: row[3],
          videoUrl: row[4], genre: row[5], rating: row[6], releaseYear: row[7], duration: row[8]
        })));
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-[#050505] border-b border-white/10 h-14 flex items-center justify-between px-4">
        <button onClick={() => setIsMenuOpen(true)} className="p-2"><Menu className="w-6 h-6" /></button>
        <h1 className="text-lg font-black text-[#E11D48] uppercase tracking-tighter">MAFIACINE</h1>
        <button className="p-2"><Search className="w-5 h-5" /></button>
      </header>

      {/* Sidebar Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMenuOpen(false)} className="fixed inset-0 z-50 bg-black/60" />
            <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} className="fixed top-0 left-0 h-full w-64 bg-[#050505] z-[60] border-r border-white/10 p-6 flex flex-col">
              <button onClick={() => setIsMenuOpen(false)} className="self-end p-2 mb-8"><X className="w-6 h-6" /></button>
              <div className="flex flex-col gap-6 text-sm font-bold uppercase tracking-widest">
                <button className="flex items-center gap-3"><Settings className="w-5 h-5" /> Settings</button>
                <button className="flex items-center gap-3"><HelpCircle className="w-5 h-5" /> Help</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="pb-20">
        {activeTab === 'home' && (
          <div className="px-4 pt-4">
            <h2 className="text-xl font-black uppercase mb-4">Trending</h2>
            <div className="grid grid-cols-2 gap-3">
              {movies.map(movie => (
                <div key={movie.id} className="relative aspect-[2/3] rounded-lg overflow-hidden bg-[#111]" onClick={() => setSelectedMovie(movie)}>
                  <img src={movie.posterUrl} className="w-full h-full object-cover" alt="" />
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#050505] border-t border-white/10 h-16 flex items-center justify-around">
        {[
          { id: 'home', icon: Home, label: 'Home' },
          { id: 'category', icon: Grid, label: 'Category' },
          { id: 'history', icon: History, label: 'History' },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex flex-col items-center ${activeTab === tab.id ? 'text-[#E11D48]' : 'text-white/40'}`}>
            <tab.icon className="w-5 h-5" />
            <span className="text-[9px] font-bold uppercase mt-1">{tab.label}</span>
          </button>
        ))}
      </nav>
      
      {/* Detail Overlay */}
      <AnimatePresence>
        {selectedMovie && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black flex flex-col">
            <button onClick={() => setSelectedMovie(null)} className="absolute top-4 right-4 p-2 bg-black/50 rounded-full"><X className="w-6 h-6" /></button>
            <img src={selectedMovie.posterUrl} className="w-full h-[50vh] object-cover" alt="" />
            <div className="p-6">
              <h2 className="text-2xl font-black uppercase mb-2">{selectedMovie.title}</h2>
              <p className="text-white/60 mb-6">{selectedMovie.description}</p>
              <button onClick={() => setIsPlaying(true)} className="w-full py-3 bg-[#E11D48] font-bold uppercase rounded-lg">Watch</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
