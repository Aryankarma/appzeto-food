import { useState, useMemo } from "react"
import { Settings, Building, ShoppingBag } from "lucide-react"

export default function DisbursementPage({ 
  title, 
  icon: Icon, 
  tabs, 
  disbursements, 
  count 
}) {
  const [activeTab, setActiveTab] = useState("all")

  const filteredDisbursements = useMemo(() => {
    if (activeTab === "all") {
      return disbursements
    }
    return disbursements.filter(disbursement => 
      disbursement.status.toLowerCase() === activeTab.toLowerCase()
    )
  }, [disbursements, activeTab])

  const getStatusColor = (status) => {
    const statusLower = status.toLowerCase()
    if (statusLower === "pending") {
      return "bg-blue-100 text-blue-700"
    }
    if (statusLower === "processing") {
      return "bg-yellow-100 text-yellow-700"
    }
    if (statusLower === "completed") {
      return "bg-green-100 text-green-700"
    }
    if (statusLower === "partially completed") {
      return "bg-orange-100 text-orange-700"
    }
    if (statusLower === "canceled") {
      return "bg-red-100 text-red-700"
    }
    return "bg-slate-100 text-slate-700"
  }

  return (
    <div className="p-4 lg:p-6 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6 relative">
          <button className="absolute top-6 right-6 p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors">
            <Settings className="w-5 h-5 text-slate-600" />
          </button>

          <div className="flex items-center gap-3 mb-4">
            {Icon && <Icon className="w-5 h-5 text-blue-600" />}
            <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-slate-100 text-slate-700">
              {count || filteredDisbursements.length}
            </span>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 border-b border-slate-200">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                  activeTab === tab.toLowerCase()
                    ? "text-blue-600"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab}
                {activeTab === tab.toLowerCase() && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Disbursement Cards */}
        <div className="space-y-4">
          {filteredDisbursements.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
              <p className="text-slate-500">No disbursements found</p>
            </div>
          ) : (
            filteredDisbursements.map((disbursement) => (
              <div
                key={disbursement.id}
                className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Left Side */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-slate-900">
                        Disbursement # {disbursement.id}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          disbursement.status
                        )}`}
                      >
                        {disbursement.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500">
                      Created at {disbursement.createdAt}
                    </p>
                  </div>

                  {/* Right Side */}
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-slate-500 mb-1">Total amount</p>
                      <p className="text-lg font-bold text-slate-900">
                        $ {disbursement.totalAmount.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                    <button className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}


