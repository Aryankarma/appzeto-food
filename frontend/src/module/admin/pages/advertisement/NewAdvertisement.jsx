import { useState } from "react"
import { Upload, Heart, Star, Calendar } from "lucide-react"
import profilePlaceholder from "@/assets/download.jpg"
import coverPlaceholder from "@/assets/download (1).jpg"

export default function NewAdvertisement() {
  const [activeLanguage, setActiveLanguage] = useState("default")
  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    restaurant: "",
    priority: "Priority",
    advertisementType: "Restaurant Promotion",
    validity: "",
    showReview: true,
    showRatings: true,
  })

  const languageTabs = [
    { key: "default", label: "Default" },
    { key: "en", label: "English(EN)" },
    { key: "bn", label: "Bengali - বাংলা(BN)" },
    { key: "ar", label: "Arabic - العربية (AR)" },
    { key: "es", label: "Spanish - español(ES)" },
  ]

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    alert("Advertisement created successfully!")
  }

  const handleReset = () => {
    setFormData({
      title: "",
      shortDescription: "",
      restaurant: "",
      priority: "Priority",
      advertisementType: "Restaurant Promotion",
      validity: "",
      showReview: true,
      showRatings: true,
    })
  }

  return (
    <div className="p-4 lg:p-6 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h1 className="text-2xl font-bold text-slate-900 mb-6">Create Advertisement</h1>

              {/* Language Tabs */}
              <div className="flex items-center gap-2 border-b border-slate-200 mb-6">
                {languageTabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveLanguage(tab.key)}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
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
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Advertisement Title ({activeLanguage === "default" ? "Default" : languageTabs.find(t => t.key === activeLanguage)?.label}) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      placeholder="Exclusive Offer"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Short Description ({activeLanguage === "default" ? "Default" : languageTabs.find(t => t.key === activeLanguage)?.label})
                    </label>
                    <input
                      type="text"
                      value={formData.shortDescription}
                      onChange={(e) => handleInputChange("shortDescription", e.target.value)}
                      placeholder="Get Discount"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Select Restaurant <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.restaurant}
                        onChange={(e) => handleInputChange("restaurant", e.target.value)}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      >
                        <option value="">Select Restaurant</option>
                        <option value="cafe-monarch">Café Monarch</option>
                        <option value="hungry-puppets">Hungry Puppets</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Select Priority
                      </label>
                      <select
                        value={formData.priority}
                        onChange={(e) => handleInputChange("priority", e.target.value)}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      >
                        <option value="Priority">Priority</option>
                        <option value="High">High</option>
                        <option value="Normal">Normal</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Advertisement Type
                    </label>
                    <select
                      value={formData.advertisementType}
                      onChange={(e) => handleInputChange("advertisementType", e.target.value)}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                      <option value="Restaurant Promotion">Restaurant Promotion</option>
                      <option value="Video promotion">Video promotion</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Validity <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={formData.validity}
                        onChange={(e) => handleInputChange("validity", e.target.value)}
                        className="w-full px-4 py-2.5 pr-10 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Show Review & Ratings
                    </label>
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.showReview}
                          onChange={(e) => handleInputChange("showReview", e.target.checked)}
                          className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-slate-700">Review</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.showRatings}
                          onChange={(e) => handleInputChange("showRatings", e.target.checked)}
                          className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-slate-700">Rating</span>
                      </label>
                    </div>
                  </div>

                  {/* Upload Related Files */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-4">
                      Upload Related Files
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-2">
                          Profile Image (Ratio - 1:1)
                        </label>
                        <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
                          <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                          <p className="text-sm font-medium text-blue-600 mb-1">Click to Upload Profile Image</p>
                          <p className="text-xs text-slate-500">Supports: PNG, JPG, JPEG, WEBP Maximum 2 MB</p>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-2">
                          Upload Cover (Ratio - 2:1)
                        </label>
                        <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
                          <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                          <p className="text-sm font-medium text-blue-600 mb-1">Click to Upload Cover Image</p>
                          <p className="text-xs text-slate-500">Supports: PNG, JPG, JPEG, WEBP Maximum 2 MB</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-4">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-6 py-2.5 text-sm font-medium rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-all"
                    >
                      Reset
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-md"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Advertisement Preview */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Advertisement Preview</h2>
              <div className="border-2 border-slate-200 rounded-lg overflow-hidden">
                <div className="relative bg-gradient-to-br from-slate-50 to-slate-100" style={{ aspectRatio: "2/1" }}>
                  {/* Cover Image Area */}
                  <div className="absolute inset-0">
                    <img
                      src={coverPlaceholder}
                      alt="Cover"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none"
                      }}
                    />
                  </div>
                  
                  {/* Content Overlay */}
                  <div className="absolute inset-0 p-4 flex flex-col justify-between">
                    <div className="flex items-start justify-between">
                      <div className="w-16 h-16 rounded-full bg-white border-2 border-white shadow-md overflow-hidden">
                        <img
                          src={profilePlaceholder}
                          alt="Profile"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = "none"
                          }}
                        />
                      </div>
                      <button className="p-2 rounded-full bg-white/80 hover:bg-white transition-colors">
                        <Heart className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                    
                    <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3">
                      <h3 className="text-sm font-semibold text-slate-900 mb-1">
                        {formData.title || "Title"}
                      </h3>
                      <p className="text-xs text-slate-600 mb-2">
                        {formData.shortDescription || "Description"}
                      </p>
                      {formData.showRatings && (
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs font-medium text-slate-900">4.7 (25+)</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
