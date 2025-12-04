import { useState, useMemo } from "react"
import { Search, Plus, Eye, Edit, Settings } from "lucide-react"
import { withdrawMethodsDummy } from "../../data/withdrawMethodsDummy"

export default function WithdrawMethod() {
  const [searchQuery, setSearchQuery] = useState("")
  const [methods, setMethods] = useState(withdrawMethodsDummy)

  const filteredMethods = useMemo(() => {
    if (!searchQuery.trim()) {
      return methods
    }
    
    const query = searchQuery.toLowerCase().trim()
    return methods.filter(method =>
      method.paymentMethodName?.toLowerCase().includes(query)
    )
  }, [methods, searchQuery])

  const handleToggleActive = (index) => {
    const updated = [...methods]
    updated[index].activeStatus = !updated[index].activeStatus
    setMethods(updated)
  }

  const handleToggleDefault = (index) => {
    const updated = [...methods]
    // Only one can be default, so set all to false first
    updated.forEach(m => m.defaultMethod = false)
    updated[index].defaultMethod = !updated[index].defaultMethod
    setMethods(updated)
  }

  return (
    <div className="p-4 lg:p-6 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6 relative">
          <button className="absolute top-6 right-6 p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors">
            <Settings className="w-5 h-5 text-slate-600" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900">Withdraw Method List</h1>
              <span className="px-3 py-1 rounded-full text-sm font-semibold bg-slate-100 text-slate-700">
                {filteredMethods.length}
              </span>
            </div>
            <button className="px-4 py-2.5 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all flex items-center gap-2 shadow-md">
              <Plus className="w-4 h-4" />
              Add Method
            </button>
          </div>

          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search Method Name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 w-full text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </div>

        {/* Methods Table */}
        <div className="space-y-4">
          {filteredMethods.map((method, index) => (
            <div
              key={method.sl}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">SI</th>
                      <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">Payment Method Name</th>
                      <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">Method Fields</th>
                      <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">Active Status</th>
                      <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">Default Method</th>
                      <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-slate-700">{method.sl}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-slate-700">{method.paymentMethodName}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          {method.methodFields.map((field, fieldIndex) => (
                            <div key={fieldIndex} className="flex items-start gap-2">
                              <span className="text-sm text-slate-700">
                                Name: <span className="font-medium">{field.name}</span> Type: <span className="font-medium">{field.type}</span> Placeholder: <span className="font-medium">{field.placeholder}</span>
                              </span>
                              <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                                field.required
                                  ? "bg-red-100 text-red-700"
                                  : "bg-blue-100 text-blue-700"
                              }`}>
                                {field.required ? "Required" : "Optional"}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleActive(index)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            method.activeStatus ? "bg-blue-600" : "bg-slate-300"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              method.activeStatus ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleDefault(index)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            method.defaultMethod ? "bg-blue-600" : "bg-slate-300"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              method.defaultMethod ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button className="p-2 rounded-lg bg-orange-50 hover:bg-orange-100 transition-colors">
                            <Eye className="w-4 h-4 text-orange-600" />
                          </button>
                          <button className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
                            <Edit className="w-4 h-4 text-blue-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

