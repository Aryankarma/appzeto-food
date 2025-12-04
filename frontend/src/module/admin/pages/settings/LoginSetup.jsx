import { useState } from "react"
import { Monitor, Info, Check, Copy, Edit, ExternalLink } from "lucide-react"

const panelLoginUrls = [
  {
    id: 1,
    panelName: "Admin Panel",
    loginUrl: "https://admin.stackfood.com/login",
    status: "active"
  },
  {
    id: 2,
    panelName: "Restaurant Panel",
    loginUrl: "https://restaurant.stackfood.com/login",
    status: "active"
  },
  {
    id: 3,
    panelName: "Deliveryman Panel",
    loginUrl: "https://delivery.stackfood.com/login",
    status: "active"
  },
  {
    id: 4,
    panelName: "Customer Panel",
    loginUrl: "https://app.stackfood.com/login",
    status: "active"
  }
]

export default function LoginSetup() {
  const [activeTab, setActiveTab] = useState("customer-login")
  const [loginOptions, setLoginOptions] = useState({
    manualLogin: true,
    otpLogin: true,
    socialMediaLogin: true
  })
  const [socialMedia, setSocialMedia] = useState({
    google: true,
    facebook: false,
    apple: false
  })
  const [verification, setVerification] = useState({
    emailVerification: true,
    phoneVerification: true
  })
  const [panelUrls, setPanelUrls] = useState(panelLoginUrls)
  const [editingId, setEditingId] = useState(null)
  const [editUrl, setEditUrl] = useState("")

  const handleLoginOptionChange = (option) => {
    setLoginOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }))
  }

  const handleSocialMediaChange = (platform) => {
    setSocialMedia(prev => ({
      ...prev,
      [platform]: !prev[platform]
    }))
  }

  const handleVerificationChange = (type) => {
    setVerification(prev => ({
      ...prev,
      [type]: !prev[type]
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (activeTab === "customer-login") {
      console.log("Form submitted:", { loginOptions, socialMedia, verification })
    } else {
      console.log("Panel URLs submitted:", panelUrls)
    }
    alert("Settings saved successfully!")
  }

  const handleReset = () => {
    if (activeTab === "customer-login") {
      setLoginOptions({
        manualLogin: true,
        otpLogin: true,
        socialMediaLogin: true
      })
      setSocialMedia({
        google: true,
        facebook: false,
        apple: false
      })
      setVerification({
        emailVerification: true,
        phoneVerification: true
      })
    } else {
      setPanelUrls(panelLoginUrls)
      setEditingId(null)
      setEditUrl("")
    }
  }

  const handleCopyUrl = (url) => {
    navigator.clipboard.writeText(url)
    alert("URL copied to clipboard!")
  }

  const handleEditUrl = (id, currentUrl) => {
    setEditingId(id)
    setEditUrl(currentUrl)
  }

  const handleSaveUrl = (id) => {
    setPanelUrls(prev => prev.map(panel => 
      panel.id === id ? { ...panel, loginUrl: editUrl } : panel
    ))
    setEditingId(null)
    setEditUrl("")
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditUrl("")
  }

  return (
    <div className="p-4 lg:p-6 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <Monitor className="w-6 h-6 text-slate-600" />
            <h1 className="text-2xl font-bold text-slate-900">Login Setup</h1>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-2 mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("customer-login")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "customer-login"
                  ? "bg-blue-600 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Customer Login
            </button>
            <button
              onClick={() => setActiveTab("panel-login")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "panel-login"
                  ? "bg-blue-600 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Panel login page Url
            </button>
          </div>
        </div>

        {/* Customer Login Content */}
        {activeTab === "customer-login" && (
          <div className="space-y-6">
            {/* Setup Login Option */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <p className="text-sm text-slate-600 mb-4">
                The option you select customer will have the to option to login
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { key: "manualLogin", label: "Manual Login", icon: "👤" },
                  { key: "otpLogin", label: "OTP Login", icon: "📱" },
                  { key: "socialMediaLogin", label: "Social Media Login", icon: "🌐" }
                ].map((option) => (
                  <div
                    key={option.key}
                    onClick={() => handleLoginOptionChange(option.key)}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      loginOptions[option.key]
                        ? "border-blue-600 bg-blue-50"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{option.icon}</span>
                        <span className="text-sm font-semibold text-slate-700">{option.label}</span>
                      </div>
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={loginOptions[option.key]}
                          onChange={() => handleLoginOptionChange(option.key)}
                          className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
                        />
                        <Info className="absolute -right-6 top-0 w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Media Login Setup */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <p className="text-sm text-slate-600 mb-4">
                <a href="#" className="text-blue-600 hover:underline">
                  Connect 3rd party login system from here
                </a>
              </p>
              
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Choose social media</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { key: "google", label: "Google", icon: "🔵", color: "blue" },
                    { key: "facebook", label: "Facebook", icon: "🔵", color: "blue" },
                    { key: "apple", label: "Apple", icon: "⚫", color: "black" }
                  ].map((platform) => (
                    <div
                      key={platform.key}
                      onClick={() => handleSocialMediaChange(platform.key)}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        socialMedia[platform.key]
                          ? "border-blue-600 bg-blue-50"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{platform.icon}</span>
                          <span className="text-sm font-semibold text-slate-700">{platform.label}</span>
                        </div>
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={socialMedia[platform.key]}
                            onChange={() => handleSocialMediaChange(platform.key)}
                            className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
                          />
                          <Info className="absolute -right-6 top-0 w-4 h-4 text-slate-400" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Verification */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <p className="text-sm text-slate-600 mb-4">
                The option you select from below will need to verify by customer from customer app/website.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: "emailVerification", label: "Email Verification", icon: "📧" },
                  { key: "phoneVerification", label: "Phone Number Verification", icon: "📱" }
                ].map((verify) => (
                  <div
                    key={verify.key}
                    onClick={() => handleVerificationChange(verify.key)}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      verification[verify.key]
                        ? "border-blue-600 bg-blue-50"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{verify.icon}</span>
                        <span className="text-sm font-semibold text-slate-700">{verify.label}</span>
                      </div>
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={verification[verify.key]}
                          onChange={() => handleVerificationChange(verify.key)}
                          className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
                        />
                        <Info className="absolute -right-6 top-0 w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Panel Login Content */}
        {activeTab === "panel-login" && (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <div className="mb-4">
              <p className="text-sm text-slate-600 mb-4">
                Manage login page URLs for different panels. You can edit and copy the URLs as needed.
              </p>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      SI
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Panel Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Login Page URL
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                  {panelUrls.map((panel, index) => (
                    <tr key={panel.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <span className="text-xs text-slate-700">{index + 1}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-medium text-slate-900">{panel.panelName}</span>
                      </td>
                      <td className="px-4 py-3">
                        {editingId === panel.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={editUrl}
                              onChange={(e) => setEditUrl(e.target.value)}
                              className="flex-1 px-2 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Enter login URL"
                            />
                            <button
                              onClick={() => handleSaveUrl(panel.id)}
                              className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                            >
                              Save
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="px-2 py-1 text-xs bg-slate-200 text-slate-700 rounded hover:bg-slate-300 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-600 break-all">{panel.loginUrl}</span>
                            <a
                              href={panel.loginUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-700"
                              title="Open in new tab"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 text-[10px] font-medium bg-green-100 text-green-700 rounded">
                          {panel.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {editingId !== panel.id && (
                            <>
                              <button
                                onClick={() => handleEditUrl(panel.id, panel.loginUrl)}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                title="Edit URL"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleCopyUrl(panel.loginUrl)}
                                className="p-1.5 text-slate-600 hover:bg-slate-100 rounded transition-colors"
                                title="Copy URL"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={handleReset}
            className="px-6 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  )
}
