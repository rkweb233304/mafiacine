import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, Search, X, Volume2, VolumeX, Maximize, 
  Home, Grid, History, Bell, ChevronRight, Check,
  Target, Theater, Smile, Flame, Orbit, Heart, Skull, Castle, Sparkles, Video,
  Clock, ArrowLeft, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface Movie {
  id: string;
  title: string;
  description: string;
  posterUrl: string;
  videoUrl: string;
  genre: string;
  rating: string;
  releaseYear: string;
  duration: string;
  progress?: number; // 0 to 100
}

// High quality verified sample video streams for HTML5 video player
const SAMPLE_VIDEOS = [
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"
];

// Curated default movie catalog matching the exact UI in the screenshots
const DEFAULT_MOVIES: Movie[] = [
  {
    id: "jw4",
    title: "John Wick: Chapter 4",
    description: "Baba Yaga is back. John Wick uncovers a path to defeating The High Table, but must face a new enemy with powerful alliances across the globe.",
    posterUrl: "/src/assets/images/hero_action_city_1792889177755.jpg",
    videoUrl: SAMPLE_VIDEOS[0],
    genre: "Action",
    rating: "R",
    releaseYear: "2023",
    duration: "2h 49m",
    progress: 45
  },
  {
    id: "batman",
    title: "The Batman",
    description: "When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city's hidden corruption.",
    posterUrl: "/src/assets/images/poster_dark_vigilante_1792889178846.jpg",
    videoUrl: SAMPLE_VIDEOS[1],
    genre: "Crime",
    rating: "PG-13",
    releaseYear: "2022",
    duration: "1h 45m",
    progress: 60
  },
  {
    id: "endgame",
    title: "Avengers Endgame",
    description: "After the devastating events of Infinity War, the universe is in ruins. The remaining Avengers assemble once more to reverse Thanos' actions.",
    posterUrl: "/src/assets/images/cinematic_movie_placeholder_1792889155839.jpg",
    videoUrl: SAMPLE_VIDEOS[2],
    genre: "Action",
    rating: "PG-13",
    releaseYear: "2019",
    duration: "3h 01m",
    progress: 80
  },
  {
    id: "dune",
    title: "Dune",
    description: "Paul Atreides leads nomadic tribes in a battle to control the desert planet Arrakis and its precious spice resource.",
    posterUrl: "/src/assets/images/category_fantasy_v2_1792927439591.jpg",
    videoUrl: SAMPLE_VIDEOS[3],
    genre: "Sci-Fi",
    rating: "PG-13",
    releaseYear: "2021",
    duration: "2h 35m",
    progress: 25
  },
  {
    id: "joker",
    title: "Joker",
    description: "A mentally troubled stand-up comedian embarks on a downward spiral that leads to the creation of an iconic criminal mastermind.",
    posterUrl: "/src/assets/images/poster_gritty_clown_1792889177813.jpg",
    videoUrl: SAMPLE_VIDEOS[4],
    genre: "Drama",
    rating: "R",
    releaseYear: "2019",
    duration: "2h 02m",
    progress: 15
  },
  {
    id: "deadpool2",
    title: "Deadpool 2",
    description: "Wisecracking mercenary Deadpool battles the time-traveling soldier Cable to protect a young mutant with fiery abilities.",
    posterUrl: "/src/assets/images/movie_poster_cyber_heist_1792887901914.jpg",
    videoUrl: SAMPLE_VIDEOS[0],
    genre: "Comedy",
    rating: "R",
    releaseYear: "2018",
    duration: "1h 59m",
    progress: 0
  },
  {
    id: "interstellar",
    title: "Interstellar",
    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival on distant habitable worlds.",
    posterUrl: "/src/assets/images/poster_space_wave_1792889178331.jpg",
    videoUrl: SAMPLE_VIDEOS[1],
    genre: "Sci-Fi",
    rating: "PG-13",
    releaseYear: "2014",
    duration: "2h 49m",
    progress: 90
  },
  {
    id: "shawshank",
    title: "The Shawshank Redemption",
    description: "A banker convicted of double murder maintains his innocence and finds hope and friendship over two decades in Shawshank prison.",
    posterUrl: "/src/assets/images/movie_poster_noir_night_1792887901621.jpg",
    videoUrl: SAMPLE_VIDEOS[2],
    genre: "Drama",
    rating: "R",
    releaseYear: "1994",
    duration: "2h 22m",
    progress: 0
  },
  {
    id: "cyberheist",
    title: "Neon Override",
    description: "A high-stakes cybernetic robbery threatens to bring down the central grid of a sprawling futuristic megalopolis.",
    posterUrl: "/src/assets/images/poster_cyber_hacker_v2_1792889179490.jpg",
    videoUrl: SAMPLE_VIDEOS[3],
    genre: "Action",
    rating: "PG-13",
    releaseYear: "2026",
    duration: "1h 58m",
    progress: 35
  }
];

