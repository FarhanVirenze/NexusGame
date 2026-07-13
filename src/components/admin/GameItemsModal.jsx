import React, { useState, useEffect, useRef, useMemo } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { adminFetch } from '@/lib/adminFetch';

export default function GameItemsModal({ game, onClose }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [togglingProvider, setTogglingProvider] = useState(null);
  const [togglingAll, setTogglingAll] = useState(false);
  const [providerFilter, setProviderFilter] = useState('all');

  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [formData, setFormData] = useState({ id: '', name: '', price: '', category: '', bonus: '', icon_url: '', sku: '', provider: '' });
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await adminFetch(`/api/admin/data?table=game_items&game_id=${game.id}`);
      if (!res.ok) throw new Error('Failed to fetch items');
      let data = await res.json();

      if (Array.isArray(data)) {
        data = data.filter(item => item.game_id === game.id);
      }

      setItems(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (game) {
      fetchItems();
    }
  }, [game]);

  const providerStats = useMemo(() => {
    const map = {};
    items.forEach(i => {
      const p = i.provider || 'Tanpa Provider';
      if (!map[p]) map[p] = { total: 0, visible: 0, hidden: 0 };
      map[p].total++;
      if (i.visible === false) map[p].hidden++;
      else map[p].visible++;
    });
    return map;
  }, [items]);

  const providers = useMemo(() => {
    return Object.keys(providerStats).sort();
  }, [providerStats]);

  const filteredItems = useMemo(() => {
    let result = [...items];
    if (providerFilter !== 'all') {
      result = result.filter(i => (i.provider || 'Tanpa Provider') === providerFilter);
    }
    result.sort((a, b) => Number(a.price) - Number(b.price));
    return result;
  }, [items, providerFilter]);

  const handleSync = async () => {
    if (!confirm('Sync semua produk dari semua provider? Produk baru akan ditambahkan dan harga akan diperbarui.')) return;

    setSyncing(true);
    try {
      const res = await adminFetch('/api/admin/sync-products', {
        method: 'POST',
        body: JSON.stringify({ gameId: game.id }),
      });
      const result = await res.json();

      if (res.ok && result.success) {
        alert(result.message);
        await fetchItems();
      } else {
        alert(result.error || 'Gagal sync produk');
      }
    } catch (err) {
      alert('Error syncing: ' + err.message);
    } finally {
      setSyncing(false);
    }
  };

  const toggleProviderVisibility = async (provider, visible) => {
    const newVisible = !visible;
    setTogglingProvider(provider);
    try {
      await adminFetch('/api/admin/crud-batch', {
        method: 'POST',
        body: JSON.stringify({
          table: 'game_items',
          filter: { game_id: game.id, provider: provider === 'Tanpa Provider' ? null : provider },
          data: { visible: newVisible }
        })
      });
      await fetchItems();
    } catch (err) {
      alert('Gagal update visibility: ' + err.message);
    } finally {
      setTogglingProvider(null);
    }
  };

  const toggleAllVisibility = async (visible) => {
    setTogglingAll(true);
    try {
      await adminFetch('/api/admin/crud-batch', {
        method: 'POST',
        body: JSON.stringify({
          table: 'game_items',
          filter: { game_id: game.id },
          data: { visible }
        })
      });
      await fetchItems();
    } catch (err) {
      alert('Gagal update visibility: ' + err.message);
    } finally {
      setTogglingAll(false);
    }
  };

  const toggleItemVisibility = async (item) => {
    await adminFetch('/api/admin/crud', {
      method: 'PUT',
      body: JSON.stringify({ table: 'game_items', id: item.id, data: { visible: !item.visible } })
    });
    await fetchItems();
  };

  const openCreateForm = () => {
    setFormMode('create');
    setFormData({ id: '', name: '', price: '', category: 'Diamonds', bonus: '', icon_url: '', sku: '', provider: '' });
    setShowForm(true);
  };

  const openEditForm = (item) => {
    setFormMode('edit');
    setFormData({ ...item });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        game_id: game.id,
        name: formData.name,
        price: parseFloat(formData.price) || 0,
        category: formData.category,
        bonus: formData.bonus,
        icon_url: formData.icon_url,
        sku: formData.sku || null,
        provider: formData.provider || null,
      };

      if (formMode === 'create') {
        const res = await adminFetch('/api/admin/crud', {
          method: 'POST',
          body: JSON.stringify({ table: 'game_items', data: payload })
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.error || 'Failed to create item');
      } else {
        const res = await adminFetch('/api/admin/crud', {
          method: 'PUT',
          body: JSON.stringify({ table: 'game_items', id: formData.id, data: payload })
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.error || 'Failed to update item');
      }

      await fetchItems();
      setShowForm(false);
    } catch (err) {
      alert(err.message || 'Error saving item');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      await adminFetch(`/api/admin/crud?table=game_items&id=${id}`, { method: 'DELETE' });
      await fetchItems();
    } catch (err) {
      alert('Error deleting item');
    }
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
        setFormData({ ...formData, icon_url: data.url });
      } else {
        alert(data.error || 'Failed to upload image');
      }
    } catch (error) {
      alert('Error uploading image: ' + error.message);
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-surface rounded-2xl w-full max-w-6xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-lowest">
          <div>
            <h2 className="font-headline-md text-headline-md text-on-surface">Manage Items</h2>
            <p className="font-caption text-caption text-on-surface-variant">Game: {game.title} | {items.length} produk total</p>
          </div>
          <button onClick={onClose} className="text-on-surface-variant hover:text-error transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-background">
          {!showForm ? (
            <>
              <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
                <h3 className="font-title-md text-on-surface">Daftar Produk</h3>
                <div className="flex gap-2">
                  <button
                    onClick={handleSync}
                    disabled={syncing}
                    className="bg-tertiary text-on-tertiary px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1 hover:bg-tertiary/90 transition-colors disabled:opacity-50"
                  >
                    <span className={`material-symbols-outlined text-[18px] ${syncing ? 'animate-spin' : ''}`}>{syncing ? 'progress_activity' : 'sync'}</span>
                    {syncing ? 'Syncing...' : 'Sync All Providers'}
                  </button>
                  <button
                    onClick={openCreateForm}
                    className="bg-primary text-on-primary px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1 hover:bg-primary/90 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">add</span> Add Item
                  </button>
                </div>
              </div>

              {providers.length > 0 && (
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs text-on-surface-variant font-medium">Filter Provider:</p>
                    <div className="flex gap-1">
                      <button
                        onClick={() => toggleAllVisibility(true)}
                        disabled={togglingAll}
                        className="px-2 py-1 rounded text-[10px] font-medium bg-green-50 text-green-700 hover:bg-green-100 transition-colors disabled:opacity-50"
                      >
                        {togglingAll ? '...' : 'Tampilkan Semua'}
                      </button>
                      <button
                        onClick={() => toggleAllVisibility(false)}
                        disabled={togglingAll}
                        className="px-2 py-1 rounded text-[10px] font-medium bg-red-50 text-red-700 hover:bg-red-100 transition-colors disabled:opacity-50"
                      >
                        {togglingAll ? '...' : 'Sembunyikan Semua'}
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    <button
                      onClick={() => setProviderFilter('all')}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                        providerFilter === 'all'
                          ? 'bg-primary text-on-primary'
                          : 'bg-surface-container border border-outline-variant text-on-surface-variant hover:bg-surface-container-high'
                      }`}
                    >
                      Semua ({items.length})
                    </button>
                    {providers.map(p => {
                      const stats = providerStats[p];
                      const allHidden = stats.hidden === stats.total;
                      return (
                        <div key={p} className="flex items-center gap-1">
                          <button
                            onClick={() => setProviderFilter(p)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                              providerFilter === p
                                ? 'bg-primary text-on-primary'
                                : allHidden
                                  ? 'bg-surface-container border border-outline-variant text-on-surface-variant/50 line-through'
                                  : 'bg-surface-container border border-outline-variant text-on-surface-variant hover:bg-surface-container-high'
                            }`}
                          >
                            {p} ({stats.visible}/{stats.total})
                          </button>
                          <button
                            onClick={() => toggleProviderVisibility(p, !allHidden)}
                            disabled={togglingProvider === p}
                            className={`p-1 rounded-full transition-colors ${togglingProvider === p ? 'opacity-50' : allHidden ? 'text-error hover:bg-error/10' : 'text-green-600 hover:bg-green-50'}`}
                            title={allHidden ? 'Tampilkan semua dari provider ini' : 'Sembunyikan semua dari provider ini'}
                          >
                            <span className={`material-symbols-outlined text-[16px] ${togglingProvider === p ? 'animate-spin' : ''}`}>{togglingProvider === p ? 'progress_activity' : allHidden ? 'visibility_off' : 'visibility'}</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {loading ? (
                <div className="py-12 text-center text-on-surface-variant flex flex-col items-center">
                  <span className="material-symbols-outlined animate-spin text-3xl mb-2">progress_activity</span>
                  <p>Loading items...</p>
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="py-12 text-center bg-surface-container-lowest rounded-xl border border-outline-variant/30">
                  <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-2">inventory_2</span>
                  <p className="text-on-surface-variant">
                    {providerFilter !== 'all' ? `Tidak ada produk dari ${providerFilter}.` : 'Belum ada produk. Klik Sync All Providers untuk mulai.'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto bg-surface-container-lowest rounded-xl border border-outline-variant/30">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-outline-variant/30 bg-surface-container/30">
                        <th className="p-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Item Name</th>
                        <th className="p-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">SKU</th>
                        <th className="p-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Provider</th>
                        <th className="p-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Category</th>
                        <th className="p-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Harga Jual</th>
                        <th className="p-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Modal</th>
                        <th className="p-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider text-center">Visible</th>
                        <th className="p-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/20">
                      {filteredItems.map(item => (
                        <tr key={item.id} className={`hover:bg-surface-container/50 transition-colors ${item.visible === false ? 'opacity-50' : ''}`}>
                          <td className="p-3 font-medium text-on-surface flex items-center gap-2">
                            {item.icon_url ? (
                              <img src={item.icon_url} alt="icon" className="w-6 h-6 object-contain" />
                            ) : (
                              <span className="material-symbols-outlined text-primary text-[20px]">diamond</span>
                            )}
                            <div>
                              <div className="text-sm">{item.name}</div>
                              {item.bonus && <div className="text-xs text-tertiary">Bonus: {item.bonus}</div>}
                            </div>
                          </td>
                          <td className="p-3 text-xs font-mono text-on-surface-variant">{item.sku || '-'}</td>
                          <td className="p-3">
                            {item.provider ? (
                              <span className="inline-block px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-semibold">
                                {item.provider}
                              </span>
                            ) : (
                              <span className="text-on-surface-variant text-xs">-</span>
                            )}
                          </td>
                          <td className="p-3 text-sm text-on-surface-variant">{item.category}</td>
                          <td className="p-3 text-sm font-semibold text-on-surface">Rp {Number(item.price).toLocaleString('id-ID')}</td>
                          <td className="p-3 text-xs text-on-surface-variant">
                            {item.apigames_price ? `Rp ${Number(item.apigames_price).toLocaleString('id-ID')}` : '-'}
                          </td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => toggleItemVisibility(item)}
                              className={`p-1.5 rounded-lg transition-colors ${item.visible === false ? 'text-error hover:bg-error/10' : 'text-green-600 hover:bg-green-50'}`}
                              title={item.visible === false ? 'Sembunyikan dari user' : 'Tampilkan ke user'}
                            >
                              <span className="material-symbols-outlined text-[18px]">{item.visible === false ? 'visibility_off' : 'visibility'}</span>
                            </button>
                          </td>
                          <td className="p-3 text-right">
                            <button onClick={() => openEditForm(item)} className="p-1.5 text-on-surface-variant hover:text-primary transition-colors">
                              <span className="material-symbols-outlined text-[18px]">edit</span>
                            </button>
                            <button onClick={() => handleDelete(item.id)} className="p-1.5 text-on-surface-variant hover:text-error transition-colors">
                              <span className="material-symbols-outlined text-[18px]">delete</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          ) : (
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-6">
              <div className="flex items-center gap-3 mb-6 border-b border-outline-variant/30 pb-4">
                <button onClick={closeForm} className="text-on-surface-variant hover:text-on-surface">
                  <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h3 className="font-title-md text-on-surface">
                  {formMode === 'create' ? 'Add New Item' : 'Edit Item'}
                </h3>
              </div>

              <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-full md:col-span-1">
                  <label className="block text-sm font-medium text-on-surface-variant mb-1">Item Name</label>
                  <input type="text" required placeholder="e.g. 5 Diamonds" className="w-full bg-surface border border-outline-variant/50 rounded-lg px-4 py-2 text-on-surface focus:ring-2 focus:ring-primary/50"
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="col-span-full md:col-span-1">
                  <label className="block text-sm font-medium text-on-surface-variant mb-1">SKU</label>
                  <input type="text" placeholder="e.g. ML86, FF50, GPGI60" className="w-full bg-surface border border-outline-variant/50 rounded-lg px-4 py-2 text-on-surface focus:ring-2 focus:ring-primary/50 font-mono"
                    value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} />
                </div>
                <div className="col-span-full md:col-span-1">
                  <label className="block text-sm font-medium text-on-surface-variant mb-1">Price (Rp) - Jual ke Customer</label>
                  <input type="number" required min="0" className="w-full bg-surface border border-outline-variant/50 rounded-lg px-4 py-2 text-on-surface focus:ring-2 focus:ring-primary/50"
                    value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                </div>
                <div className="col-span-full md:col-span-1">
                  <label className="block text-sm font-medium text-on-surface-variant mb-1">Category</label>
                  <input type="text" placeholder="e.g. Diamonds, Weekly Pass" className="w-full bg-surface border border-outline-variant/50 rounded-lg px-4 py-2 text-on-surface focus:ring-2 focus:ring-primary/50"
                    value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
                </div>
                <div className="col-span-full md:col-span-1">
                  <label className="block text-sm font-medium text-on-surface-variant mb-1">Provider</label>
                  <input type="text" placeholder="e.g. Smile One, Unipin ID" className="w-full bg-surface border border-outline-variant/50 rounded-lg px-4 py-2 text-on-surface focus:ring-2 focus:ring-primary/50"
                    value={formData.provider || ''} onChange={e => setFormData({...formData, provider: e.target.value})} />
                </div>
                <div className="col-span-full md:col-span-1">
                  <label className="block text-sm font-medium text-on-surface-variant mb-1">Bonus Text (Optional)</label>
                  <input type="text" placeholder="e.g. 11+1" className="w-full bg-surface border border-outline-variant/50 rounded-lg px-4 py-2 text-on-surface focus:ring-2 focus:ring-primary/50"
                    value={formData.bonus || ''} onChange={e => setFormData({...formData, bonus: e.target.value})} />
                </div>
                <div className="col-span-full">
                  <label className="block text-sm font-medium text-on-surface-variant mb-1">Icon Image (Optional)</label>
                  <div className="flex items-center gap-4">
                    {formData.icon_url && (
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-outline-variant/30 bg-surface-container-lowest flex-shrink-0">
                        <img src={formData.icon_url} alt="Icon Preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setFormData({...formData, icon_url: ''})}
                          className="absolute top-1 right-1 bg-error/90 text-on-error rounded-full p-0.5 hover:bg-error transition-colors shadow-sm"
                        >
                          <span className="material-symbols-outlined text-[14px]">close</span>
                        </button>
                      </div>
                    )}
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        ref={fileInputRef}
                        className="hidden"
                        id="icon-upload"
                      />
                      <label
                        htmlFor="icon-upload"
                        className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-outline-variant hover:bg-surface-container transition-colors ${uploadingImage ? 'opacity-50 pointer-events-none' : ''}`}
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {uploadingImage ? 'hourglass_empty' : 'upload'}
                        </span>
                        {uploadingImage ? 'Uploading...' : 'Choose Image'}
                      </label>
                    </div>
                  </div>
                </div>

                <div className="col-span-full flex justify-end gap-3 mt-4">
                  <button type="button" onClick={closeForm} className="px-4 py-2 rounded-lg border border-outline-variant hover:bg-surface-container transition-colors">Cancel</button>
                  <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg bg-primary text-on-primary hover:bg-primary/90 transition-colors flex items-center gap-2">
                    {saving && <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>}
                    Save Item
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
