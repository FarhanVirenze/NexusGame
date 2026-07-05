"use client"
import React, { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

export default function AdminSidebar() {
  const pathname = usePathname();
  const [profile, setProfile] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isActive = (path) => pathname === path;

  const getLinkClasses = (path) => {
    if (isActive(path)) {
      return "flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 text-primary font-bold transition-all";
    }
    return "flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container transition-all";
  };

  useEffect(() => {
    async function fetchProfile() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      try {
        const res = await fetch('/api/check-role', {
          headers: { 'Authorization': `Bearer ${session.access_token}` },
        });
        const data = await res.json();
        if (data.profile) {
          setProfile(data.profile);
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      }
    }
    
    fetchProfile();

    window.addEventListener('profileUpdated', fetchProfile);
    return () => window.removeEventListener('profileUpdated', fetchProfile);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const avatarUrl = profile?.avatar_url;
  const displayName = (profile?.first_name && profile?.last_name) 
    ? `${profile.first_name} ${profile.last_name}` 
    : profile?.email || 'Admin';
  const displayEmail = profile?.email || '';

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 glass-panel border-r border-outline-variant/30 z-50 flex flex-col p-6 overflow-y-auto hidden md:flex">
      <div className="flex items-center gap-3 mb-10 shrink-0 relative" ref={dropdownRef}>
        {/* Profile Avatar Button */}
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center overflow-hidden border-2 border-primary/30 hover:border-primary transition-colors cursor-pointer shrink-0"
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <span className="material-symbols-outlined text-on-primary-container text-xl">person</span>
          )}
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="font-headline-lg-mobile text-[20px] font-black text-primary tracking-tighter leading-none">NexusPay</h1>
          <p className="font-caption text-[11px] text-on-surface-variant uppercase tracking-wider">Admin</p>
        </div>

        {/* Dropdown Menu — Settings only, no Logout */}
        {dropdownOpen && (
          <div className="absolute left-0 top-full mt-2 w-full bg-surface-container rounded-xl shadow-xl border border-outline-variant/30 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="px-4 py-3 border-b border-outline-variant/20">
              <p className="font-label-md text-label-md text-on-surface truncate">{displayName}</p>
              <p className="font-caption text-[11px] text-on-surface-variant truncate">{displayEmail}</p>
            </div>
            <div className="py-1">
              <Link
                href="/admin/settings"
                className="flex items-center gap-3 px-4 py-2.5 text-on-surface-variant hover:bg-surface-container-highest transition-colors"
                onClick={() => setDropdownOpen(false)}
              >
                <span className="material-symbols-outlined text-[18px]">settings</span>
                <span className="text-label-md">Settings</span>
              </Link>
            </div>
          </div>
        )}
      </div>

      <nav className="flex-1 flex flex-col gap-2">
        <Link className={getLinkClasses('/admin')} href="/admin">
          <span className="material-symbols-outlined">dashboard</span>
          <span className="text-label-md">Dashboard</span>
        </Link>
        <Link className={getLinkClasses('/admin/transactions')} href="/admin/transactions">
          <span className="material-symbols-outlined">receipt_long</span>
          <span className="text-label-md">Transactions</span>
        </Link>
        <Link className={getLinkClasses('/admin/games')} href="/admin/games">
          <span className="material-symbols-outlined">sports_esports</span>
          <span className="text-label-md">Game Management</span>
        </Link>
        <Link className={getLinkClasses('/admin/users')} href="/admin/users">
          <span className="material-symbols-outlined">group</span>
          <span className="text-label-md">User Management</span>
        </Link>
        <div className="pt-4 pb-1 px-4">
          <p className="font-caption text-[11px] text-on-surface-variant uppercase tracking-wider font-bold">Content Management</p>
        </div>
        <Link className={getLinkClasses('/admin/content')} href="/admin/content">
          <span className="material-symbols-outlined">article</span>
          <span className="text-label-md">Manage News</span>
        </Link>
        <Link className={getLinkClasses('/admin/promotions')} href="/admin/promotions">
          <span className="material-symbols-outlined">campaign</span>
          <span className="text-label-md">Manage Promotions</span>
        </Link>
      </nav>

      {/* Logout at bottom of sidebar */}
      <div className="mt-auto pt-4 border-t border-outline-variant/20 shrink-0">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-error hover:bg-error/5 transition-all w-full"
        >
          <span className="material-symbols-outlined">logout</span>
          <span className="text-label-md font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
