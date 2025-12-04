import { useState, useMemo } from "react"
import { Search, Download, ChevronDown, Plus, MoreVertical, Building2, Settings } from "lucide-react"
import { adsListDummy } from "../../data/adsListDummy"

export default function AdsList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [adsType, setAdsType] = useState("all")
  const [ads, setAds] = useState(adsListDummy)

  const filteredAds = useMemo(() => {
    let result = [...ads]
    
    if (adsType !== "all") {
      result = result.filter(ad => ad.adsType === adsType)
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      result = result.filter(ad =>
        ad.adsId.toLowerCase().includes(query) ||
        ad.restaurantName.toLowerCase().includes(query) ||
        ad.adsTitle.toLowerCase().includes(query)
      )
    }

    return result
  }, [ads, searchQuery, adsType])

  const handlePriorityChange = (sl, newPriority) => {
    setAds(ads.map(ad =>
      ad.sl === sl ? { ...ad, priority: newPriority } : ad
    ))
  }

  return (
    <div className="p-4 lg:p-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900">Ads List</h1>
              <span className="px-3 py-1 rounded-full text-sm font-semibold bg-slate-100 text-slate-700">
                {filteredAds.length}
              </span>
            </div>
          </div>

          <button className="px-4 py-2.5 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2 transition-all shadow-md">
            <Plus className="w-4 h-4" />
            New Advertisement
          </button>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={adsType}
            onChange={(e) => setAdsType(e.target.value)}
            className="px-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
          >
            <option value="all">All Ads</option>
            <option value="Restaurant Promotion">Restaurant Promotion</option>
            <option value="Video promotion">Video promotion</option>
          </select>

          <div className="relative flex-1 sm:flex-initial min-w-[250px]">
            <input
              type="text"
              placeholder="Search by ads ID or restauı"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 w-full text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
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
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-4 text-center text-[10px] font-bold text-slate-700 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {filteredAds.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-20 text-center">
                    <p className="text-lg font-semibold text-slate-700 mb-1">No Data Found</p>
                    <p className="text-sm text-slate-500">No ads match your search</p>
                  </td>
                </tr>
              ) : (
                filteredAds.map((ad) => (
                  <tr
                    key={ad.sl}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-slate-700">{ad.sl}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                        {ad.adsId}
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-slate-900">{ad.adsTitle}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                          <Building2 className="w-5 h-5 text-orange-600" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-slate-900">{ad.restaurantName}</span>
                          <span className="text-xs text-slate-500">{ad.restaurantEmail}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-slate-700">{ad.adsType}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-slate-700">{ad.duration}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        {ad.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={ad.priority || ""}
                        onChange={(e) => handlePriorityChange(ad.sl, e.target.value)}
                        className="px-2 py-1 text-xs border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
                      >
                        <option value="">N/A</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                      </select>
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
