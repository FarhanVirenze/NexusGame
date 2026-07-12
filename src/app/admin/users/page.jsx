"use client"
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { adminFetch } from '@/lib/adminFetch';

export default function UsersComponent() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [formData, setFormData] = useState({ id: '', email: '', password: '', first_name: '', last_name: '', phone: '', role: 'user', avatar_url: '' });
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

  // Delete Modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // DataTable state
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [sortField, setSortField] = useState('created_at');
  const [sortDir, setSortDir] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  const fetchUsers = async () => {
    try {
      const res = await adminFetch('/api/admin/data?table=users');
      if (!res.ok) throw new Error('Failed to fetch data');
      const data = await res.json();
      setUsers(data || []);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filtered + searched + sorted data
  const filtered = useMemo(() => {
    let result = [...users];

    if (roleFilter !== 'all') {
      result = result.filter(u => u.role === roleFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(u =>
        u.email?.toLowerCase().includes(q) ||
        u.first_name?.toLowerCase().includes(q) ||
        u.last_name?.toLowerCase().includes(q) ||
        u.phone?.toLowerCase().includes(q) ||
        u.id?.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      let valA, valB;
      if (sortField === 'created_at') {
        valA = new Date(a.created_at).getTime();
        valB = new Date(b.created_at).getTime();
      } else if (sortField === 'name') {
        valA = `${a.first_name || ''} ${a.last_name || ''}`.toLowerCase();
        valB = `${b.first_name || ''} ${b.last_name || ''}`.toLowerCase();
      } else if (sortField === 'email') {
        valA = (a.email || '').toLowerCase();
        valB = (b.email || '').toLowerCase();
      } else {
        valA = a[sortField] || '';
        valB = b[sortField] || '';
      }
      if (valA < valB) return sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [users, searchQuery, roleFilter, sortField, sortDir]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  useEffect(() => { setCurrentPage(1); }, [searchQuery, roleFilter]);

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <span className="material-symbols-outlined text-[14px] ml-1 opacity-30">unfold_more</span>;
    return <span className="material-symbols-outlined text-[14px] ml-1 text-primary">{sortDir === 'asc' ? 'arrow_upward' : 'arrow_downward'}</span>;
  };

  const openCreateModal = () => {
    setModalMode('create');
    setFormData({ id: '', email: '', password: '', first_name: '', last_name: '', phone: '', role: 'user', avatar_url: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setModalMode('edit');
    setFormData({ 
      id: user.id, email: user.email || '', password: '', 
      first_name: user.first_name || '', last_name: user.last_name || '', 
      phone: user.phone || '', role: user.role || 'user', avatar_url: user.avatar_url || ''
    });
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const openDeleteModal = (user) => { setItemToDelete(user); setIsDeleteModalOpen(true); };
  const closeDeleteModal = () => { setIsDeleteModalOpen(false); setItemToDelete(null); };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const payload = new FormData();
      payload.append('file', file);
      payload.append('bucket', 'avatars');

      const res = await adminFetch('/api/admin/upload', {
        method: 'POST',
        body: payload,
      });
      const data = await res.json();
      if (res.ok) { setFormData({ ...formData, avatar_url: data.url }); }
      else { alert(data.error || 'Failed to upload image'); }
    } catch (err) {
      alert('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let payload = {
        first_name: formData.first_name, last_name: formData.last_name,
        phone: formData.phone, role: formData.role, avatar_url: formData.avatar_url
      };
      if (modalMode === 'create') {
        payload.email = formData.email;
        payload.password = formData.password;
        const res = await adminFetch('/api/admin/crud', { method: 'POST', body: JSON.stringify({ table: 'users', data: payload }) });
        if (!res.ok) throw new Error('Failed to create user');
      } else {
        const res = await adminFetch('/api/admin/crud', { method: 'PUT', body: JSON.stringify({ table: 'users', id: formData.id, data: payload }) });
        if (!res.ok) throw new Error('Failed to update user');
      }
      await fetchUsers();
      closeModal();
    } catch (err) {
      alert('Error saving user: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    setDeleting(true);
    try {
      const res = await adminFetch(`/api/admin/crud?table=users&id=${itemToDelete.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      await fetchUsers();
      closeDeleteModal();
    } catch (err) {
      alert('Error deleting user');
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
              <h1 className="font-headline-lg text-headline-lg text-on-surface">User Management</h1>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1">Manage registered users, their roles, and account statuses.</p>
            </div>
            <button 
              onClick={openCreateModal}
              className="bg-primary text-on-primary font-label-md text-label-md px-6 py-3 rounded-lg shadow-sm hover:shadow-md hover:scale-[1.02] transition-all flex items-center justify-center gap-2 whitespace-nowrap self-start md:self-auto"
            >
              <span className="material-symbols-outlined text-[18px]">person_add</span>
              Add User
            </button>
          </div>

          {/* DataTable Panel */}
          <div className="glass-panel rounded-xl overflow-hidden border border-outline-variant/30 flex flex-col">
            {/* Search & Filter Bar */}
            <div className="p-4 border-b border-outline-variant/30 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between bg-surface-container-lowest/30">
              <div className="relative flex-1 w-full sm:max-w-sm">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
                <input
                  type="text"
                  placeholder="Search by name, email, phone..."
                  className="w-full pl-10 pr-4 py-2.5 bg-surface-container border border-outline-variant/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-on-surface text-sm"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <select
                  className="bg-surface-container border border-outline-variant/40 rounded-lg px-3 py-2.5 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={roleFilter}
                  onChange={e => setRoleFilter(e.target.value)}
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
                <div className="text-sm text-on-surface-variant whitespace-nowrap">
                  {filtered.length} user{filtered.length !== 1 && 's'}
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-outline-variant/30 bg-surface-container/50">
                    <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant whitespace-nowrap cursor-pointer select-none hover:text-primary transition-colors" onClick={() => toggleSort('name')}>
                      <span className="inline-flex items-center">User<SortIcon field="name" /></span>
                    </th>
                    <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant whitespace-nowrap cursor-pointer select-none hover:text-primary transition-colors" onClick={() => toggleSort('email')}>
                      <span className="inline-flex items-center">Contact<SortIcon field="email" /></span>
                    </th>
                    <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant whitespace-nowrap cursor-pointer select-none hover:text-primary transition-colors" onClick={() => toggleSort('role')}>
                      <span className="inline-flex items-center">Role<SortIcon field="role" /></span>
                    </th>
                    <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant whitespace-nowrap cursor-pointer select-none hover:text-primary transition-colors" onClick={() => toggleSort('created_at')}>
                      <span className="inline-flex items-center">Joined<SortIcon field="created_at" /></span>
                    </th>
                    <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant text-right whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {loading ? (
                    <tr><td colSpan="5" className="py-12 text-center text-on-surface-variant">
                      <span className="material-symbols-outlined animate-spin text-3xl">progress_activity</span>
                      <p className="mt-3">Loading users...</p>
                    </td></tr>
                  ) : paginated.length === 0 ? (
                    <tr><td colSpan="5" className="py-12 text-center text-on-surface-variant">
                      <span className="material-symbols-outlined text-4xl mb-2">search_off</span>
                      <p className="mt-2">{searchQuery || roleFilter !== 'all' ? 'No users match your filters.' : 'No users found.'}</p>
                    </td></tr>
                  ) : (
                    paginated.map((user) => (
                      <tr key={user.id} className="hover:bg-surface-container-lowest/50 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden">
                              {user.avatar_url ? (
                                <img src={user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                              ) : (
                                (user.first_name?.[0] || user.email[0]).toUpperCase()
                              )}
                            </div>
                            <div>
                              <div className="font-body-md text-on-surface font-semibold truncate max-w-[150px]">
                                {user.first_name} {user.last_name}
                              </div>
                              <div className="font-caption text-caption text-on-surface-variant mt-0.5 font-mono text-[10px]">
                                {user.id.substring(0, 8)}...
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-body-md text-on-surface truncate max-w-[200px]">{user.email}</div>
                          {user.phone && <div className="font-caption text-caption text-on-surface-variant mt-0.5">{user.phone}</div>}
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                            user.role === 'admin' 
                              ? 'bg-secondary-container text-on-secondary-container border border-secondary-container/50' 
                              : 'bg-surface-variant text-on-surface-variant border border-outline-variant/30'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-on-surface-variant text-sm">
                          {new Date(user.created_at).toLocaleDateString('id-ID')}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => openEditModal(user)} className="w-8 h-8 rounded hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center" title="Edit User">
                              <span className="material-symbols-outlined text-[18px]">edit</span>
                            </button>
                            <button onClick={() => openDeleteModal(user)} className="w-8 h-8 rounded hover:bg-surface-container-high text-on-surface-variant hover:text-error transition-colors flex items-center justify-center" title="Delete User">
                              <span className="material-symbols-outlined text-[18px]">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {!loading && totalPages > 0 && (
              <div className="p-4 border-t border-outline-variant/30 flex flex-col sm:flex-row items-center justify-between gap-3 bg-surface-container-lowest/30">
                <div className="font-caption text-caption text-on-surface-variant">
                  Showing {Math.min((currentPage - 1) * perPage + 1, filtered.length)}–{Math.min(currentPage * perPage, filtered.length)} of {filtered.length} users
                </div>
                <div className="flex items-center gap-1">
                  <button disabled={currentPage === 1} onClick={() => setCurrentPage(1)} className="w-9 h-9 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                    <span className="material-symbols-outlined text-[18px]">first_page</span>
                  </button>
                  <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="w-9 h-9 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
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
                        <button key={p} onClick={() => setCurrentPage(p)}
                          className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${
                            currentPage === p ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:bg-surface-container'
                          }`}>{p}</button>
                      )
                    )}

                  <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="w-9 h-9 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                    <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                  </button>
                  <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)} className="w-9 h-9 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                    <span className="material-symbols-outlined text-[18px]">last_page</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-surface rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
            <div className="px-6 py-4 border-b border-outline-variant/30 flex justify-between items-center sticky top-0 bg-surface z-10">
              <h2 className="font-headline-md text-headline-md text-on-surface">
                {modalMode === 'create' ? 'Add New User' : 'Edit User'}
              </h2>
              <button onClick={closeModal} className="text-on-surface-variant hover:text-error transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 flex flex-col gap-4">
              {/* Avatar Upload */}
              <div className="flex justify-center mb-2">
                <div className="w-24 h-24 rounded-full bg-surface-container border-2 border-outline-variant flex items-center justify-center overflow-hidden group cursor-pointer relative"
                  onClick={() => fileInputRef.current?.click()}>
                  {formData.avatar_url ? (
                    <img src={formData.avatar_url} alt="Avatar Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="material-symbols-outlined text-on-surface-variant text-4xl">person</span>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                    <span className="material-symbols-outlined mb-1 text-sm">photo_camera</span>
                    <span className="text-[10px]">Upload</span>
                  </div>
                  {uploadingImage && (
                    <div className="absolute inset-0 bg-surface-container/80 flex items-center justify-center backdrop-blur-sm">
                      <span className="material-symbols-outlined animate-spin text-primary">progress_activity</span>
                    </div>
                  )}
                </div>
                <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleImageUpload} />
              </div>

              {modalMode === 'create' && (
                <>
                  <div>
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-1">Email</label>
                    <input type="email" required className="w-full bg-surface-container border border-outline-variant/50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 text-on-surface"
                      value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                  </div>
                  <div>
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-1">Password</label>
                    <input type="password" required minLength="6" className="w-full bg-surface-container border border-outline-variant/50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 text-on-surface"
                      value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                  </div>
                </>
              )}
              {modalMode === 'edit' && (
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-1">Email</label>
                  <input type="email" disabled className="w-full bg-surface-variant/50 border border-outline-variant/30 rounded-lg px-4 py-2 text-on-surface-variant cursor-not-allowed" value={formData.email} />
                  <p className="text-xs text-on-surface-variant mt-1">Email cannot be changed here.</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-1">First Name</label>
                  <input type="text" required className="w-full bg-surface-container border border-outline-variant/50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 text-on-surface"
                    value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} />
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-1">Last Name</label>
                  <input type="text" required className="w-full bg-surface-container border border-outline-variant/50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 text-on-surface"
                    value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-1">Phone</label>
                  <input type="tel" className="w-full bg-surface-container border border-outline-variant/50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 text-on-surface"
                    value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-1">Role</label>
                  <select className="w-full bg-surface-container border border-outline-variant/50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 text-on-surface"
                    value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={closeModal} className="px-5 py-2.5 rounded-lg border border-outline-variant text-on-surface hover:bg-surface-container-high transition-colors">Cancel</button>
                <button type="submit" disabled={saving || uploadingImage} className="px-5 py-2.5 rounded-lg bg-primary text-on-primary hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50">
                  {saving && <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>}
                  Save User
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
              <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Delete User</h3>
              <p className="font-body-md text-body-md text-on-surface-variant mb-2">
                Are you sure you want to delete <span className="font-semibold text-on-surface">{itemToDelete?.email}</span>?
              </p>
              <p className="font-caption text-caption text-error mb-6">
                This will completely remove their account and all associated data. This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-center">
                <button onClick={closeDeleteModal} disabled={deleting} className="px-6 py-2.5 rounded-lg border border-outline-variant text-on-surface hover:bg-surface-container-high transition-colors">Cancel</button>
                <button onClick={confirmDelete} disabled={deleting} className="px-6 py-2.5 rounded-lg bg-error text-white hover:bg-error/90 transition-colors flex items-center gap-2">
                  {deleting && <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>}
                  Delete User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
