import { useState, useMemo } from "react"
import { Search, Plus, Edit, Trash2, Calendar, Settings } from "lucide-react"
import { shiftsDummy } from "../data/shiftsDummy"

export default function ShiftSetup() {
  const [searchQuery, setSearchQuery] = useState("")
  const [shifts, setShifts] = useState(shiftsDummy)

  const filteredShifts = useMemo(() => {
    if (!searchQuery.trim()) {
      return shifts
    }
    
    const query = searchQuery.toLowerCase().trim()
    return shifts.filter(shift =>
      shift.name.toLowerCase().includes(query)
    )
  }, [shifts, searchQuery])

  const handleToggleStatus = (sl) => {
    setShifts(shifts.map(shift =>
      shift.sl === sl ? { ...shift, status: !shift.status } : shift
    ))
  }

  const handleDelete = (sl) => {
    if (window.confirm("Are you sure you want to delete this shift?")) {
      setShifts(shifts.filter(shift => shift.sl !== sl))
    }
  }

  return (
    <div className="p-4 lg:p-6 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-slate-600" />
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900">Shift Setup</h1>
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-slate-100 text-slate-700">
                  {filteredShifts.length}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="px-4 py-2.5 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2 transition-all shadow-md">
                <Plus className="w-4 h-4" />
                Add Shift
              </button>
              <button className="p-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 transition-all">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="mb-4 flex justify-end">
            <div className="relative flex-1 sm:flex-initial min-w-[250px]">
              <input
                type="text"
                placeholder="Ex: Search by name."
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
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">SI</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">Start Time</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">End Time</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-center text-[10px] font-bold text-slate-700 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {filteredShifts.map((shift) => (
                  <tr key={shift.sl} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-slate-700">{shift.sl}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-slate-900">{shift.name}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-slate-700">{shift.startTime}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-slate-700">{shift.endTime}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(shift.sl)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                          shift.status ? "bg-blue-600" : "bg-slate-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            shift.status ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          className="p-1.5 rounded text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(shift.sl)}
                          className="p-1.5 rounded text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete"
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
