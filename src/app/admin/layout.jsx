"use client"
import AdminGuard from '@/components/AdminGuard';
import AdminSidebar from '@/components/AdminSidebar';

export default function AdminLayout({ children }) {
  return (
    <AdminGuard>
      <div className="flex bg-background min-h-screen w-full">
        <AdminSidebar />
        <div className="flex-1 flex flex-col w-full md:ml-64">
          {children}
        </div>
      </div>
    </AdminGuard>
  );
}
