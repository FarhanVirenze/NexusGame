"use client"
import React, { useState, useEffect } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('nexuspay-theme');
    if (saved === 'dark' || saved === 'light') {
      setTheme(saved);
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(saved);
    }
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('nexuspay-theme', next);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(next);
  };

  if (!mounted) return null;

  return (
    <button
      onClick={toggleTheme}
      className="w-9 h-9 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors"
      title={theme === 'light' ? 'Dark Mode' : 'Light Mode'}
    >
      <span className="material-symbols-outlined text-[20px]">
        {theme === 'light' ? 'dark_mode' : 'light_mode'}
      </span>
    </button>
  );
}
