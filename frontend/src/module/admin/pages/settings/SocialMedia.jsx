import { useState } from "react"
import { Info, Pencil, Facebook, Twitter, Instagram, Linkedin, Share2 } from "lucide-react"

const socialMediaOptions = [
  "Facebook",
  "Twitter",
  "Instagram",
  "LinkedIn",
  "Pinterest"
]

const existingLinks = [
  { id: 1, name: "Pinterest", link: "https://www.pinterest.com/", status: true },
  { id: 2, name: "LinkedIn", link: "https://bd.linkedin.com/", status: true },
  { id: 3, name: "Twitter", link: "https://twitter.com/?lang=en", status: true },
  { id: 4, name: "Facebook", link: "https://www.facebook.com/", status: true },
  { id: 5, name: "Instagram", link: "https://www.instagram.com/?hl=en", status: true }
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

export default function SocialMedia() {
  const [selectedName, setSelectedName] = useState("")
  const [socialMediaLink, setSocialMediaLink] = useState("")
  const [links, setLinks] = useState(existingLinks)

  const handleStatusToggle = (id) => {
    setLinks(prev => prev.map(link => 
      link.id === id ? { ...link, status: !link.status } : link
    ))
  }

  const handleReset = () => {
    setSelectedName("")
    setSocialMediaLink("")
  }

  const handleSave = () => {
    if (selectedName && socialMediaLink) {
      // Add new link logic here
      console.log("Saving:", { selectedName, socialMediaLink })
      handleReset()
    }
  }

  const getSocialIcon = (name) => {
    switch(name.toLowerCase()) {
      case "facebook": return <Facebook className="w-4 h-4" />
      case "twitter": return <Twitter className="w-4 h-4" />
      case "instagram": return <Instagram className="w-4 h-4" />
      case "linkedin": return <Linkedin className="w-4 h-4" />
      case "pinterest": return <Share2 className="w-4 h-4" />
      default: return <Share2 className="w-4 h-4" />
    }
  }

  return (
    <div className="p-2 lg:p-3 bg-slate-50 min-h-screen">
      <div className="w-full mx-auto max-w-6xl">
        {/* Add Social Media Link Section */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-3">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1">
              <Facebook className="w-4 h-4 text-blue-600" />
              <Twitter className="w-4 h-4 text-sky-400" />
              <Instagram className="w-4 h-4 text-pink-600" />
              <Share2 className="w-4 h-4 text-red-600" />
              <Linkedin className="w-4 h-4 text-blue-700" />
            </div>
            <h1 className="text-base font-bold text-slate-900">Social Media</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Name
              </label>
              <div className="relative">
                <select
                  value={selectedName}
                  onChange={(e) => setSelectedName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer"
                >
                  <option value="">---Select Social Media---</option>
                  {socialMediaOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 pointer-events-none">
                  ▾
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                Social media link
                <Info className="w-3.5 h-3.5 text-slate-400" />
              </label>
              <input
                type="text"
                value={socialMediaLink}
                onChange={(e) => setSocialMediaLink(e.target.value)}
                placeholder="Ex :facebook.com/your-page-name"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 text-xs font-medium bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 text-xs font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save
            </button>
          </div>
        </div>

        {/* Existing Social Media Links Table */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-3 py-2 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                    SI
                  </th>
                  <th className="px-3 py-2 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-3 py-2 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                    Social Media Link
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
                {links.map((link, index) => (
                  <tr key={link.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-3 py-2.5">
                      <span className="text-xs text-slate-700">{index + 1}</span>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="text-slate-600">
                          {getSocialIcon(link.name)}
                        </div>
                        <span className="text-xs text-slate-700">{link.name}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="text-xs text-slate-700">{link.link}</span>
                    </td>
                    <td className="px-3 py-2.5">
                      <ToggleSwitch
                        enabled={link.status}
                        onToggle={() => handleStatusToggle(link.id)}
                      />
                    </td>
                    <td className="px-3 py-2.5">
                      <button
                        type="button"
                        className="p-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
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
