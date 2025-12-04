import { useState } from "react"
import { Folder, Plus, ArrowLeft, HardDrive } from "lucide-react"

export default function Gallery() {
  const [currentPath, setCurrentPath] = useState("")

  // Dummy folder data matching the image
  const folders = [
    "Profile", "React_head...", "About_us_i...", "React_prom...", "Reviewer_i...", "React_gall...", "React_down...", "Product",
    "Payment_mo...", "Advertisem...", "React_land...", "Header_ima...", "Delivery-M...", "Vendor", "Cuisine", "Opportunit...",
    "Admin", "Landing", "React_rest...", "Restaurant", "Page_meta_...", "Campaign", "React_serv...", "Category",
    "Hero_image", "Conversati...", "Meta_image", "Business", "Notificati...", "Meta_data_...", "React_deli...", "Why_choose...",
    "Email_temp...", "Banner", "Available_...", "React_step...", "Feature_im...", "Step_image", "Earn_money", "React_meta..."
  ]

  return (
    <div className="p-4 lg:p-6 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center">
              <Folder className="w-5 h-5 text-yellow-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">File Manager</h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                Local storage
              </button>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-700">Public</span>
                <span className="px-2.5 py-0.5 bg-slate-200 text-slate-700 rounded-full text-xs font-medium">
                  40
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors text-sm font-medium flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add New
              </button>
            </div>
          </div>

          {/* Folder Grid */}
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
            {folders.map((folder, index) => (
              <div
                key={index}
                className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity"
              >
                <div className="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center mb-2">
                  <Folder className="w-8 h-8 text-yellow-600" />
                </div>
                <span className="text-xs text-slate-700 text-center max-w-full truncate">
                  {folder}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
