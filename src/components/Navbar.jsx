"use client"
import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import BrandLogo from '@/components/BrandLogo';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      setLoading(false);
    });
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        setShowDropdown(false);
        return;
      }

      setIsSearching(true);
      setShowDropdown(true);

      const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data);
      }
      setIsSearching(false);
    };

    const debounceTimer = setTimeout(fetchSearchResults, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <nav className="fixed top-0 w-full z-[100] bg-surface/70 backdrop-blur-xl border-b border-white/40 shadow-sm shadow-primary/5 transition-all duration-300" id="topNav">
      <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop h-20 max-w-container-max mx-auto gap-4">

        <a className="flex items-center shrink-0 hover:opacity-90 transition-opacity duration-200" href="/">
          <BrandLogo size="md" />
        </a>

        <div className="hidden md:flex flex-1 max-w-md mx-4 relative group" ref={searchRef}>
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">search</span>
          <input 
            className="w-full bg-white/50 border border-outline-variant/30 text-on-surface placeholder-on-surface-variant/70 rounded-full py-2 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all backdrop-blur-md font-body-md text-body-md" 
            placeholder="Search games, vouchers..." 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => { if(searchQuery.trim()) setShowDropdown(true) }}
          />
          
          {/* Search Dropdown */}
          {showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-surface rounded-xl shadow-xl border border-outline-variant/30 overflow-hidden z-[110]">
              <div className="px-4 py-2 bg-surface-container-lowest border-b border-outline-variant/20">
                <span className="font-label-md text-xs text-on-surface-variant">Hasil Pencarian...</span>
              </div>
              
              <div className="max-h-80 overflow-y-auto">
                {isSearching ? (
                  <div className="p-4 flex justify-center items-center">
                    <span className="material-symbols-outlined animate-spin text-primary">progress_activity</span>
                  </div>
                ) : searchResults.length > 0 ? (
                  searchResults.map(game => (
                    <a 
                      key={game.id} 
                      href={`/game/${game.id}`}
                      className="flex items-center gap-3 p-3 hover:bg-surface-variant/30 transition-colors border-b border-outline-variant/10 last:border-0"
                    >
                      <img src={game.image_url || 'https://via.placeholder.com/150'} alt={game.title} className="w-12 h-12 rounded-lg object-cover" />
                      <div>
                        <h4 className="font-label-md text-sm font-bold text-on-surface">{game.title}</h4>
                        <p className="font-body-sm text-xs text-on-surface-variant">{game.category}</p>
                      </div>
                    </a>
                  ))
                ) : (
                  <div className="p-4 text-center font-body-md text-sm text-on-surface-variant">
                    Tidak menemukan "{searchQuery}"
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="hidden md:flex items-center gap-8 shrink-0">
          <a className="text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md hover:scale-105 duration-200" href="/">Home</a>
          <a className="text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md hover:scale-105 duration-200" href="/promotions">Promotions</a>
          <a className="text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md hover:scale-105 duration-200" href="/history">History</a>
          <a className="text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md hover:scale-105 duration-200" href="/news">News</a>
        </div>

        <div className="hidden md:flex items-center gap-4 shrink-0">
          {loading ? (
            <div className="w-10 h-10 rounded-full bg-surface-container-high animate-pulse ml-4"></div>
          ) : !user ? (
            <>
              <a href="/login" className="font-label-md text-label-md text-primary hover:scale-105 transition-transform duration-200 px-4 py-2">
                  Sign In
              </a>
              <a href="/register" className="font-label-md text-label-md bg-gradient-to-r from-primary to-primary-container text-on-primary px-6 py-2 rounded-full shadow-lg shadow-primary/20 hover:scale-105 transition-transform duration-200">
                  Sign Up
              </a>
            </>
          ) : (
            <div className="relative group cursor-pointer ml-4">
              <div className="w-10 h-10 rounded-full border-2 border-primary/50 overflow-hidden shadow-md flex items-center justify-center bg-surface-variant text-primary group-hover:border-primary transition-colors">
                {(user.user_metadata?.avatar_url || user.user_metadata?.picture) ? (
                  <img src={user.user_metadata.avatar_url || user.user_metadata.picture} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <span className="material-symbols-outlined">person</span>
                )}
              </div>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-48 bg-surface border border-outline-variant/30 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right scale-95 group-hover:scale-100 flex flex-col overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-outline-variant/20 bg-surface-variant/30">
                  <p className="font-label-md text-sm text-on-surface truncate">
                    {user.user_metadata?.full_name || user.user_metadata?.name || user.user_metadata?.first_name || user.email?.split('@')[0]}
                  </p>
                  <p className="font-body-sm text-xs text-on-surface-variant truncate">{user.email}</p>
                </div>
                <a href="/settings" className="px-4 py-3 font-label-md text-sm text-on-surface hover:bg-surface-variant transition-colors flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">settings</span>
                  Settings
                </a>
                <button onClick={handleLogout} className="w-full text-left px-4 py-3 font-label-md text-sm text-error hover:bg-error/10 transition-colors flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>

        <button className="md:hidden text-primary p-2 shrink-0" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <span className="material-symbols-outlined">{isMenuOpen ? 'close' : 'menu'}</span>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-surface border-b border-outline-variant/30 shadow-lg flex flex-col p-4 animate-in slide-in-from-top-2 duration-200">
          <div className="relative w-full mb-4">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input 
              className="w-full bg-surface-container-lowest border border-outline-variant/30 text-on-surface placeholder-on-surface-variant/70 rounded-full py-3 pl-12 pr-4 focus:outline-none focus:border-primary font-body-md text-body-md" 
              placeholder="Search games, vouchers..." 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {/* Simple Search Results for Mobile */}
            {searchQuery && searchResults.length > 0 && (
              <div className="mt-2 bg-surface-container-lowest rounded-xl shadow-md border border-outline-variant/30 overflow-hidden max-h-60 overflow-y-auto">
                {searchResults.map(game => (
                  <a key={game.id} href={`/game/${game.id}`} className="flex items-center gap-3 p-3 border-b border-outline-variant/10 last:border-0 hover:bg-surface-variant/30">
                    <img src={game.image_url} alt={game.title} className="w-10 h-10 rounded-lg object-cover" />
                    <span className="font-label-md text-sm">{game.title}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
          
          <a className="py-3 px-4 text-on-surface hover:bg-surface-variant/30 rounded-xl transition-colors font-label-md" href="/">Home</a>
          <a className="py-3 px-4 text-on-surface hover:bg-surface-variant/30 rounded-xl transition-colors font-label-md" href="/promotions">Promotions</a>
          <a className="py-3 px-4 text-on-surface hover:bg-surface-variant/30 rounded-xl transition-colors font-label-md" href="/history">History</a>
          
          <div className="border-t border-outline-variant/20 mt-2 pt-4 flex flex-col gap-3">
            {!loading && !user ? (
              <>
                <a href="/login" className="py-3 w-full text-center border border-primary text-primary rounded-xl font-label-md hover:bg-primary/5">Sign In</a>
                <a href="/register" className="py-3 w-full text-center bg-primary text-on-primary rounded-xl font-label-md shadow-md shadow-primary/20">Sign Up</a>
              </>
            ) : !loading && user ? (
              <>
                <div className="flex items-center gap-3 px-4 py-2 mb-2 bg-surface-variant/30 rounded-xl">
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                    <img src={user.user_metadata?.avatar_url || user.user_metadata?.picture || `https://ui-avatars.com/api/?name=${user.email}`} alt="User" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-label-md text-sm truncate">{user.user_metadata?.name || user.email}</p>
                    <p className="font-body-sm text-xs text-on-surface-variant truncate">{user.email}</p>
                  </div>
                </div>
                <a href="/settings" className="py-3 px-4 text-on-surface hover:bg-surface-variant/30 rounded-xl transition-colors font-label-md flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">settings</span> Settings
                </a>
                <button onClick={handleLogout} className="py-3 px-4 text-error hover:bg-error/10 rounded-xl transition-colors font-label-md text-left flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">logout</span> Logout
                </button>
              </>
            ) : null}
          </div>
        </div>
      )}
    </nav>
  );
}
