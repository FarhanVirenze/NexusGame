"use client"
import React, { useEffect, useState, useRef } from 'react';
import { adminFetch } from '@/lib/adminFetch';

export default function PromotionsComponent() {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Create/Edit Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [formData, setFormData] = useState({ id: '', title: '', description: '', image_url: '', valid_until: '' });
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

  // Delete Modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchPromotions = async () => {
    try {
      const res = await adminFetch('/api/admin/data?table=promotions');
      if (!res.ok) throw new Error('Failed to fetch data');
      const data = await res.json();
      setPromotions(data || []);
    } catch (err) {
      console.error('Error fetching promotions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const openCreateModal = () => {
    setModalMode('create');
    setFormData({ id: '', title: '', description: '', image_url: '', valid_until: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setModalMode('edit');
    setFormData({ 
      id: item.id, 
      title: item.title || '', 
      description: item.description || '', 
      image_url: item.image_url || '', 
      valid_until: item.valid_until ? new Date(item.valid_until).toISOString().split('T')[0] : '' 
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
        description: formData.description,
        image_url: formData.image_url,
        valid_until: formData.valid_until ? new Date(formData.valid_until).toISOString() : null
      };

      if (modalMode === 'create') {
        const result = await res.json();
        if (!res.ok) throw new Error(result.error || 'Failed to create');
      } else {
        const res = await adminFetch('/api/admin/crud', {
          method: 'PUT',
          body: JSON.stringify({ table: 'promotions', id: formData.id, data: payload })
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.error || 'Failed to update');
      }

      await fetchPromotions();
      closeModal();
    } catch (err) {
      console.error('Error saving promotion:', err);
      alert(err.message || 'Error saving promotion');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    setDeleting(true);
    try {
      const res = await adminFetch(`/api/admin/crud?table=promotions&id=${itemToDelete.id}`, {
        method: 'DELETE'
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to delete');
      await fetchPromotions();
      closeDeleteModal();
    } catch (err) {
      console.error('Error deleting promotion:', err);
      alert(err.message || 'Error deleting promotion');
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
              <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">Manage Promotions</h1>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1">Manage platform banners, discounts, and active promotions.</p>
            </div>
            <button 
              onClick={openCreateModal}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-primary-container text-on-primary rounded-lg font-label-md text-label-md shadow-sm hover:scale-105 transition-transform flex-shrink-0"
            >
              <span className="material-symbols-outlined">campaign</span>
              Create Promo
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loading ? (
              <div className="col-span-full py-12 flex flex-col items-center justify-center text-on-surface-variant">
                <span className="material-symbols-outlined animate-spin text-4xl mb-4">progress_activity</span>
                <p>Loading promotions...</p>
              </div>
            ) : promotions.length === 0 ? (
              <div className="col-span-full py-12 flex flex-col items-center justify-center text-on-surface-variant">
                <p>No active promotions found in the database.</p>
              </div>
            ) : (
              promotions.map((promo) => (
                <div key={promo.id} className="glass-panel rounded-xl overflow-hidden group relative flex flex-col h-full hover:shadow-md transition-shadow">
                  <div className="h-48 bg-surface-container relative">
                    {promo.image_url ? (
                      <img src={promo.image_url} alt={promo.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-on-surface-variant">
                        <span className="material-symbols-outlined text-4xl">image</span>
                      </div>
                    )}
                    <div className="absolute top-4 left-4 bg-error text-white font-label-md text-label-md px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">local_offer</span> PROMO
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="font-headline-md text-[20px] text-on-surface mb-2">{promo.title}</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2 mb-4">
                      {promo.description}
                    </p>
                    <div className="mt-auto flex items-center justify-between border-t border-outline-variant/30 pt-4">
                      <div className="font-caption text-caption font-semibold text-primary">
                        Valid until: {promo.valid_until ? new Date(promo.valid_until).toLocaleDateString() : 'No expiry'}
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => openEditModal(promo)}
                          className="p-2 text-on-surface hover:text-primary transition-colors bg-surface-container rounded-lg"
                        >
                          <span className="material-symbols-outlined">edit</span>
                        </button>
                        <button 
                          onClick={() => openDeleteModal(promo)}
                          className="p-2 text-on-surface hover:text-error transition-colors bg-surface-container rounded-lg"
                        >
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-surface rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
            <div className="px-6 py-4 border-b border-outline-variant/30 flex justify-between items-center sticky top-0 bg-surface z-10">
              <h2 className="font-headline-md text-headline-md text-on-surface">
                {modalMode === 'create' ? 'Create Promotion Banner' : 'Edit Promotion Banner'}
              </h2>
              <button onClick={closeModal} className="text-on-surface-variant hover:text-error transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 flex flex-col gap-4">
              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-1">Promo Title</label>
                <input 
                  type="text" required
                  className="w-full bg-surface-container border border-outline-variant/50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 text-on-surface"
                  value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-1">Valid Until</label>
                <input 
                  type="date" 
                  className="w-full bg-surface-container border border-outline-variant/50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 text-on-surface [color-scheme:dark]"
                  value={formData.valid_until} onChange={e => setFormData({...formData, valid_until: e.target.value})}
                />
              </div>

              {/* Image Upload Field */}
              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-1">Banner Image</label>
                
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div 
                    className="w-32 h-24 rounded-lg bg-surface-container border border-outline-variant flex items-center justify-center shrink-0 overflow-hidden group cursor-pointer relative"
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
                <label className="block font-label-md text-label-md text-on-surface-variant mb-1">Description</label>
                <textarea 
                  rows="3"
                  className="w-full bg-surface-container border border-outline-variant/50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 text-on-surface resize-none"
                  value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={closeModal} className="px-5 py-2.5 rounded-lg border border-outline-variant text-on-surface hover:bg-surface-container-high transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={saving || uploadingImage} className="px-5 py-2.5 rounded-lg bg-primary text-on-primary hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50">
                  {saving && <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>}
                  Save Promo
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
              <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Delete Promotion</h3>
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
