import { useState } from "react"
import { Outlet } from "react-router-dom"
import AdminSidebar from "./AdminSidebar"
import AdminNavbar from "./AdminNavbar"

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-80 w-full">
        {/* Top Navbar */}
        <AdminNavbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        {/* Page Content */}
        <main className="pt-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