// Categories matching Screenshot 2
const CATEGORY_ITEMS = [
  { name: 'Action', count: '1,280', icon: Target, image: '/src/assets/images/hero_action_city_1792889177755.jpg' },
  { name: 'Drama', count: '1,045', icon: Theater, image: '/src/assets/images/poster_gritty_clown_1792889177813.jpg' },
  { name: 'Comedy', count: '980', icon: Smile, image: '/src/assets/images/movie_poster_cyber_heist_1792887901914.jpg' },
  { name: 'Thriller', count: '760', icon: Flame, image: '/src/assets/images/poster_dark_vigilante_1792889178846.jpg' },
  { name: 'Sci-Fi', count: '620', icon: Orbit, image: '/src/assets/images/poster_space_wave_1792889178331.jpg' },
  { name: 'Horror', count: '540', icon: Skull, image: '/src/assets/images/category_horror_v2_1792927439056.jpg' },
  { name: 'Romance', count: '480', icon: Heart, image: '/src/assets/images/hero_mafia_cine_1792887901456.jpg' },
  { name: 'Fantasy', count: '420', icon: Castle, image: '/src/assets/images/category_fantasy_v2_1792927439591.jpg' },
  { name: 'Animation', count: '390', icon: Sparkles, image: '/src/assets/images/category_animation_v2_1792927439517.jpg' },
  { name: 'Documentary', count: '310', icon: Video, image: '/src/assets/images/category_documentary_v2_1792927438470.jpg' },
];

