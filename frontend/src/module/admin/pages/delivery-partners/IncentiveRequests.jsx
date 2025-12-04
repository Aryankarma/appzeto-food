import { useState, useMemo } from "react"
import { Search, CheckCircle, X, ArrowUpDown } from "lucide-react"
import { incentiveRequestsDummy } from "../../data/incentiveRequestsDummy"

export default function IncentiveRequests() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedItems, setSelectedItems] = useState([])
  const [requests, setRequests] = useState(incentiveRequestsDummy)

  const filteredRequests = useMemo(() => {
    if (!searchQuery.trim()) {
      return requests
    }
    
    const query = searchQuery.toLowerCase().trim()
    return requests.filter(request =>
      request.deliveryman.toLowerCase().includes(query)
    )
  }, [requests, searchQuery])

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(filteredRequests.map(r => r.sl))
    } else {
      setSelectedItems([])
    }
  }

  const handleSelectItem = (sl) => {
    if (selectedItems.includes(sl)) {
      setSelectedItems(selectedItems.filter(id => id !== sl))
    } else {
      setSelectedItems([...selectedItems, sl])
    }
  }

  const handleApprove = () => {
    if (selectedItems.length === 0) {
      alert("Please select at least one request to approve")
      return
    }
    if (window.confirm(`Are you sure you want to approve ${selectedItems.length} request(s)?`)) {
      setRequests(requests.filter(r => !selectedItems.includes(r.sl)))
      setSelectedItems([])
      alert("Requests approved successfully!")
    }
  }

  const handleDeny = (sl) => {
    if (window.confirm("Are you sure you want to deny this request?")) {
      setRequests(requests.filter(r => r.sl !== sl))
    }
  }

  return (
    <div className="p-4 lg:p-6 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900">Delivery Man Incentives</h1>
              <span className="px-3 py-1 rounded-full text-sm font-semibold bg-slate-100 text-slate-700">
                {filteredRequests.length}
              </span>
            </div>

            <div className="relative flex-1 sm:flex-initial min-w-[250px]">
              <input
                type="text"
                placeholder="Ex: search delivery man da"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2.5 w-full text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === filteredRequests.length && filteredRequests.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <span>SI</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400 cursor-pointer hover:text-slate-600" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <span>DeliveryMan</span>
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
                      <span>Total Earning</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400 cursor-pointer hover:text-slate-600" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <span>Incentive</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400 cursor-pointer hover:text-slate-600" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <span>Date</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400 cursor-pointer hover:text-slate-600" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <span>Status</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400 cursor-pointer hover:text-slate-600" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center text-[10px] font-bold text-slate-700 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {filteredRequests.map((request) => (
                  <tr key={request.sl} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(request.sl)}
                        onChange={() => handleSelectItem(request.sl)}
                        className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-slate-700">{request.sl}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                        {request.deliveryman}
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-slate-700">{request.zone}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-slate-900">$ {request.totalEarning.toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-slate-900">$ {request.incentive.toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-slate-700">{request.date}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => handleDeny(request.sl)}
                        className="p-1.5 rounded text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selectedItems.length > 0 && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleApprove}
                className="px-6 py-2.5 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-md"
              >
                Approve
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
