import { useState } from "react"
import { MapPin, Hand, Shapes, Search, Download, ChevronDown, Pencil, Settings } from "lucide-react"

const languageTabs = [
  { key: "default", label: "Default" },
  { key: "en", label: "English(EN)" },
  { key: "bn", label: "Bengali - বাংলা(BN)" },
  { key: "ar", label: "Arabic - العربية (AR)" },
  { key: "es", label: "Spanish - español(ES)" }
]

const zonesData = [
  {
    id: 1,
    zoneId: 1,
    name: "All over the World",
    displayName: "All over the World",
    restaurants: 16,
    deliverymen: 8,
    isDefault: false,
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

export default function ZoneSetup() {
  const [activeLanguage, setActiveLanguage] = useState("default")
  const [zoneName, setZoneName] = useState("")
  const [zoneDisplayName, setZoneDisplayName] = useState("")
  const [zones, setZones] = useState(zonesData)
  const [searchQuery, setSearchQuery] = useState("")

  const handleStatusToggle = (id) => {
    setZones(prev => prev.map(zone => 
      zone.id === id ? { ...zone, status: !zone.status } : zone
    ))
  }

  const handleMakeDefault = (id) => {
    setZones(prev => prev.map(zone => ({
      ...zone,
      isDefault: zone.id === id
    })))
  }

  const handleReset = () => {
    setZoneName("")
    setZoneDisplayName("")
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Zone submitted:", { zoneName, zoneDisplayName, activeLanguage })
    handleReset()
  }

  const filteredZones = zones.filter(zone =>
    zone.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    zone.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="p-2 lg:p-3 bg-slate-50 min-h-screen">
      <div className="w-full mx-auto max-w-7xl">
        {/* Add New Business Zone Section */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-3">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-red-500 flex items-center justify-center">
              <MapPin className="w-3.5 h-3.5 text-white" />
            </div>
            <h1 className="text-lg font-bold text-slate-900">Add New Business Zone</h1>
          </div>

          {/* Instructions */}
          <div className="bg-slate-50 rounded-lg p-3 mb-4 border border-slate-200">
            <h2 className="text-xs font-semibold text-slate-900 mb-2">Instructions</h2>
            <p className="text-xs text-slate-600 mb-3">
              Create & connect dots in a specific area on the map to add a new business zone.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-blue-100 flex items-center justify-center">
                  <Hand className="w-3 h-3 text-blue-600" />
                </div>
                <span className="text-xs text-slate-700">
                  Use this 'Hand Tool' to find your target zone.
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-blue-100 flex items-center justify-center">
                  <Shapes className="w-3 h-3 text-blue-600" />
                </div>
                <span className="text-xs text-slate-700">
                  Use this 'Shape Tool' to point out the areas and connect the dots. A minimum of 3 points/dots is required.
                </span>
              </div>
            </div>
          </div>

          {/* Language Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 mb-4 overflow-x-auto">
            {languageTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveLanguage(tab.key)}
                className={`px-3 py-1.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeLanguage === tab.key
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Business Zone Name ({activeLanguage === "default" ? "Default" : languageTabs.find(t => t.key === activeLanguage)?.label})
                </label>
                <input
                  type="text"
                  value={zoneName}
                  onChange={(e) => setZoneName(e.target.value)}
                  placeholder="Type new zone name here"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Zone Display Name ({activeLanguage === "default" ? "Default" : languageTabs.find(t => t.key === activeLanguage)?.label})
                </label>
                <input
                  type="text"
                  value={zoneDisplayName}
                  onChange={(e) => setZoneDisplayName(e.target.value)}
                  placeholder="Write a New Display Zone Name"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="mb-4">
              <div className="w-full h-96 bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-500">Map will be integrated here</p>
                  <p className="text-xs text-slate-400 mt-1">Interactive map with zone drawing tools</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 text-xs font-medium bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Reset
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Submit
              </button>
            </div>
          </form>
        </div>

        {/* Zone List Section */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
            <h2 className="text-base font-bold text-slate-900">Zone List {filteredZones.length}</h2>

            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:flex-initial min-w-[180px]">
                <input
                  type="text"
                  placeholder="Search by name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-7 pr-2 py-1.5 w-full text-[11px] rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
              </div>

              <button className="px-2.5 py-1.5 text-[11px] font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-1 transition-all">
                <Download className="w-3 h-3" />
                <span>Export</span>
                <ChevronDown className="w-2.5 h-2.5" />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-3 py-2 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                    SI
                  </th>
                  <th className="px-3 py-2 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                    Zone Id
                  </th>
                  <th className="px-3 py-2 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-3 py-2 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                    Zone Display Name
                  </th>
                  <th className="px-3 py-2 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                    Restaurants
                  </th>
                  <th className="px-3 py-2 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                    Deliverymen
                  </th>
                  <th className="px-3 py-2 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                    Default Status
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
                {filteredZones.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-8 text-center">
                      <p className="text-sm text-slate-500">No zones found</p>
                    </td>
                  </tr>
                ) : (
                  filteredZones.map((zone, index) => (
                    <tr key={zone.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-3 py-2.5">
                        <span className="text-xs text-slate-700">{index + 1}</span>
                      </td>
                      <td className="px-3 py-2.5">
                        <span className="text-xs text-slate-700">{zone.zoneId}</span>
                      </td>
                      <td className="px-3 py-2.5">
                        <span className="text-xs text-slate-700">{zone.name}</span>
                      </td>
                      <td className="px-3 py-2.5">
                        <span className="text-xs text-slate-700">{zone.displayName}</span>
                      </td>
                      <td className="px-3 py-2.5">
                        <span className="text-xs text-slate-700">{zone.restaurants}</span>
                      </td>
                      <td className="px-3 py-2.5">
                        <span className="text-xs text-slate-700">{zone.deliverymen}</span>
                      </td>
                      <td className="px-3 py-2.5">
                        {zone.isDefault ? (
                          <span className="text-xs text-green-600 font-medium">Default</span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleMakeDefault(zone.id)}
                            className="px-2 py-1 text-[10px] font-medium bg-slate-200 text-slate-700 rounded hover:bg-slate-300 transition-colors"
                          >
                            Make default
                          </button>
                        )}
                      </td>
                      <td className="px-3 py-2.5">
                        <ToggleSwitch
                          enabled={zone.status}
                          onToggle={() => handleStatusToggle(zone.id)}
                        />
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            className="p-1.5 text-slate-600 hover:bg-slate-50 rounded transition-colors"
                          >
                            <Settings className="w-3.5 h-3.5" />
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
