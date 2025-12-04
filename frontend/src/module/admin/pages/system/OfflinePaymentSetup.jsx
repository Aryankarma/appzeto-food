import { useState } from "react"
import { Briefcase, Search, Plus, Pencil, Trash2, Settings } from "lucide-react"

const paymentMethods = [
  {
    id: 1,
    name: "bkash",
    paymentInfo: "Account Number : 017**********",
    requiredInfo: "Name | Transaction Number",
    status: true
  }
]

function ToggleSwitch({ enabled, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`inline-flex items-center w-11 h-6 rounded-full border transition-all ${
        enabled
          ? "bg-blue-600 border-blue-600 justify-end"
          : "bg-slate-200 border-slate-300 justify-start"
      }`}
    >
      <span className="h-5 w-5 rounded-full bg-white shadow-sm" />
    </button>
  )
}

export default function OfflinePaymentSetup() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [methods, setMethods] = useState(paymentMethods)

  const handleStatusToggle = (id) => {
    setMethods(prev => prev.map(method => 
      method.id === id ? { ...method, status: !method.status } : method
    ))
  }

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this payment method?")) {
      setMethods(prev => prev.filter(method => method.id !== id))
    }
  }

  const filteredMethods = methods.filter(method => {
    if (activeTab === "active") return method.status
    if (activeTab === "inactive") return !method.status
    return true
  }).filter(method =>
    method.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="p-2 lg:p-3 bg-slate-50 min-h-screen">
      <div className="w-full mx-auto max-w-7xl">
        {/* Page Title */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center">
              <Briefcase className="w-3.5 h-3.5 text-white" />
            </div>
            <h1 className="text-lg font-bold text-slate-900">Offline Payment Method Setup</h1>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-2 mb-3">
          <div className="flex gap-2">
            {["All", "Active", "Inactive"].map((tab) => (
              <button
                key={tab.toLowerCase()}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
                  activeTab === tab.toLowerCase()
                    ? "bg-blue-600 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Search and Add Section */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-3 mb-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-7 pr-2 py-1.5 w-full text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            </div>
            <button className="px-4 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Search
            </button>
            <div className="relative">
              <button className="px-4 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" />
                <span>Add New Method</span>
              </button>
              <Settings className="absolute -top-6 right-0 w-4 h-4 text-slate-400" />
            </div>
          </div>
        </div>

        {/* Payment Methods Table */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-3 py-2 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                    SL
                  </th>
                  <th className="px-3 py-2 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                    Payment Method Name
                  </th>
                  <th className="px-3 py-2 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                    Payment Info
                  </th>
                  <th className="px-3 py-2 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                    Required Info From Customer
                  </th>
                  <th className="px-3 py-2 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-3 py-2 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {filteredMethods.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center">
                      <p className="text-sm text-slate-500">No payment methods found</p>
                    </td>
                  </tr>
                ) : (
                  filteredMethods.map((method, index) => (
                    <tr key={method.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-3 py-2.5">
                        <span className="text-xs text-slate-700">{index + 1}</span>
                      </td>
                      <td className="px-3 py-2.5">
                        <span className="text-xs text-slate-700">{method.name}</span>
                      </td>
                      <td className="px-3 py-2.5">
                        <span className="text-xs text-slate-700">{method.paymentInfo}</span>
                      </td>
                      <td className="px-3 py-2.5">
                        <span className="text-xs text-slate-700">{method.requiredInfo}</span>
                      </td>
                      <td className="px-3 py-2.5">
                        <ToggleSwitch
                          enabled={method.status}
                          onToggle={() => handleStatusToggle(method.id)}
                        />
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(method.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
