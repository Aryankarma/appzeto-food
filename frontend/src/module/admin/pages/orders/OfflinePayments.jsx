import { Search } from "lucide-react"

const tabs = [
  "All",
  "Pending Verifications",
  "Payment verified Orders",
  "Verification Denied Orders",
]

function OfflineHeader() {
  return (
    <div className="mb-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <span className="text-xl">📁</span>
          Verify Offline Payments
          <span className="ml-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-500">
            0
          </span>
        </h1>
      </div>
      <p className="mt-2 rounded-md bg-rose-50 px-3 py-2 text-[11px] text-rose-600">
        For Offline Payments Please Verify If The Payments Are Safely Received To Your Account.
        Customer Is Not Liable If You Confirm And Deliver The Orders Without Checking Payment
        Transactions.
      </p>
    </div>
  )
}

function OfflineTabs() {
  return (
    <div className="border-b border-slate-200 mb-4 flex flex-wrap gap-4 text-xs">
      {tabs.map((tab, index) => (
        <button
          key={tab}
          className={`pb-2 border-b-2 ${
            index === 0
              ? "border-emerald-500 text-emerald-600 font-medium"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}

function OfflineTableEmptyState() {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <div className="text-[11px] font-medium text-slate-600">All</div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
            <input
              type="text"
              placeholder="Ex: 10010"
              className="w-32 rounded-md border border-slate-200 bg-slate-50 pl-7 pr-3 py-1.5 text-[11px] focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
          <button className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-[11px] hover:bg-slate-50">
            Export
          </button>
        </div>
      </div>

      <table className="min-w-full text-xs">
        <thead className="bg-slate-50 text-slate-500">
          <tr>
            <th className="px-4 py-3 text-left font-medium">Sl</th>
            <th className="px-4 py-3 text-left font-medium">Order Id</th>
            <th className="px-4 py-3 text-left font-medium">Order Date</th>
            <th className="px-4 py-3 text-left font-medium">Customer Information</th>
            <th className="px-4 py-3 text-left font-medium">Total Amount</th>
            <th className="px-4 py-3 text-left font-medium">Payment Method</th>
            <th className="px-4 py-3 text-left font-medium">Actions</th>
          </tr>
        </thead>
      </table>

      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 flex h-20 w-24 items-center justify-center rounded-lg bg-slate-50 border border-dashed border-slate-200">
          <span className="text-4xl text-amber-400">!</span>
        </div>
        <p className="text-sm font-medium text-slate-600">No Data Found</p>
      </div>
    </div>
  )
}

export default function OfflinePayments() {
  return (
    <div className="p-4 lg:p-6">
      <OfflineHeader />
      <OfflineTabs />
      <OfflineTableEmptyState />
    </div>
  )
}


