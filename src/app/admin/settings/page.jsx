"use client"
import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import ProviderBalanceCard from '@/components/admin/ProviderBalanceCard';

export default function AdminSettingsPage() {
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

  useEffect(() => {
    async function loadProfile() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

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
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
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
        window.dispatchEvent(new Event('profileUpdated'));
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
        window.dispatchEvent(new Event('profileUpdated'));
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

  const displayName = firstName && lastName ? `${firstName} ${lastName}` : email?.split('@')[0] || 'Admin';

  if (loading) {
    return (
      <main className="flex-1 flex flex-col min-h-screen bg-background">
        <div className="flex justify-center items-center min-h-[60vh]">
          <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col min-h-screen transition-all duration-300 bg-background relative overflow-y-auto">
      <div className="p-6 md:p-margin-desktop max-w-3xl mx-auto w-full flex flex-col gap-8 pb-24 mt-4">

        <div>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-2">Account Settings</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Manage your admin profile and security.</p>
        </div>

        {/* Status Message */}
        {message.text && (
          <div className={`p-4 rounded-lg font-body-sm text-sm ${message.type === 'error' ? 'bg-error/10 border border-error/20 text-error' : 'bg-primary/10 border border-primary/20 text-primary'}`}>
            {message.text}
          </div>
        )}

        {/* Profile Header with Avatar */}
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
            <div className="mt-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary font-label-md text-label-sm gap-1">
                <span className="material-symbols-outlined text-[16px]">shield</span>
                Administrator
              </span>
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

        {/* Provider Balance Section */}
        <ProviderBalanceCard />

      </div>
    </main>
  );
}
