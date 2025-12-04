import { useState, useMemo } from "react"
import { Search, Download, ChevronDown, Edit, Trash2, User, Star, ArrowUpDown } from "lucide-react"
import { deliverymanListDummy } from "../../data/deliverymanListDummy"

export default function DeliverymanList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [deliverymen, setDeliverymen] = useState(deliverymanListDummy)

  const filteredDeliverymen = useMemo(() => {
    if (!searchQuery.trim()) {
      return deliverymen
    }
    
    const query = searchQuery.toLowerCase().trim()
    return deliverymen.filter(dm =>
      dm.name.toLowerCase().includes(query)
    )
  }, [deliverymen, searchQuery])

  const handleDelete = (sl) => {
    if (window.confirm("Are you sure you want to delete this deliveryman?")) {
      setDeliverymen(deliverymen.filter(dm => dm.sl !== sl))
    }
  }

  return (
    <div className="p-4 lg:p-6 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-slate-600" />
              <h1 className="text-2xl font-bold text-slate-900">Deliveryman List</h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative flex-1 sm:flex-initial min-w-[250px]">
                <input
                  type="text"
                  placeholder="Search by name or restaur..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2.5 w-full text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>

              <button className="px-4 py-2.5 text-sm font-medium rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 flex items-center gap-2 transition-all">
                <Download className="w-4 h-4" />
                <span>Export</span>
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-700">Deliveryman</span>
              <span className="px-3 py-1 rounded-full text-sm font-semibold bg-slate-100 text-slate-700">
                {filteredDeliverymen.length}
              </span>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <span>SI</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400 cursor-pointer hover:text-slate-600" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <span>Name</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400 cursor-pointer hover:text-slate-600" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <span>Contact</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400 cursor-pointer hover:text-slate-600" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <span>Zone</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400 cursor-pointer hover:text-slate-600" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <span>Total Orders</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400 cursor-pointer hover:text-slate-600" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <span>Availability Status</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400 cursor-pointer hover:text-slate-600" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center text-[10px] font-bold text-slate-700 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {filteredDeliverymen.map((dm) => (
                  <tr key={dm.sl} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-slate-700">{dm.sl}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm">👤</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-slate-900">{dm.name}</span>
                          {dm.rating > 0 && (
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs text-slate-600">{dm.rating}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-slate-700">{dm.phone}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-slate-700">{dm.zone}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-slate-700">{dm.totalOrders}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-xs text-slate-600">Currenty Assigned Orders: {dm.assignedOrders}</span>
                        <span className="text-xs">
                          Active Status: <span className="text-blue-600 underline">{dm.status}</span>
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-1.5 rounded text-blue-600 hover:bg-blue-50 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(dm.sl)}
                          className="p-1.5 rounded text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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
