import { ArrowLeft, AlertTriangle } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function PocketBalancePage() {

  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white text-black">

      {/* Top Bar */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-200">
        <ArrowLeft onClick={() => navigate(-1)} size={22} className="cursor-pointer" />
        <h1 className="text-lg font-semibold">Pocket balance</h1>
      </div>

      {/* Warning Banner */}
      <div className="bg-yellow-400 p-4 flex items-start gap-3 text-black">
        <AlertTriangle size={20} />
        <div className="text-sm leading-tight">
          <p className="font-semibold">Withdraw currently disabled</p>
          <p className="text-xs">Withdrawable amount is ₹0</p>
        </div>
      </div>

      {/* Withdraw Section */}
      <div className="px-5 py-6 flex flex-col items-center text-center">
        <p className="text-sm text-gray-600 mb-1">Withdraw amount</p>
        <p className="text-4xl font-bold mb-5">₹0</p>

        <button
          disabled
          className="w-full bg-gray-200 text-gray-500 font-medium py-3 rounded-lg cursor-not-allowed"
        >
          Withdraw
        </button>
      </div>

      {/* Section Header */}
      <div className=" bg-gray-100 py-2 pt-4 text-center text-xs font-semibold text-gray-600">
        POCKET DETAILS • 8 DEC – 14 DEC
      </div>

      {/* Detail Rows */}
      <div className="px-4 pt-2">

        <DetailRow label="Earnings" value="₹0" />
        <DetailRow label="Amount withdrawn" value="₹0" />
        <DetailRow label="Cash collected" value="₹0" />
        <DetailRow label="Deductions" value="₹0" />
        <DetailRow label="Pocket balance" value="₹0" />

        <DetailRow
          label={
            <div>
              Min. balance required
              <p className="text-xs text-gray-500">
                Resets every Monday and increases with earnings
              </p>
            </div>
          }
          value="₹300"
          multiline
        />

        <DetailRow label="Withdrawable amount" value="₹0" />

      </div>
    </div>
  )
}

/* Reusable row component */
function DetailRow({ label, value, multiline = false }) {
  return (
    <div className="py-3 flex justify-between items-start border-b border-gray-100">
      <div className={`text-sm ${multiline ? "" : "font-medium"} text-gray-800`}>
        {label}
      </div>
      <div className="text-sm font-semibold text-black">{value}</div>
    </div>
  )
}
