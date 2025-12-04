import { Pencil, Settings } from "lucide-react"

const seoPages = [
  { id: 1, name: "Restaurant list" },
  { id: 2, name: "Category list" },
  { id: 3, name: "Campaign" },
  { id: 4, name: "Cuisine list" },
  { id: 5, name: "Home page" },
  { id: 6, name: "Contact us page" },
  { id: 7, name: "About us page" },
  { id: 8, name: "Restaurant join page" },
  { id: 9, name: "Deliveryman join page" },
  { id: 10, name: "Terms and conditions page" },
  { id: 11, name: "Privacy policy page" },
  { id: 12, name: "Refund policy page" },
  { id: 13, name: "Cancellation policy page" },
  { id: 14, name: "Shipping policy page" }
]

export default function PageMetaData() {
  const handleEdit = (pageId) => {
    console.log("Edit page:", pageId)
    // Navigate to edit page or open modal
  }

  return (
    <div className="p-2 lg:p-3 bg-slate-50 min-h-screen">
      <div className="w-full mx-auto max-w-6xl">
        {/* Page Title */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center">
              <Settings className="w-3.5 h-3.5 text-white" />
            </div>
            <h1 className="text-lg font-bold text-slate-900">Manage Page SEO</h1>
          </div>
        </div>

        {/* SEO Setup List */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <h2 className="text-sm font-semibold text-slate-900 mb-3">SEO Setup List</h2>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-3 py-2 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                    SI
                  </th>
                  <th className="px-3 py-2 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                    Pages
                  </th>
                  <th className="px-3 py-2 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {seoPages.map((page, index) => (
                  <tr key={page.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-3 py-2.5">
                      <span className="text-xs text-slate-700">{index + 1}</span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="text-xs text-slate-700">{page.name}</span>
                    </td>
                    <td className="px-3 py-2.5">
                      <button
                        type="button"
                        onClick={() => handleEdit(page.id)}
                        className="px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
                      >
                        <Pencil className="w-3 h-3" />
                        <span>Edit Content</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
