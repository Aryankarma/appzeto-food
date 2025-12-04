import { useState } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { 
  ArrowLeft,
  Home,
  FileText,
  UtensilsCrossed,
  User,
  Camera,
  Save
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function EditProfile() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: "Jhon Doe",
    phone: "+8801700000000",
    email: "jhon.doe@example.com",
    shift: "Morning (04:00 AM - 11:59 AM)"
  })

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission
    console.log("Profile updated:", formData)
    navigate("/delivery/profile")
  }

  return (
    <div className="min-h-screen bg-[#f6e9dc] overflow-x-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 md:py-3 flex items-center gap-3 md:gap-4 rounded-b-3xl md:rounded-b-none">
        <button 
          onClick={() => navigate("/delivery/profile")}
          className="p-1.5 md:p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
        </button>
        <h1 className="text-base md:text-xl font-bold text-gray-900">Edit Profile</h1>
      </div>

      {/* Main Content */}
      <div className="px-3 md:px-4 py-4 md:py-6 pb-24 md:pb-6">
        <form onSubmit={handleSubmit} className="space-y-2 md:space-y-4">
          {/* Profile Picture */}
          <Card className="bg-white shadow-sm border border-gray-100">
            <CardContent className="p-3 md:p-6">
              <div className="flex flex-col items-center">
                <div className="relative mb-2 md:mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
                    alt="Profile"
                    className="w-20 h-20 md:w-32 md:h-32 rounded-full border-2 md:border-4 border-white object-cover shadow-md"
                  />
                  <label className="absolute bottom-0 right-0 bg-[#ff8100] text-white p-1.5 md:p-2 rounded-full cursor-pointer hover:bg-[#e67300] transition-colors">
                    <Camera className="w-3 h-3 md:w-4 md:h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        // Handle image upload
                        console.log("Image selected:", e.target.files[0])
                      }}
                    />
                  </label>
                </div>
                <p className="text-gray-600 text-xs md:text-sm text-center">Tap to change profile picture</p>
              </div>
            </CardContent>
          </Card>

          {/* Name */}
          <Card className="bg-white shadow-sm border border-gray-100">
            <CardContent className="p-3 md:p-6">
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff8100] focus:border-transparent outline-none"
                required
              />
            </CardContent>
          </Card>

          {/* Phone */}
          <Card className="bg-white shadow-sm border border-gray-100">
            <CardContent className="p-3 md:p-6">
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff8100] focus:border-transparent outline-none"
                required
              />
            </CardContent>
          </Card>

          {/* Email */}
          <Card className="bg-white shadow-sm border border-gray-100">
            <CardContent className="p-3 md:p-6">
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff8100] focus:border-transparent outline-none"
                required
              />
            </CardContent>
          </Card>

          {/* Shift */}
          <Card className="bg-white shadow-sm border border-gray-100">
            <CardContent className="p-3 md:p-6">
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2">
                Shift
              </label>
              <select
                value={formData.shift}
                onChange={(e) => handleInputChange("shift", e.target.value)}
                className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff8100] focus:border-transparent outline-none"
              >
                <option value="Morning (04:00 AM - 11:59 AM)">Morning (04:00 AM - 11:59 AM)</option>
                <option value="Afternoon (12:00 PM - 07:59 PM)">Afternoon (12:00 PM - 07:59 PM)</option>
                <option value="Night (08:00 PM - 03:59 AM)">Night (08:00 PM - 03:59 AM)</option>
              </select>
            </CardContent>
          </Card>

          {/* Save Button */}
          <Button
            type="submit"
            className="w-full bg-[#ff8100] hover:bg-[#e67300] text-white font-semibold py-2.5 md:py-3 rounded-lg text-sm md:text-lg mt-2 md:mt-0"
          >
            <Save className="w-4 h-4 md:w-5 md:h-5 mr-2" />
            Save Changes
          </Button>
        </form>
      </div>

      {/* Bottom Navigation Bar - Mobile Only */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="flex items-center justify-around py-2 px-4">
          <button 
            onClick={() => navigate("/delivery")}
            className="flex flex-col items-center gap-1 p-2 text-gray-600"
          >
            <Home className="w-6 h-6" />
            <span className="text-[10px] text-gray-600 font-medium">Home</span>
          </button>
          <button 
            onClick={() => navigate("/delivery/requests")}
            className="flex flex-col items-center gap-1 p-2 text-gray-600 relative"
          >
            <div className="relative">
              <FileText className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                5
              </span>
            </div>
            <span className="text-[10px] text-gray-600 font-medium">Request</span>
          </button>
          <button 
            onClick={() => navigate("/delivery/orders")}
            className="flex flex-col items-center gap-1 p-2 text-gray-600"
          >
            <UtensilsCrossed className="w-6 h-6" />
            <span className="text-[10px] text-gray-600 font-medium">Orders</span>
          </button>
          <button 
            onClick={() => navigate("/delivery/profile")}
            className="flex flex-col items-center gap-1 p-2 text-[#ff8100]"
          >
            <User className="w-6 h-6" />
            <span className="text-[10px] text-[#ff8100] font-medium">Profile</span>
          </button>
        </div>
      </div>
    </div>
  )
}

