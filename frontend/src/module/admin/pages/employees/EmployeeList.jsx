import { useState, useMemo } from "react"
import { Users, ChevronDown, Search, Settings, Edit, Trash2 } from "lucide-react"

// Import icons from Dashboard-icons
import searchIcon from "../../assets/Dashboard-icons/image8.png"
import exportIcon from "../../assets/Dashboard-icons/image9.png"
import settingsIcon from "../../assets/Dashboard-icons/image10.png"
import editIcon from "../../assets/Dashboard-icons/image11.png"

const employeesDummy = [
  {
    id: 1,
    name: "Jhon",
    phone: "+81234567890",
    email: "jhon@gmail.com",
    createdAt: "07 Feb, 2023",
  },
  {
    id: 2,
    name: "Monali Khan",
    phone: "+81234567891",
    email: "test@gmail.com",
    createdAt: "22 Aug, 2021",
  },
]

export default function EmployeeList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [employees, setEmployees] = useState(employeesDummy)

  const filteredEmployees = useMemo(() => {
    if (!searchQuery.trim()) return employees
    const query = searchQuery.toLowerCase().trim()
    return employees.filter(employee =>
      employee.name.toLowerCase().includes(query) ||
      employee.email.toLowerCase().includes(query)
    )
  }, [employees, searchQuery])

  const maskPhone = (phone) => {
    if (!phone) return ""
    if (phone.length > 2) {
      return phone.slice(0, 2) + "*".repeat(phone.length - 2)
    }
    return phone
  }

  const maskEmail = (email) => {
    if (!email) return ""
    const [localPart, domain] = email.split("@")
    if (localPart.length > 1) {
      const masked = localPart[0] + "*".repeat(localPart.length - 1)
      return `${masked}@${domain}`
    }
    return email
  }

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      setEmployees(employees.filter(employee => employee.id !== id))
    }
  }

  return (
    <div className="p-4 lg:p-6 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Employee List</h1>
          </div>
        </div>

        {/* Employee List Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="text-xl font-bold text-slate-900">Employee List</h2>

            <div className="flex items-center gap-3">
              <div className="relative flex-1 sm:flex-initial min-w-[250px]">
                <input
                  type="text"
                  placeholder="Search by name or email"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2.5 w-full text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <img src={searchIcon} alt="Search" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
              </div>

              <button className="px-4 py-2.5 text-sm font-medium rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 flex items-center gap-2 transition-all">
                <img src={exportIcon} alt="Export" className="w-4 h-4" />
                <span>Export</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              <button className="p-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 transition-all">
                <img src={settingsIcon} alt="Settings" className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                    SI
                  </th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                    Employee Name
                  </th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-4 text-center text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <p className="text-lg font-semibold text-slate-700 mb-1">No Data Found</p>
                        <p className="text-sm text-slate-500">No employees match your search</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((employee, index) => (
                    <tr
                      key={employee.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-slate-700">{index + 1}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-slate-900">{employee.name}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-slate-700">{maskPhone(employee.phone)}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-slate-700">{maskEmail(employee.email)}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-slate-700">{employee.createdAt}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                            title="Edit"
                          >
                            <img src={editIcon} alt="Edit" className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(employee.id)}
                            className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
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
