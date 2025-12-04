import { useState, useMemo } from "react"
import { Search, Settings, MoreVertical, Building2 } from "lucide-react"
import { adRequestsDummy } from "../../data/adRequestsDummy"

export default function AdRequests() {
  const [activeTab, setActiveTab] = useState("new")
  const [searchQuery, setSearchQuery] = useState("")
  const [requests, setRequests] = useState(adRequestsDummy)

  const filteredRequests = useMemo(() => {
    if (!searchQuery.trim()) {
      return requests
    }
    
    const query = searchQuery.toLowerCase().trim()
    return requests.filter(request =>
      request.adsId.toLowerCase().includes(query) ||
      request.restaurantName.toLowerCase().includes(query) ||
      request.adsTitle.toLowerCase().includes(query)
    )
  }, [requests, searchQuery])

  const tabs = [
    { key: "new", label: "New Request" },
    { key: "update", label: "Update Request" },
    { key: "denied", label: "Denied Requests" },
  ]

  return (
    <div className="p-4 lg:p-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">Advertisement Requests</h1>
            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-slate-100 text-slate-700">
              {filteredRequests.length}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 mb-4">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-slate-900">Advertisement</h2>
            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-slate-100 text-slate-700">
              {filteredRequests.length}
            </span>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <div className="relative flex-1 sm:flex-initial min-w-[250px]">
              <input
                type="text"
                placeholder="Search by ads ID or restaur"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2.5 w-full text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>

            <button className="p-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 transition-all">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">SI</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">Ads ID</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">Ads Title</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">Restaurant Info</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">Ads Type</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-4 text-center text-[10px] font-bold text-slate-700 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center">
                    <p className="text-lg font-semibold text-slate-700 mb-1">No Data Found</p>
                    <p className="text-sm text-slate-500">No requests match your search</p>
                  </td>
                </tr>
              ) : (
                filteredRequests.map((request) => (
                  <tr
                    key={request.sl}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-slate-700">{request.sl}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-slate-900">{request.adsId}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-slate-900">{request.adsTitle}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                          <Building2 className="w-5 h-5 text-orange-600" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-slate-900">{request.restaurantName}</span>
                          <span className="text-xs text-slate-500">{request.restaurantEmail}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-slate-700">{request.adsType}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-slate-700">{request.duration}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button className="p-1.5 rounded text-slate-600 hover:bg-slate-100 transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
