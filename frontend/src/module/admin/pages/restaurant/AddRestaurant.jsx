import { useState } from "react"
import { Building2, Info, Tag, Upload, Calendar, Eye, EyeOff, FileText, MapPin } from "lucide-react"

export default function AddRestaurant() {
  const [activeLanguage, setActiveLanguage] = useState("default")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    restaurantName: "",
    restaurantAddress: "",
    cuisine: "",
    zone: "",
    logo: null,
    cover: null,
    estimatedDeliveryTimeMin: "",
    estimatedDeliveryTimeMax: "",
    firstName: "",
    lastName: "",
    phone: "",
    phoneCode: "+1",
    tinNumber: "",
    date: "",
    licenseDocument: null,
    tags: "",
    businessTIN: "",
    tinExpireDate: "",
    tinCertificate: null,
    email: "",
    password: "",
    confirmPassword: "",
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

  const handleFileUpload = (field, file) => {
    if (file) {
      setFormData(prev => ({ ...prev, [field]: file }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    alert("Restaurant added successfully!")
  }

  const handleReset = () => {
    setFormData({
      restaurantName: "",
      restaurantAddress: "",
      cuisine: "",
      zone: "",
      logo: null,
      cover: null,
      estimatedDeliveryTimeMin: "",
      estimatedDeliveryTimeMax: "",
      firstName: "",
      lastName: "",
      phone: "",
      phoneCode: "+1",
      tinNumber: "",
      date: "",
      licenseDocument: null,
      tags: "",
      businessTIN: "",
      tinExpireDate: "",
      tinCertificate: null,
      email: "",
      password: "",
      confirmPassword: "",
    })
  }

  return (
    <div className="p-4 lg:p-6 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Add New Restaurant</h1>
          </div>

          {/* Language Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200">
            {languageTabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
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
        </div>

        <form onSubmit={handleSubmit}>
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
            <div className="mb-4">
              <p className="text-sm text-slate-600">Here you setup your all business information.</p>
            </div>

            <div className="space-y-6">
              {/* Restaurant Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Restaurant Name ({activeLanguage === "default" ? "Default" : languageTabs.find(t => t.key === activeLanguage)?.label}) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.restaurantName}
                  onChange={(e) => handleInputChange("restaurantName", e.target.value)}
                  placeholder="Ex: ABC Company"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  required
                />
              </div>

              {/* Restaurant Address */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Restaurant Address ({activeLanguage === "default" ? "Default" : languageTabs.find(t => t.key === activeLanguage)?.label}) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <textarea
                    value={formData.restaurantAddress}
                    onChange={(e) => handleInputChange("restaurantAddress", e.target.value)}
                    placeholder="Ex: House#94 Road#8 Abc City"
                    rows={3}
                    maxLength={100}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
                    required
                  />
                  <div className="absolute bottom-2 right-2 text-xs text-slate-500">
                    {formData.restaurantAddress.length}/100
                  </div>
                </div>
              </div>

              {/* Cuisine and Zone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Cuisine <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.cuisine}
                    onChange={(e) => handleInputChange("cuisine", e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    required
                  >
                    <option value="">Select Cuisine</option>
                    <option value="italian">Italian</option>
                    <option value="chinese">Chinese</option>
                    <option value="indian">Indian</option>
                    <option value="mexican">Mexican</option>
                    <option value="american">American</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Zone <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.zone}
                    onChange={(e) => handleInputChange("zone", e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    required
                  >
                    <option value="">Select Zone</option>
                    <option value="zone1">Zone 1</option>
                    <option value="zone2">Zone 2</option>
                    <option value="zone3">Zone 3</option>
                  </select>
                </div>
              </div>

              {/* Logo and Cover Image */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Logo */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Logo <span className="text-red-500">*</span>
                  </label>
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/gif"
                      onChange={(e) => handleFileUpload("logo", e.target.files[0])}
                      className="hidden"
                      id="logo-upload"
                      required
                    />
                    <label htmlFor="logo-upload" className="cursor-pointer">
                      <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                      <p className="text-sm font-medium text-slate-700 mb-1">Click to upload Or drag and drop</p>
                      <div className="text-xs text-slate-500 space-y-1 mt-2">
                        <p>JPG, JPEG, PNG, Gif</p>
                        <p>Image size: Max 2 MB (1:1)</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Restaurant Cover */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Restaurant Cover <span className="text-red-500">*</span>
                  </label>
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/gif"
                      onChange={(e) => handleFileUpload("cover", e.target.files[0])}
                      className="hidden"
                      id="cover-upload"
                      required
                    />
                    <label htmlFor="cover-upload" className="cursor-pointer">
                      <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                      <p className="text-sm font-medium text-slate-700 mb-1">Click to upload Or drag and drop</p>
                      <div className="text-xs text-slate-500 space-y-1 mt-2">
                        <p>JPG, JPEG, PNG, Gif</p>
                        <p>Image size: Max 2 MB (3:1)</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* General Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
            <div className="mb-4">
              <p className="text-sm text-slate-600">Here you setup your all business general settings.</p>
            </div>

            <div className="space-y-6">
              {/* Restaurant Info */}
              <div>
                <h3 className="text-base font-semibold text-slate-900 mb-4">Restaurant Info</h3>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Estimated Delivery Time (Min & Maximum Time) <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={formData.estimatedDeliveryTimeMin}
                        onChange={(e) => handleInputChange("estimatedDeliveryTimeMin", e.target.value)}
                        placeholder="Ex: 30"
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        required
                      />
                      <input
                        type="number"
                        value={formData.estimatedDeliveryTimeMax}
                        onChange={(e) => handleInputChange("estimatedDeliveryTimeMax", e.target.value)}
                        placeholder="Ex: 60"
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        required
                      />
                      <select className="px-4 py-2.5 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm">
                        <option>Minutes</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Owner Info */}
              <div>
                <h3 className="text-base font-semibold text-slate-900 mb-4">Owner Info</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      placeholder="Ex: Jhone"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      placeholder="Ex: Doe"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <select
                        value={formData.phoneCode}
                        onChange={(e) => handleInputChange("phoneCode", e.target.value)}
                        className="px-4 py-2.5 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      >
                        <option value="+1">🇺🇸 +1</option>
                        <option value="+91">🇮🇳 +91</option>
                        <option value="+44">🇬🇧 +44</option>
                      </select>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="Phone number"
                        className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Data */}
              <div>
                <h3 className="text-base font-semibold text-slate-900 mb-4">Additional Data</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Enter your tin number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.tinNumber}
                      onChange={(e) => handleInputChange("tinNumber", e.target.value)}
                      placeholder="Enter TIN"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Date <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => handleInputChange("date", e.target.value)}
                        className="w-full px-4 py-2.5 pr-10 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        required
                      />
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      License document <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload("licenseDocument", e.target.files[0])}
                        className="hidden"
                        id="license-upload"
                        required
                      />
                      <label
                        htmlFor="license-upload"
                        className="px-4 py-2 border border-slate-300 rounded-lg bg-white hover:bg-slate-50 cursor-pointer text-sm font-medium text-slate-700 transition-colors"
                      >
                        Choose File
                      </label>
                      <span className="text-sm text-slate-600">
                        {formData.licenseDocument ? formData.licenseDocument.name : "No file chosen"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Tag className="w-5 h-5 text-slate-600" />
                  <h3 className="text-base font-semibold text-slate-900">Tags</h3>
                </div>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => handleInputChange("tags", e.target.value)}
                  placeholder="Enter tags"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Business TIN */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
            <div className="mb-4">
              <p className="text-sm text-slate-600">Setup your Business TIN.</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1">
                  Taxpayer Identification Number(TIN)
                  <Info className="w-4 h-4 text-slate-400" />
                </label>
                <input
                  type="text"
                  value={formData.businessTIN}
                  onChange={(e) => handleInputChange("businessTIN", e.target.value)}
                  placeholder="Type your TIN Number"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Expire Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.tinExpireDate}
                    onChange={(e) => handleInputChange("tinExpireDate", e.target.value)}
                    className="w-full px-4 py-2.5 pr-10 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  TIN Certificate
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer relative">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload("tinCertificate", e.target.files[0])}
                    className="hidden"
                    id="tin-certificate-upload"
                  />
                  <label htmlFor="tin-certificate-upload" className="cursor-pointer">
                    <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                    <p className="text-sm font-medium text-slate-700 mb-1">Select a file or Drag & Drop Here</p>
                    <div className="text-xs text-slate-500 space-y-1 mt-2">
                      <p>Pdf, doc, jpg. File size: max 2 MB</p>
                    </div>
                  </label>
                  <button
                    type="button"
                    className="absolute top-2 right-2 p-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Account info */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
            <h3 className="text-base font-semibold text-slate-900 mb-6">Account info</h3>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Ex: Jhone@company.com"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    placeholder="Ex: 8+ Character"
                    className="w-full px-4 py-2.5 pr-10 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    placeholder="Ex: 8+ Character"
                    className="w-full px-4 py-2.5 pr-10 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 mb-6">
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
              Save Information
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
