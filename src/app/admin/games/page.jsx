"use client"
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { adminFetch } from '@/lib/adminFetch';
import GameItemsModal from '@/components/admin/GameItemsModal';

export default function GamesComponent() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Create/Edit Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [formData, setFormData] = useState({ id: '', title: '', category: '', price: '', image_url: '' });
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

  // Delete Modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Manage Items Modal state
  const [managingItemsForGame, setManagingItemsForGame] = useState(null);

  // DataTable state
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 8;

  const fetchGames = async () => {
    try {
      const res = await adminFetch('/api/admin/data?table=games');
      if (!res.ok) throw new Error('Failed to fetch data');
      const data = await res.json();
      setGames(data || []);
    } catch (err) {
      console.error('Error fetching games:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  // Unique categories for filter dropdown
  const categories = useMemo(() => {
    const cats = [...new Set(games.map(g => g.category).filter(Boolean))];
    return cats.sort();
  }, [games]);

  // Filtered + searched data
  const filtered = useMemo(() => {
    let result = [...games];

    if (categoryFilter !== 'all') {
      result = result.filter(g => g.category === categoryFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(g =>
        g.title?.toLowerCase().includes(q) ||
        g.category?.toLowerCase().includes(q) ||
        String(g.price).includes(q)
      );
    }

    return result;
  }, [games, searchQuery, categoryFilter]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  useEffect(() => { setCurrentPage(1); }, [searchQuery, categoryFilter]);

  const openCreateModal = () => {
    setModalMode('create');
    setFormData({ id: '', title: '', category: '', price: 0, image_url: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (game) => {
    setModalMode('edit');
    setFormData({ 
      id: game.id, 
      title: game.title || '', 
      category: game.category || '', 
      price: game.price || 0, 
      image_url: game.image_url || '' 
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openDeleteModal = (game) => {
    setItemToDelete(game);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const payload = new FormData();
      payload.append('file', file);
      payload.append('bucket', 'uploads');

      const res = await adminFetch('/api/admin/upload', {
        method: 'POST',
        body: payload,
      });
      const data = await res.json();

      if (res.ok) {
        setFormData({ ...formData, image_url: data.url });
      } else {
        alert(data.error || 'Failed to upload image');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        title: formData.title,
        category: formData.category,
        price: parseFloat(formData.price) || 0,
        image_url: formData.image_url
      };

      if (modalMode === 'create') {
        const res = await adminFetch('/api/admin/crud', {
          method: 'POST',
          body: JSON.stringify({ table: 'games', data: payload })
        });
        if (!res.ok) throw new Error('Failed to create');
      } else {
        const res = await adminFetch('/api/admin/crud', {
          method: 'PUT',
          body: JSON.stringify({ table: 'games', id: formData.id, data: payload })
        });
        if (!res.ok) throw new Error('Failed to update');
      }

      await fetchGames();
      closeModal();
    } catch (err) {
      console.error('Error saving game:', err);
      alert('Error saving game');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    setDeleting(true);
    try {
      const res = await adminFetch(`/api/admin/crud?table=games&id=${itemToDelete.id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete');
      await fetchGames();
      closeDeleteModal();
    } catch (err) {
      console.error('Error deleting game:', err);
      alert('Error deleting game');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <main className="flex-1 flex flex-col min-h-screen transition-all duration-300 bg-background relative overflow-y-auto">
        <div className="p-6 md:p-margin-desktop max-w-container-max mx-auto w-full flex flex-col gap-8 pb-24 mt-4">

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="font-headline-lg text-headline-lg text-on-surface">Game Management</h1>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1">Manage supported titles, denominations, and active status.</p>
            </div>
            <button 
              onClick={openCreateModal}
              className="bg-gradient-to-r from-primary to-primary-container text-white font-label-md text-label-md px-6 py-3 rounded-lg shadow-sm hover:shadow-md hover:scale-[1.02] transition-all flex items-center justify-center gap-2 whitespace-nowrap self-start md:self-auto"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Add New Game
            </button>
          </div>

          {/* Search & Filter Bar */}
          <div className="glass-panel rounded-xl p-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between border border-outline-variant/30">
            <div className="relative flex-1 w-full sm:max-w-sm">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
              <input
                type="text"
                placeholder="Search games by title, category..."
                className="w-full pl-10 pr-4 py-2.5 bg-surface-container border border-outline-variant/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-on-surface text-sm"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <select
                className="bg-surface-container border border-outline-variant/40 rounded-lg px-3 py-2.5 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <div className="text-sm text-on-surface-variant whitespace-nowrap">
                {filtered.length} game{filtered.length !== 1 && 's'}
              </div>
            </div>
          </div>

          {/* Game Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-gutter">
            {loading ? (
              <div className="col-span-full py-12 flex flex-col items-center justify-center text-on-surface-variant">
                <span className="material-symbols-outlined animate-spin text-4xl mb-4">progress_activity</span>
                <p>Loading games...</p>
              </div>
            ) : paginated.length === 0 ? (
              <div className="col-span-full py-12 flex flex-col items-center justify-center text-on-surface-variant">
                <span className="material-symbols-outlined text-4xl mb-2">search_off</span>
                <p>{searchQuery || categoryFilter !== 'all' ? 'No games match your filters.' : 'No games found in the database.'}</p>
              </div>
            ) : (
              paginated.map((game) => (
                <div key={game.id} className="glass-panel rounded-xl p-4 flex flex-col group relative overflow-hidden transition-all hover:shadow-[0_4px_24px_-4px_rgba(0,101,145,0.15)] hover:border-primary-container/50">
                  <div className="relative h-40 rounded-lg overflow-hidden mb-4 bg-surface-variant">
                    {game.image_url ? (
                      <img src={game.image_url} alt={game.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-surface-container text-on-surface-variant">
                        <span className="material-symbols-outlined text-4xl">sports_esports</span>
                      </div>
                    )}
                    <div className="absolute top-2 left-2 px-2 py-1 bg-surface-container-lowest/90 backdrop-blur rounded text-[10px] font-bold text-primary flex items-center gap-1 shadow-sm">
                      <div className="w-2 h-2 rounded-full bg-secondary-container"></div> Active
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col">
                    <h3 className="font-headline-md text-[18px] text-on-surface mb-1 truncate" title={game.title}>{game.title}</h3>
                    <div className="flex items-center gap-2 text-on-surface-variant font-caption text-caption mb-4">
                      <span className="material-symbols-outlined text-[14px]">category</span>
                      <span className="capitalize">{game.category || 'Uncategorized'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-auto pt-4 border-t border-outline-variant/20">
                    <button 
                      onClick={() => setManagingItemsForGame(game)}
                      className="py-2 px-3 rounded-lg bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary transition-colors font-label-md text-label-md flex items-center justify-center gap-1"
                      title="Manage Denominations/Items"
                    >
                      <span className="material-symbols-outlined text-[16px]">inventory_2</span>
                      Items
                    </button>
                    <button 
                      onClick={() => openEditModal(game)}
                      className="flex-1 py-2 rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-variant transition-colors font-label-md text-label-md text-center"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => openDeleteModal(game)}
                      className="w-10 h-10 rounded-lg bg-surface-container-lowest border border-outline-variant/30 text-on-surface-variant hover:text-error hover:border-error-container transition-colors flex items-center justify-center"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="glass-panel rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 border border-outline-variant/30">
              <div className="font-caption text-caption text-on-surface-variant">
                Showing {Math.min((currentPage - 1) * perPage + 1, filtered.length)}–{Math.min(currentPage * perPage, filtered.length)} of {filtered.length} games
              </div>
              <div className="flex items-center gap-1">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(1)}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">first_page</span>
                </button>
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                  .reduce((acc, p, idx, arr) => {
                    if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...');
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, i) =>
                    p === '...' ? (
                      <span key={`ellipsis-${i}`} className="w-9 h-9 flex items-center justify-center text-on-surface-variant text-sm">…</span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setCurrentPage(p)}
                        className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${
                          currentPage === p
                            ? 'bg-primary text-on-primary'
                            : 'text-on-surface-variant hover:bg-surface-container'
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(totalPages)}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">last_page</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-surface rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-outline-variant/30 flex justify-between items-center">
              <h2 className="font-headline-md text-headline-md text-on-surface">
                {modalMode === 'create' ? 'Add New Game' : 'Edit Game'}
              </h2>
              <button onClick={closeModal} className="text-on-surface-variant hover:text-error transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 flex flex-col gap-4">
              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-1">Title</label>
                <input 
                  type="text" required
                  className="w-full bg-surface-container border border-outline-variant/50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 text-on-surface"
                  value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-1">Category</label>
                <input 
                  type="text" required
                  className="w-full bg-surface-container border border-outline-variant/50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 text-on-surface"
                  value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}
                />
              </div>
              
              {/* Image Upload Field */}
              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-1">Banner Image</label>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div 
                    className="w-24 h-24 rounded-lg bg-surface-container border border-outline-variant flex items-center justify-center shrink-0 overflow-hidden group cursor-pointer relative"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {formData.image_url ? (
                      <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-on-surface-variant text-3xl">image</span>
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="material-symbols-outlined text-white">upload</span>
                    </div>
                    {uploadingImage && (
                      <div className="absolute inset-0 bg-surface-container/80 flex items-center justify-center backdrop-blur-sm">
                        <span className="material-symbols-outlined animate-spin text-primary">progress_activity</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 w-full">
                    <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleImageUpload} />
                    <div className="flex gap-2">
                      <input 
                        type="url" placeholder="Or paste image URL"
                        className="w-full bg-surface-container border border-outline-variant/50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 text-on-surface"
                        value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})}
                      />
                      <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploadingImage}
                        className="bg-surface-container-high text-on-surface px-4 py-2 rounded-lg border border-outline-variant hover:bg-surface-variant transition-colors flex items-center gap-2 disabled:opacity-50">
                        <span className="material-symbols-outlined text-[18px]">upload_file</span>
                      </button>
                    </div>
                    <p className="text-xs text-on-surface-variant mt-2">Upload a file or paste a direct URL (max 10MB).</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={closeModal} className="px-5 py-2.5 rounded-lg border border-outline-variant text-on-surface hover:bg-surface-container-high transition-colors">Cancel</button>
                <button type="submit" disabled={saving || uploadingImage} className="px-5 py-2.5 rounded-lg bg-primary text-on-primary hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50">
                  {saving && <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>}
                  Save Game
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-surface rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-error/10 text-error flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-3xl">delete_forever</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Delete Game</h3>
              <p className="font-body-md text-body-md text-on-surface-variant mb-6">
                Are you sure you want to delete <span className="font-semibold text-on-surface">{itemToDelete?.title}</span>? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-center">
                <button onClick={closeDeleteModal} disabled={deleting} className="px-6 py-2.5 rounded-lg border border-outline-variant text-on-surface hover:bg-surface-container-high transition-colors">Cancel</button>
                <button onClick={confirmDelete} disabled={deleting} className="px-6 py-2.5 rounded-lg bg-error text-white hover:bg-error/90 transition-colors flex items-center gap-2">
                  {deleting && <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>}
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Game Items Management Modal */}
      {managingItemsForGame && (
        <GameItemsModal 
          game={managingItemsForGame} 
          onClose={() => setManagingItemsForGame(null)} 
        />
      )}
    </>
  );
}
