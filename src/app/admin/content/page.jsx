"use client"
import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { adminFetch } from '@/lib/adminFetch';

export default function ContentComponent() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Create/Edit Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [formData, setFormData] = useState({ id: '', title: '', body: '', type: 'news', image_url: '' });
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

  // Delete Modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchNews = async () => {
    try {
      const res = await adminFetch('/api/admin/data?table=content');
      if (!res.ok) throw new Error('Failed to fetch data');
      const data = await res.json();
      setNews(data || []);
    } catch (err) {
      console.error('Error fetching news:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const openCreateModal = () => {
    setModalMode('create');
    setFormData({ id: '', title: '', body: '', type: 'news', image_url: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setModalMode('edit');
    setFormData({ 
      id: item.id, 
      title: item.title || '', 
      body: item.body || '', 
      type: item.type || 'news', 
      image_url: item.image_url || '' 
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openDeleteModal = (item) => {
    setItemToDelete(item);
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
        body: formData.body,
        type: formData.type,
        image_url: formData.image_url
      };

      if (modalMode === 'create') {
        const res = await adminFetch('/api/admin/crud', {
          method: 'POST',
          body: JSON.stringify({ table: 'content', data: payload })
        });
        if (!res.ok) throw new Error('Failed to create');
      } else {
        const res = await adminFetch('/api/admin/crud', {
          method: 'PUT',
          body: JSON.stringify({ table: 'content', id: formData.id, data: payload })
        });
        if (!res.ok) throw new Error('Failed to update');
      }

      await fetchNews();
      closeModal();
    } catch (err) {
      console.error('Error saving news:', err);
      alert('Error saving news');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    setDeleting(true);
    try {
      const res = await adminFetch(`/api/admin/crud?table=content&id=${itemToDelete.id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete');
      await fetchNews();
      closeDeleteModal();
    } catch (err) {
      console.error('Error deleting news:', err);
      alert('Error deleting news');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <main className="flex-1 flex flex-col min-h-screen transition-all duration-300 bg-background relative overflow-y-auto">
        <div className="p-6 md:p-margin-desktop max-w-container-max mx-auto w-full flex flex-col gap-8 pb-24 mt-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">News Management</h1>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1">Manage platform news articles and system updates.</p>
            </div>
            <button 
              onClick={openCreateModal}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-primary-container text-on-primary rounded-lg font-label-md text-label-md shadow-sm hover:scale-105 transition-transform flex-shrink-0"
            >
              <span className="material-symbols-outlined">add</span>
              Create News
            </button>
          </div>

          <div className="flex flex-col gap-6">
            <section>
              <h2 className="font-headline-md text-headline-md text-on-surface mb-4">Latest Articles</h2>
              <div className="grid grid-cols-1 gap-6">
                
                {loading ? (
                  <div className="py-12 flex flex-col items-center justify-center text-on-surface-variant">
                    <span className="material-symbols-outlined animate-spin text-4xl mb-4">progress_activity</span>
                    <p>Loading news...</p>
                  </div>
                ) : news.length === 0 ? (
                  <div className="py-12 flex flex-col items-center justify-center text-on-surface-variant">
                    <p>No news articles found in the database.</p>
                  </div>
                ) : (
                  news.map((item) => (
                    <div key={item.id} className="glass-panel rounded-xl overflow-hidden flex flex-col md:flex-row group relative p-4 gap-6 hover:shadow-md transition-shadow">
                      <div className="h-48 md:w-64 md:h-auto bg-surface-container relative shrink-0 overflow-hidden rounded-lg">
                        {item.image_url ? (
                          <div 
                            className="bg-cover bg-center w-full h-full absolute inset-0 opacity-90 group-hover:scale-105 transition-transform duration-500" 
                            style={{ backgroundImage: `url(${item.image_url})` }}
                          ></div>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-surface-variant text-on-surface-variant">
                            <span className="material-symbols-outlined text-4xl">article</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 flex flex-col">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${item.type === 'news' ? 'bg-primary-container text-on-primary-container' : 'bg-tertiary-container text-on-tertiary-container'}`}>
                            {item.type === 'news' ? 'News' : 'System Update'}
                          </span>
                          <span className="font-caption text-caption text-on-surface-variant">
                            {new Date(item.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <h3 className="font-headline-md text-headline-md text-on-surface mb-2">{item.title}</h3>
                        <p className="font-body-md text-body-md text-on-surface-variant line-clamp-3 mb-6">
                          {item.body}
                        </p>
                        
                        <div className="mt-auto flex gap-3 pt-4 border-t border-outline-variant/30">
                          <button 
                            onClick={() => openEditModal(item)}
                            className="flex items-center gap-2 text-primary font-label-md text-label-md hover:underline"
                          >
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                            Edit
                          </button>
                          <button 
                            onClick={() => openDeleteModal(item)}
                            className="flex items-center gap-2 text-error font-label-md text-label-md hover:underline"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}

              </div>
            </section>
          </div>
        </div>
      </main>

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-surface rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
            <div className="px-6 py-4 border-b border-outline-variant/30 flex justify-between items-center sticky top-0 bg-surface z-10">
              <h2 className="font-headline-md text-headline-md text-on-surface">
                {modalMode === 'create' ? 'Create News Article' : 'Edit News Article'}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-1">Type</label>
                  <select 
                    className="w-full bg-surface-container border border-outline-variant/50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 text-on-surface"
                    value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}
                  >
                    <option value="news">News</option>
                    <option value="update">System Update</option>
                  </select>
                </div>
              </div>
              
              {/* Image Upload Field */}
              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-1">Cover Image</label>
                
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
                    <input 
                      type="file" 
                      accept="image/*"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                    <div className="flex gap-2">
                      <input 
                        type="url" 
                        placeholder="Or paste image URL"
                        className="w-full bg-surface-container border border-outline-variant/50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 text-on-surface"
                        value={formData.image_url} 
                        onChange={e => setFormData({...formData, image_url: e.target.value})}
                      />
                      <button 
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingImage}
                        className="bg-surface-container-high text-on-surface px-4 py-2 rounded-lg border border-outline-variant hover:bg-surface-variant transition-colors flex items-center gap-2 disabled:opacity-50"
                      >
                        <span className="material-symbols-outlined text-[18px]">upload_file</span>
                      </button>
                    </div>
                    <p className="text-xs text-on-surface-variant mt-2">Upload a file or paste a direct URL (max 10MB).</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-1">Content Body</label>
                <textarea 
                  required rows="8"
                  className="w-full bg-surface-container border border-outline-variant/50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 text-on-surface resize-none"
                  value={formData.body} onChange={e => setFormData({...formData, body: e.target.value})}
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={closeModal} className="px-5 py-2.5 rounded-lg border border-outline-variant text-on-surface hover:bg-surface-container-high transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={saving || uploadingImage} className="px-5 py-2.5 rounded-lg bg-primary text-on-primary hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50">
                  {saving && <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>}
                  Save Article
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
              <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Delete Article</h3>
              <p className="font-body-md text-body-md text-on-surface-variant mb-6">
                Are you sure you want to delete <span className="font-semibold text-on-surface">{itemToDelete?.title}</span>? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-center">
                <button 
                  onClick={closeDeleteModal}
                  disabled={deleting}
                  className="px-6 py-2.5 rounded-lg border border-outline-variant text-on-surface hover:bg-surface-container-high transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  disabled={deleting}
                  className="px-6 py-2.5 rounded-lg bg-error text-white hover:bg-error/90 transition-colors flex items-center gap-2"
                >
                  {deleting && <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>}
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
