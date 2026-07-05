"use client"
import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function SettingsComponent() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const fileInputRef = useRef(null);

  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(null);

  // Password states
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // Notification states
  const [notifReceipts, setNotifReceipts] = useState(true);
  const [notifPromos, setNotifPromos] = useState(false);

  useEffect(() => {
    async function loadUserProfile() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        window.location.href = '/login';
        return;
      }

      setUser(session.user);

      // Fetch profile via server API (bypasses RLS)
      try {
        const res = await fetch('/api/check-role', {
          headers: { 'Authorization': `Bearer ${session.access_token}` },
        });
        const data = await res.json();

        if (data.profile) {
          setProfile(data.profile);
          setFirstName(data.profile.first_name || '');
          setLastName(data.profile.last_name || '');
          setPhone(data.profile.phone || '');
          setEmail(data.profile.email || '');
          setAvatarUrl(data.profile.avatar_url || null);
        } else {
          // Fallback to auth metadata
          const meta = session.user.user_metadata;
          setFirstName(meta?.first_name || meta?.full_name?.split(' ')[0] || '');
          setLastName(meta?.last_name || meta?.full_name?.split(' ').slice(1).join(' ') || '');
          setPhone(meta?.phone || '');
          setEmail(session.user.email || '');
          setAvatarUrl(meta?.avatar_url || meta?.picture || null);
        }
      } catch (err) {
        // Fallback to auth metadata
        const meta = session.user.user_metadata;
        setFirstName(meta?.first_name || '');
        setLastName(meta?.last_name || '');
        setPhone(meta?.phone || '');
        setEmail(session.user.email || '');
        setAvatarUrl(meta?.avatar_url || meta?.picture || null);
      }
      setLoading(false);
    }

    loadUserProfile();
  }, []);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    setMessage({ type: '', text: '' });

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const res = await fetch('/api/profile/avatar', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${session.access_token}` },
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        setAvatarUrl(data.avatar_url);
        setMessage({ type: 'success', text: 'Foto profil berhasil diperbarui!' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Gagal upload foto.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Gagal upload foto.' });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          phone: phone,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage({ type: 'success', text: 'Profil berhasil diperbarui!' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Gagal menyimpan perubahan.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Gagal menyimpan perubahan.' });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePassword = async () => {
    setMessage({ type: '', text: '' });
    if (newPassword !== confirmNewPassword) {
      setMessage({ type: 'error', text: 'Password baru tidak cocok.' });
      return;
    }
    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password minimal 6 karakter.' });
      return;
    }

    setUpdatingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setMessage({ type: 'error', text: 'Gagal mengubah password: ' + error.message });
    } else {
      setMessage({ type: 'success', text: 'Password berhasil diperbarui!' });
      setNewPassword('');
      setConfirmNewPassword('');
    }
    setUpdatingPassword(false);
  };

  const displayName = firstName && lastName ? `${firstName} ${lastName}` : (user?.user_metadata?.full_name || user?.user_metadata?.name || email?.split('@')[0] || '');

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="flex-grow px-margin-mobile md:px-margin-desktop py-12 mt-20">
          <div className="max-w-3xl mx-auto flex justify-center items-center min-h-[50vh]">
            <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
          </div>
        </main>
      </>
    );
  }

  return (
    <>

<Navbar />
<main className="flex-grow px-margin-mobile md:px-margin-desktop py-12 mt-20">
<div className="max-w-3xl mx-auto space-y-12">

<div className="text-center md:text-left">
<h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-2">Account Settings</h1>
<p className="font-body-lg text-body-lg text-on-surface-variant">Manage your gaming profile and preferences.</p>
</div>

{/* Status Message */}
{message.text && (
  <div className={`p-4 rounded-lg font-body-sm text-sm ${message.type === 'error' ? 'bg-error/10 border border-error/20 text-error' : 'bg-primary/10 border border-primary/20 text-primary'}`}>
    {message.text}
  </div>
)}

{/* Profile Header */}
<section className="glass-card rounded-xl p-8 shadow-sm flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
<div className="absolute -right-20 -top-20 w-64 h-64 bg-primary-fixed rounded-full blur-3xl opacity-30 pointer-events-none"></div>
<div 
  className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md flex-shrink-0 relative group cursor-pointer"
  onClick={() => fileInputRef.current?.click()}
>
  {avatarUrl ? (
    <img className="w-full h-full object-cover" alt="Profile avatar" src={avatarUrl} referrerPolicy="no-referrer" />
  ) : (
    <div className="w-full h-full bg-surface-variant flex items-center justify-center">
      <span className="material-symbols-outlined text-5xl text-primary">person</span>
    </div>
  )}
<div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
  {uploadingAvatar ? (
    <span className="material-symbols-outlined text-white animate-spin">progress_activity</span>
  ) : (
    <span className="material-symbols-outlined text-white">photo_camera</span>
  )}
</div>
<input
  ref={fileInputRef}
  type="file"
  accept="image/*"
  className="hidden"
  onChange={handleAvatarUpload}
/>
</div>
<div className="flex-grow text-center md:text-left">
<h2 className="font-headline-md text-headline-md text-on-surface">{displayName}</h2>
<p className="font-body-md text-body-md text-outline mt-1">{email}</p>
<div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
</div>
</div>
</section>

{/* Personal Details Form */}
<section className="glass-card rounded-xl p-8 shadow-sm">
<h3 className="font-headline-md text-headline-md text-on-surface mb-6 flex items-center gap-2">
<span className="material-symbols-outlined text-primary">person</span> Personal Details
                </h3>
<div className="space-y-6">
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<div>
<label className="block font-label-md text-label-md text-on-surface-variant mb-2">Nama Depan</label>
<input className="form-input-styled" placeholder="Masukkan nama depan" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
</div>
<div>
<label className="block font-label-md text-label-md text-on-surface-variant mb-2">Nama Belakang</label>
<input className="form-input-styled" placeholder="Masukkan nama belakang" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
</div>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<div>
<label className="block font-label-md text-label-md text-on-surface-variant mb-2">Email Address</label>
<input className="form-input-styled bg-surface-variant/30 cursor-not-allowed" type="email" value={email} readOnly />
</div>
<div>
<label className="block font-label-md text-label-md text-on-surface-variant mb-2">Nomor WhatsApp</label>
<input className="form-input-styled" placeholder="Masukkan nomor WhatsApp" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
</div>
</div>
<div className="flex justify-end">
<button 
  className="bg-gradient-to-r from-primary to-primary-container text-white px-6 py-2.5 rounded-lg font-label-md text-label-md shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200 disabled:opacity-70 flex items-center gap-2" 
  type="button"
  disabled={saving}
  onClick={handleSaveProfile}
>
  {saving ? <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span> : null}
  Save Changes
</button>
</div>
</div>
</section>

{/* Security / Change Password */}
<section className="glass-card rounded-xl p-8 shadow-sm">
<h3 className="font-headline-md text-headline-md text-on-surface mb-6 flex items-center gap-2">
<span className="material-symbols-outlined text-on-surface">lock</span> Security
                </h3>
<div className="space-y-6">
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<div>
<label className="block font-label-md text-label-md text-on-surface-variant mb-2">New Password</label>
<input className="form-input-styled" placeholder="••••••••" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
</div>
<div>
<label className="block font-label-md text-label-md text-on-surface-variant mb-2">Confirm New Password</label>
<input className="form-input-styled" placeholder="••••••••" type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} />
</div>
</div>
<div className="flex justify-end">
<button 
  className="bg-surface-container-high text-on-surface border border-outline-variant px-6 py-2.5 rounded-lg font-label-md text-label-md hover:bg-surface-variant transition-colors duration-200 disabled:opacity-70 flex items-center gap-2" 
  type="button"
  disabled={updatingPassword}
  onClick={handleUpdatePassword}
>
  {updatingPassword ? <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span> : null}
  Update Password
</button>
</div>
</div>
</section>

{/* Notification Preferences */}
<section className="glass-card rounded-xl p-8 shadow-sm">
<h3 className="font-headline-md text-headline-md text-on-surface mb-6 flex items-center gap-2">
<span className="material-symbols-outlined text-primary-container">notifications</span> Notification Preferences
                </h3>
<div className="space-y-4">
<label className="flex items-center justify-between p-4 hover:bg-surface-container-low rounded-lg cursor-pointer transition-colors">
<div>
<p className="font-label-md text-label-md text-on-surface">Transaction Receipts</p>
<p className="font-caption text-caption text-outline">Email confirmations for successful purchases.</p>
</div>
<input checked={notifReceipts} onChange={(e) => setNotifReceipts(e.target.checked)} className="form-checkbox h-5 w-5 text-primary rounded border-outline-variant focus:ring-primary-container" type="checkbox"/>
</label>
<div className="h-px bg-surface-variant w-full"></div>
<label className="flex items-center justify-between p-4 hover:bg-surface-container-low rounded-lg cursor-pointer transition-colors">
<div>
<p className="font-label-md text-label-md text-on-surface">Promotional Offers</p>
<p className="font-caption text-caption text-outline">Updates on sales and new game integrations.</p>
</div>
<input checked={notifPromos} onChange={(e) => setNotifPromos(e.target.checked)} className="form-checkbox h-5 w-5 text-primary rounded border-outline-variant focus:ring-primary-container" type="checkbox"/>
</label>
</div>
</section>
</div>
</main>

<Footer />

    </>
  );
}