export default function App() {
  const [movies, setMovies] = useState<Movie[]>(DEFAULT_MOVIES);
  const [activeTab, setActiveTab] = useState<'home' | 'category' | 'history'>('home');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [activePlayingMovie, setActivePlayingMovie] = useState<Movie | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [categoryFilterTab, setCategoryFilterTab] = useState<string>('All');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [heroIndex, setHeroIndex] = useState(0);
  const [historyList, setHistoryList] = useState<Movie[]>([]);
  const [showNotification, setShowNotification] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // HTML5 Video Player state
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  // Load history from localStorage
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('mafiacine_history');
      if (savedHistory) {
        setHistoryList(JSON.parse(savedHistory));
      } else {
        // default initial history
        setHistoryList(DEFAULT_MOVIES.slice(0, 4));
      }
    } catch {
      setHistoryList(DEFAULT_MOVIES.slice(0, 4));
    }
  }, []);

  // Fetch live Google Sheets data from /api/data
  const fetchSheetData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/data');
      if (!res.ok) throw new Error('Failed to fetch from API');
      const data = await res.json();
      
      if (data && Array.isArray(data.movies) && data.movies.length > 0) {
        const sheetMovies: Movie[] = data.movies
          .filter((row: any[]) => row && row.length > 1 && row[1])
          .map((row: any[], idx: number) => {
            // Validate video URL, fallback to reliable sample video if invalid or placeholder
            let rawVideo = String(row[4] || '').trim();
            const isValidUrl = rawVideo.startsWith('http://') || rawVideo.startsWith('https://');
            const videoUrl = isValidUrl ? rawVideo : SAMPLE_VIDEOS[idx % SAMPLE_VIDEOS.length];

            // Validate poster URL
            let rawPoster = String(row[3] || '').trim();
            const posterUrl = (rawPoster.startsWith('http') || rawPoster.startsWith('/')) 
              ? rawPoster 
              : DEFAULT_MOVIES[idx % DEFAULT_MOVIES.length].posterUrl;

            return {
              id: String(row[0] || `sheet-${idx}`),
              title: String(row[1] || 'Untitled Movie'),
              description: String(row[2] || 'A premium cinematic experience on MafiaCine.'),
              posterUrl,
              videoUrl,
              genre: String(row[5] || 'Action'),
              rating: String(row[6] || 'HD'),
              releaseYear: String(row[7] || '2024'),
              duration: String(row[8] || '2h 10m'),
              progress: 30
            };
          });

        if (sheetMovies.length > 0) {
          // Prepend Google Sheet movies so user's own data (e.g. Gadar) shows right at the top
          // Filter duplicates by title
          const sheetTitles = new Set(sheetMovies.map(m => m.title.toLowerCase()));
          const remainingDefaults = DEFAULT_MOVIES.filter(m => !sheetTitles.has(m.title.toLowerCase()));
          setMovies([...sheetMovies, ...remainingDefaults]);
        }
      }
    } catch (err) {
      console.warn('Using default catalog because Google Sheet is unavailable or empty:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSheetData();
  }, []);

  // Play a movie in the HTML5 player
  const startPlaying = (movie: Movie) => {
    setActivePlayingMovie(movie);
    setIsPlaying(true);
    setSelectedMovie(null);

    // Save to history
    setHistoryList(prev => {
      const filtered = prev.filter(m => m.id !== movie.id);
      const updated = [movie, ...filtered];
      try {
        localStorage.setItem('mafiacine_history', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Video player controls
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (!document.fullscreenElement) {
        videoRef.current.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Search filter
  const searchResults = searchQuery.trim() === '' 
    ? [] 
    : movies.filter(m => 
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.description.toLowerCase().includes(searchQuery.toLowerCase())
      );

  // Filtered movies for category tab
  const categoryMovies = selectedCategory === 'All'
    ? movies
    : movies.filter(m => m.genre.toLowerCase() === selectedCategory.toLowerCase());

  const featuredMovie = movies[heroIndex % movies.length] || DEFAULT_MOVIES[0];

  return (
    <div className="min-h-screen bg-[#050505] text-white font-['Montserrat',sans-serif] select-none text-xs pb-20">
      
      {/* TOP HEADER (Matching Screenshot 1 & 2) */}
      <header className="sticky top-0 z-40 bg-[#050505]/95 backdrop-blur-md border-b border-white/5 px-4 py-3 flex items-center justify-between">
        {/* Brand Logo with Mafia Hat Icon */}
        <div 
          onClick={() => { setActiveTab('home'); setSelectedCategory('All'); }}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="relative w-8 h-8 flex items-center justify-center">
            {/* Mafia Hat & Monogram */}
            <svg viewBox="0 0 100 100" className="w-8 h-8 fill-none">
              <path d="M20 50 Q50 30 80 50 L75 58 Q50 42 25 58 Z" fill="#ffffff" />
              <path d="M35 48 C35 30 65 30 65 48 Z" fill="#ffffff" />
              <path d="M32 46 Q50 40 68 46" stroke="#E11D48" strokeWidth="4" />
              <path d="M22 62 L32 88 L50 68 L68 88 L78 62" stroke="#E11D48" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <div className="flex items-baseline">
              <span className="text-base font-black tracking-tight text-white">Mafia</span>
              <span className="text-base font-black tracking-tight text-[#E11D48]">Cine</span>
            </div>
            <p className="text-[7px] font-bold tracking-[0.25em] text-white/40 uppercase -mt-1">
              MOVIES <span className="text-[#E11D48]">•</span> SERIES <span className="text-[#E11D48]">•</span> ALWAYS
            </p>
          </div>
        </div>

        {/* Action Icons: Refresh, Search, Notification */}
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchSheetData} 
            title="Refresh Data from Google Sheet"
            className={`p-2 rounded-full hover:bg-white/10 active:scale-95 transition-transform text-white/70 ${isLoading ? 'animate-spin text-[#E11D48]' : ''}`}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="p-2 rounded-full hover:bg-white/10 active:scale-95 transition-transform text-white/90"
          >
            <Search className="w-5 h-5" />
          </button>

          <button 
            onClick={() => setShowNotification(true)}
            className="p-2 rounded-full hover:bg-white/10 active:scale-95 transition-transform relative text-white/90"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#E11D48] rounded-full ring-2 ring-[#050505]" />
          </button>
        </div>
      </header>

      {/* ===================== TAB: HOME ===================== */}
      {activeTab === 'home' && (
        <main className="space-y-6">
          
          {/* HERO BANNER (Matching Screenshot 1) */}
          <section className="relative w-full h-[380px] overflow-hidden">
            <img 
              src={featuredMovie.posterUrl} 
              alt={featuredMovie.title}
              className="w-full h-full object-cover object-top"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = "/src/assets/images/hero_action_city_1792889177755.jpg";
              }}
            />
            {/* Cinematic Gradient Scrims */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/90 via-[#050505]/40 to-transparent" />

            {/* Hero Copy */}
            <div className="absolute bottom-6 left-0 right-0 px-4">
              <div className="flex items-center gap-2 text-[10px] font-bold text-white/70 tracking-[0.2em] uppercase mb-2">
                <span>{featuredMovie.genre}</span>
                <span className="text-[#E11D48]">•</span>
                <span>CRIME</span>
                <span className="text-[#E11D48]">•</span>
                <span>DRAMA</span>
              </div>

              <h2 className="text-3xl font-black uppercase tracking-tight text-white leading-none mb-1">
                {featuredMovie.title.toUpperCase()}
              </h2>
              <p className="text-xl font-black uppercase text-[#E11D48] tracking-tight mb-2">
                CHAPTER 4
              </p>

              <p className="text-xs text-white/70 line-clamp-2 max-w-xs mb-4 leading-relaxed">
                {featuredMovie.description}
              </p>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => startPlaying(featuredMovie)}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#E11D48] hover:bg-[#F43F5E] active:scale-95 transition-all text-white font-black text-xs uppercase tracking-wider rounded-full shadow-lg shadow-[#E11D48]/30"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Watch Now
                </button>
              </div>

              {/* Carousel Indicator Dots */}
              <div className="flex justify-center items-center gap-1.5 mt-5">
                {movies.slice(0, 5).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setHeroIndex(idx)}
                    className={`h-1.5 rounded-full transition-all ${idx === (heroIndex % 5) ? 'w-5 bg-[#E11D48]' : 'w-1.5 bg-white/30'}`}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* CONTINUE WATCHING SECTION (Matching Screenshot 1) */}
          <section className="px-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-1 h-4 bg-[#E11D48] rounded-full inline-block" />
                <h3 className="text-sm font-black uppercase tracking-wide text-white">Continue Watching</h3>
              </div>
              <button 
                onClick={() => setActiveTab('history')}
                className="text-[10px] font-bold text-[#E11D48] flex items-center gap-0.5 hover:underline"
              >
                See All <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            {/* Horizontal Scroll Cards */}
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
              {movies.slice(0, 5).map((movie, i) => (
                <div 
                  key={movie.id}
                  onClick={() => startPlaying(movie)}
                  className="w-[130px] shrink-0 cursor-pointer group"
                >
                  <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden border border-white/10 bg-[#111]">
                    <img 
                      src={movie.posterUrl} 
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "/src/assets/images/poster_dark_vigilante_1792889178846.jpg";
                      }}
                    />
                    
                    {/* Play Center Circle */}
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <div className="w-9 h-9 rounded-full bg-black/60 border border-white/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play className="w-4 h-4 fill-white text-white ml-0.5" />
                      </div>
                    </div>

                    {/* Red Progress Bar at Bottom */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                      <div 
                        className="h-full bg-[#E11D48]" 
                        style={{ width: `${movie.progress || (25 + i * 20)}%` }}
                      />
                    </div>
                  </div>

                  <h4 className="font-bold text-xs text-white truncate mt-2 leading-tight">
                    {movie.title}
                  </h4>
                  <p className="text-[10px] text-white/50 font-medium">
                    {movie.duration}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* TRENDING NOW SECTION (Matching Screenshot 1) */}
          <section className="px-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-1 h-4 bg-[#E11D48] rounded-full inline-block" />
                <h3 className="text-sm font-black uppercase tracking-wide text-white">Trending Now</h3>
              </div>
              <button 
                onClick={() => { setActiveTab('category'); setSelectedCategory('All'); }}
                className="text-[10px] font-bold text-[#E11D48] flex items-center gap-0.5 hover:underline"
              >
                See All <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            {/* 4 Cards Grid with HD Badges */}
            <div className="grid grid-cols-2 gap-3">
              {movies.slice(0, 4).map((movie) => (
                <div 
                  key={movie.id}
                  onClick={() => setSelectedMovie(movie)}
                  className="cursor-pointer group relative aspect-[2/3] rounded-xl overflow-hidden border border-white/10 bg-[#111]"
                >
                  <img 
                    src={movie.posterUrl} 
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/src/assets/images/poster_gritty_clown_1792889177813.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  {/* HD Badge */}
                  <span className="absolute bottom-2.5 right-2.5 px-1.5 py-0.5 bg-[#E11D48] text-white font-black text-[9px] rounded-sm shadow">
                    HD
                  </span>

                  {/* Title */}
                  <div className="absolute bottom-2.5 left-2.5 right-10">
                    <p className="font-bold text-xs text-white truncate leading-tight">
                      {movie.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* EXPLORE BY CATEGORY SECTION (Matching Screenshot 1) */}
          <section className="px-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-1 h-4 bg-[#E11D48] rounded-full inline-block" />
                <h3 className="text-sm font-black uppercase tracking-wide text-white">Explore by Category</h3>
              </div>
              <button 
                onClick={() => setActiveTab('category')}
                className="text-[10px] font-bold text-[#E11D48] flex items-center gap-0.5 hover:underline"
              >
                See All <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            {/* Horizontal Categories */}
            <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-2">
              {[
                { name: 'Action', icon: Target },
                { name: 'Drama', icon: Theater },
                { name: 'Comedy', icon: Smile },
                { name: 'Thriller', icon: Flame },
                { name: 'Sci-Fi', icon: Orbit },
                { name: 'Romance', icon: Heart }
              ].map(cat => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.name}
                    onClick={() => {
                      setSelectedCategory(cat.name);
                      setActiveTab('category');
                    }}
                    className="min-w-[80px] h-[80px] bg-[#121212] border border-[#E11D48]/30 rounded-2xl flex flex-col items-center justify-center gap-1.5 hover:border-[#E11D48] active:scale-95 transition-all"
                  >
                    <Icon className="w-5 h-5 text-[#E11D48]" />
                    <span className="text-[10px] font-bold text-white/80">{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </section>

        </main>
      )}

      {/* ===================== TAB: CATEGORY ===================== */}
      {activeTab === 'category' && (
        <main className="px-4 py-4 space-y-4">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight text-white mb-0.5">Categories</h2>
            <p className="text-xs text-white/60">Explore your favorite movies and series by category</p>
          </div>

          {/* Filter Pills (Matching Screenshot 2: All, Movies, Series, Trending, Popular, New) */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
            {['All', 'Movies', 'Series', 'Trending', 'Popular', 'New'].map(tab => (
              <button
                key={tab}
                onClick={() => setCategoryFilterTab(tab)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                  categoryFilterTab === tab 
                    ? 'bg-[#E11D48] text-white shadow-md shadow-[#E11D48]/30' 
                    : 'bg-[#151515] text-white/60 hover:text-white border border-white/5'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* 10 Category Cards Grid (Matching Screenshot 2) */}
          <div className="grid grid-cols-2 gap-3">
            {CATEGORY_ITEMS.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.name;

              return (
                <div
                  key={cat.name}
                  onClick={() => setSelectedCategory(isSelected ? 'All' : cat.name)}
                  className={`relative aspect-[16/10] rounded-2xl overflow-hidden cursor-pointer border transition-all group ${
                    isSelected ? 'border-[#E11D48] ring-1 ring-[#E11D48]' : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  {/* Category Image with dark overlay */}
                  <img 
                    src={cat.image} 
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/src/assets/images/hero_action_city_1792889177755.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />

                  {/* Card Content */}
                  <div className="absolute inset-0 p-3 flex flex-col justify-between">
                    {/* Top Icon */}
                    <div className="w-7 h-7 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-[#E11D48]" />
                    </div>

                    {/* Bottom Title & Count & Arrow */}
                    <div className="flex items-end justify-between">
                      <div>
                        <h4 className="font-black text-sm text-white leading-tight">{cat.name}</h4>
                        <p className="text-[9px] text-white/50 font-medium">{cat.count} Movies & Series</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-white/60 mb-0.5" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Movies in Selected Category */}
          <div className="pt-4 border-t border-white/10">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-black uppercase text-white">
                {selectedCategory === 'All' ? 'All Movies' : `${selectedCategory} Movies`} ({categoryMovies.length})
              </h3>
              {selectedCategory !== 'All' && (
                <button 
                  onClick={() => setSelectedCategory('All')}
                  className="text-[10px] text-[#E11D48] font-bold"
                >
                  Clear Filter
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              {categoryMovies.map(movie => (
                <div 
                  key={movie.id}
                  onClick={() => setSelectedMovie(movie)}
                  className="cursor-pointer group aspect-[2/3] rounded-xl overflow-hidden border border-white/10 bg-[#111] relative"
                >
                  <img 
                    src={movie.posterUrl} 
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/src/assets/images/poster_space_wave_1792889178331.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <span className="absolute bottom-2.5 right-2.5 px-1.5 py-0.5 bg-[#E11D48] text-white font-black text-[9px] rounded-sm">
                    {movie.rating}
                  </span>
                  <div className="absolute bottom-2.5 left-2.5 right-10">
                    <p className="font-bold text-xs text-white truncate">{movie.title}</p>
                    <p className="text-[9px] text-white/60">{movie.duration} • {movie.releaseYear}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      )}

      {/* ===================== TAB: HISTORY ===================== */}
      {activeTab === 'history' && (
        <main className="px-4 py-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight text-white mb-0.5">Watch History</h2>
              <p className="text-xs text-white/60">Pick up right where you left off</p>
            </div>
            {historyList.length > 0 && (
              <button 
                onClick={() => {
                  setHistoryList([]);
                  localStorage.removeItem('mafiacine_history');
                }}
                className="text-[10px] text-white/50 hover:text-[#E11D48] transition-colors"
              >
                Clear All
              </button>
            )}
          </div>

          {historyList.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 bg-[#111] rounded-2xl border border-white/5">
              <Clock className="w-10 h-10 text-white/20 mb-3" />
              <p className="font-bold text-sm text-white/70 mb-1">No Watch History Yet</p>
              <p className="text-xs text-white/40 mb-4">Start watching your favorite movies to track your history here.</p>
              <button 
                onClick={() => setActiveTab('home')}
                className="px-5 py-2 bg-[#E11D48] text-white font-bold text-xs rounded-full"
              >
                Explore Movies
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {historyList.map(movie => (
                <div 
                  key={movie.id}
                  onClick={() => startPlaying(movie)}
                  className="flex gap-3 p-2.5 bg-[#121212] hover:bg-[#181818] border border-white/5 rounded-xl cursor-pointer group transition-colors"
                >
                  <div className="w-24 aspect-[16/10] rounded-lg overflow-hidden relative shrink-0">
                    <img 
                      src={movie.posterUrl} 
                      alt={movie.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "/src/assets/images/poster_dark_vigilante_1792889178846.jpg";
                      }}
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Play className="w-4 h-4 fill-white text-white" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <h4 className="font-bold text-xs text-white truncate">{movie.title}</h4>
                    <p className="text-[10px] text-white/50">{movie.genre} • {movie.duration}</p>
                    <div className="w-full bg-white/10 h-1 rounded-full mt-2 overflow-hidden">
                      <div className="bg-[#E11D48] h-full w-2/3" />
                    </div>
                  </div>

                  <div className="flex items-center text-[#E11D48] pr-1">
                    <Play className="w-4 h-4 fill-current" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      )}

      {/* ===================== BOTTOM NAVIGATION ===================== */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#050505]/95 backdrop-blur-md border-t border-white/10 h-14 px-6 flex items-center justify-around">
        {[
          { id: 'home', icon: Home, label: 'Home' },
          { id: 'category', icon: Grid, label: 'Category' },
          { id: 'history', icon: History, label: 'History' },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as 'home' | 'category' | 'history');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex flex-col items-center justify-center gap-1 transition-colors relative py-1 ${
                isActive ? 'text-[#E11D48]' : 'text-white/40 hover:text-white/80'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-bold tracking-tight">{tab.label}</span>
              {isActive && (
                <motion.div 
                  layoutId="tab-underline"
                  className="absolute -bottom-1 w-6 h-0.5 bg-[#E11D48] rounded-full"
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* ===================== MOVIE DETAIL MODAL ===================== */}
      <AnimatePresence>
        {selectedMovie && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          >
            <motion.div 
              initial={{ y: 100 }} 
              animate={{ y: 0 }} 
              exit={{ y: 100 }}
              className="w-full max-w-md bg-[#0e0e0e] border border-white/10 rounded-t-3xl sm:rounded-2xl overflow-hidden max-h-[85vh] flex flex-col"
            >
              {/* Header Image */}
              <div className="relative aspect-[16/9] w-full">
                <img 
                  src={selectedMovie.posterUrl} 
                  alt={selectedMovie.title} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "/src/assets/images/hero_action_city_1792889177755.jpg";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] to-transparent" />
                <button 
                  onClick={() => setSelectedMovie(null)}
                  className="absolute top-3 right-3 p-2 bg-black/60 rounded-full border border-white/20 text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Details Body */}
              <div className="p-5 space-y-4 overflow-y-auto">
                <div className="flex items-center gap-2 text-[10px] font-bold text-[#E11D48] uppercase tracking-wider">
                  <span>{selectedMovie.genre}</span>
                  <span>•</span>
                  <span>{selectedMovie.releaseYear}</span>
                  <span>•</span>
                  <span className="border border-white/20 text-white px-1 py-0.5 rounded text-[8px]">
                    {selectedMovie.rating}
                  </span>
                  <span>•</span>
                  <span className="text-white/60">{selectedMovie.duration}</span>
                </div>

                <h3 className="text-xl font-black uppercase text-white leading-tight">
                  {selectedMovie.title}
                </h3>

                <p className="text-xs text-white/70 leading-relaxed">
                  {selectedMovie.description}
                </p>

                <div className="pt-2">
                  <button 
                    onClick={() => startPlaying(selectedMovie)}
                    className="w-full py-3 bg-[#E11D48] hover:bg-[#F43F5E] active:scale-95 transition-all text-white font-black text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#E11D48]/30"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    Play Movie (HTML5 Player)
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===================== HTML5 FULLSCREEN VIDEO PLAYER ===================== */}
      <AnimatePresence>
        {activePlayingMovie && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex flex-col justify-between"
          >
            {/* Top Bar with Title and Close */}
            <div className="relative z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/90 to-transparent">
              <button 
                onClick={() => setActivePlayingMovie(null)}
                className="flex items-center gap-2 text-white/90 hover:text-white p-2 rounded-full bg-black/40 border border-white/20"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div className="text-center truncate px-4">
                <p className="font-bold text-sm text-white truncate">{activePlayingMovie.title}</p>
                <p className="text-[9px] text-[#E11D48] uppercase font-bold tracking-widest">{activePlayingMovie.genre} • MafiaCine Stream</p>
              </div>

              <button 
                onClick={() => setActivePlayingMovie(null)}
                className="p-2 rounded-full bg-black/40 border border-white/20 text-white/90"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Core HTML5 Video Element */}
            <div className="relative flex-1 flex items-center justify-center bg-black overflow-hidden">
              <video 
                ref={videoRef}
                src={activePlayingMovie.videoUrl}
                autoPlay
                playsInline
                onTimeUpdate={handleTimeUpdate}
                onEnded={() => setIsPlaying(false)}
                onClick={togglePlayPause}
                className="w-full h-full object-contain cursor-pointer"
              />

              {/* Big Center Play Icon when Paused */}
              {!isPlaying && (
                <button 
                  onClick={togglePlayPause}
                  className="absolute w-16 h-16 rounded-full bg-[#E11D48]/90 border border-white/40 flex items-center justify-center shadow-2xl active:scale-95 transition-transform"
                >
                  <Play className="w-8 h-8 fill-white text-white ml-1" />
                </button>
              )}
            </div>

            {/* Bottom Controls Bar */}
            <div className="relative z-10 p-4 bg-gradient-to-t from-black/90 via-black/70 to-transparent space-y-2">
              {/* Scrubber Range */}
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-white/70 font-mono w-10 text-right">
                  {formatTime(currentTime)}
                </span>
                <input 
                  type="range"
                  min={0}
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleSeek}
                  className="flex-1 h-1.5 bg-white/20 accent-[#E11D48] rounded-lg cursor-pointer"
                />
                <span className="text-[10px] text-white/70 font-mono w-10">
                  {formatTime(duration)}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={togglePlayPause}
                    className="p-2 text-white hover:text-[#E11D48] transition-colors"
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
                  </button>

                  <button 
                    onClick={toggleMute}
                    className="p-2 text-white/80 hover:text-white"
                  >
                    {isMuted ? <VolumeX className="w-5 h-5 text-[#E11D48]" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[9px] px-2 py-0.5 rounded bg-[#E11D48] font-bold text-white uppercase tracking-wider">
                    HD 1080p
                  </span>

                  <button 
                    onClick={toggleFullscreen}
                    className="p-2 text-white/80 hover:text-white"
                  >
                    <Maximize className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===================== SEARCH MODAL ===================== */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#050505] p-4 flex flex-col"
          >
            {/* Search Input Bar */}
            <div className="flex items-center gap-3 pb-3 border-b border-white/10">
              <Search className="w-5 h-5 text-[#E11D48]" />
              <input 
                autoFocus
                type="text"
                placeholder="Search movies, genre, actor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-sm text-white placeholder-white/40 outline-none"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="p-1 text-white/50">
                  <X className="w-4 h-4" />
                </button>
              )}
              <button 
                onClick={() => setIsSearchOpen(false)}
                className="text-xs font-bold text-[#E11D48] px-2 py-1"
              >
                Cancel
              </button>
            </div>

            {/* Quick Filters */}
            <div className="py-3 flex gap-2 overflow-x-auto no-scrollbar">
              {['Action', 'Gadar', 'Batman', 'Crime', 'Sci-Fi', 'Comedy'].map(tag => (
                <button
                  key={tag}
                  onClick={() => setSearchQuery(tag)}
                  className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-white/70 hover:border-[#E11D48]"
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Results Grid */}
            <div className="flex-1 overflow-y-auto no-scrollbar pt-2 space-y-3">
              {searchQuery && searchResults.length === 0 ? (
                <div className="text-center py-16 text-white/40">
                  <p>No results found for "{searchQuery}"</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {(searchQuery ? searchResults : movies).map(movie => (
                    <div 
                      key={movie.id}
                      onClick={() => {
                        setSelectedMovie(movie);
                        setIsSearchOpen(false);
                      }}
                      className="cursor-pointer aspect-[2/3] rounded-xl overflow-hidden border border-white/10 bg-[#111] relative group"
                    >
                      <img 
                        src={movie.posterUrl} 
                        alt={movie.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      <div className="absolute bottom-2 left-2 right-2">
                        <p className="font-bold text-xs text-white truncate">{movie.title}</p>
                        <p className="text-[9px] text-[#E11D48]">{movie.genre}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===================== NOTIFICATION MODAL ===================== */}
      <AnimatePresence>
        {showNotification && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          >
            <div className="bg-[#121212] border border-white/10 rounded-2xl p-5 max-w-sm w-full space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#E11D48]">
                  <Bell className="w-5 h-5" />
                  <h3 className="font-black text-sm uppercase text-white">Notifications</h3>
                </div>
                <button onClick={() => setShowNotification(false)} className="text-white/40 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                  <p className="font-bold text-white mb-0.5">🔥 Live Google Sheets Sync</p>
                  <p className="text-[11px] text-white/60">Your Google Sheet is connected! Any movies added to your sheet will appear instantly.</p>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                  <p className="font-bold text-white mb-0.5">🎬 HTML5 Streaming Ready</p>
                  <p className="text-[11px] text-white/60">Stream high-definition movies with the built-in HTML5 media player.</p>
                </div>
              </div>

              <button 
                onClick={() => setShowNotification(false)}
                className="w-full py-2.5 bg-[#E11D48] text-white font-bold text-xs rounded-xl"
              >
                Got It
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
