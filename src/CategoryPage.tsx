import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, Grid, History, User as UserIcon, Search, Bell, ChevronRight, 
  Target, Theater, Laugh, Eye, Skull, Heart, Castle, Flame, Clapperboard
} from 'lucide-react';

const categories = [
  { name: 'Action', icon: Target, image: '/src/assets/images/hero_action_city_1792889177755.jpg', count: '1,280' },
  { name: 'Drama', icon: Theater, image: '/src/assets/images/poster_gritty_clown_1792889177813.jpg', count: '1,045' },
  { name: 'Comedy', icon: Laugh, image: '/src/assets/images/poster_dark_vigilante_1792889178846.jpg', count: '980' },
  { name: 'Thriller', icon: Eye, image: '/src/assets/images/poster_cyber_hacker_v2_1792889179490.jpg', count: '760' },
  { name: 'Sci-Fi', icon: Target, image: '/src/assets/images/poster_space_wave_1792889178331.jpg', count: '620' },
  { name: 'Horror', icon: Skull, image: '/src/assets/images/category_horror_v2_1792927439056.jpg', count: '540' },
  { name: 'Romance', icon: Heart, image: '/src/assets/images/hero_action_city_1792889177755.jpg', count: '480' },
  { name: 'Fantasy', icon: Castle, image: '/src/assets/images/category_fantasy_v2_1792927439591.jpg', count: '420' },
  { name: 'Animation', icon: Flame, image: '/src/assets/images/category_animation_v2_1792927439517.jpg', count: '390' },
  { name: 'Documentary', icon: Clapperboard, image: '/src/assets/images/category_documentary_v2_1792927438470.jpg', count: '310' },
];

const tabs = ['All', 'Movies', 'Series', 'Trending', 'Popular', 'New'];

export default function CategoryPage({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const [activeFilter, setActiveFilter] = useState('All');

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-24 px-6">
      <header className="mb-8">
        <h2 className="text-3xl font-black tracking-tighter uppercase mb-2">Categories</h2>
        <p className="text-sm text-white/60">Explore your favorite movies and series by category</p>
      </header>

      {/* Filter Tabs */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar mb-8">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
              activeFilter === tab 
                ? 'bg-[#E11D48] border-[#E11D48] text-white' 
                : 'bg-transparent border-white/20 text-white/60'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Category Grid */}
      <div className="space-y-4">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="group relative h-32 rounded-2xl overflow-hidden cursor-pointer border border-white/10"
          >
            <img src={cat.image} className="w-full h-full object-cover brightness-[0.6] group-hover:scale-105 transition-transform duration-500" alt="" />
            <div className="absolute inset-0 p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                  <cat.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase tracking-tight">{cat.name}</h3>
                  <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest">{cat.count} Movies & Series</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-white/60" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
