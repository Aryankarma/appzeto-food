import { useNavigate } from "react-router-dom"
import { ArrowLeft, CreditCard, Download, Share2 } from "lucide-react"

export default function ShowIdCard() {
  const navigate = useNavigate()

  // Sample ID card data
  const idCardData = {
    name: "John Doe",
    id: "DP-123456",
    phone: "+91 9876543210",
    status: "Active",
    validTill: "31 Dec 2025"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center gap-4 px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Show ID card</h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-4">
        {/* ID Card */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 shadow-lg text-white">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Appzeto Delivery</h2>
                <p className="text-sm text-blue-100">Partner ID Card</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-blue-100 mb-1">Name</p>
              <p className="text-xl font-bold">{idCardData.name}</p>
            </div>

            <div>
              <p className="text-sm text-blue-100 mb-1">Partner ID</p>
              <p className="text-xl font-bold">{idCardData.id}</p>
            </div>

            <div>
              <p className="text-sm text-blue-100 mb-1">Phone</p>
              <p className="text-lg font-semibold">{idCardData.phone}</p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-blue-400">
              <div>
                <p className="text-sm text-blue-100">Status</p>
                <p className="text-lg font-bold text-green-300">{idCardData.status}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-blue-100">Valid till</p>
                <p className="text-lg font-semibold">{idCardData.validTill}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => {
              // Download ID card functionality
              alert("Download ID card")
            }}
            className="w-full bg-white border-2 border-gray-300 text-gray-900 font-semibold py-4 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Download ID card
          </button>

          <button
            onClick={() => {
              // Share ID card functionality
              alert("Share ID card")
            }}
            className="w-full bg-white border-2 border-gray-300 text-gray-900 font-semibold py-4 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <Share2 className="w-5 h-5" />
            Share ID card
          </button>
        </div>

        {/* Info */}
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            This is your official delivery partner ID card. Keep it handy for verification purposes.
          </p>
        </div>
      </div>
    </div>
  )
}

