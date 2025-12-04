import { Search } from "lucide-react"

function DineInHeader() {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h1 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
        <span className="text-xl">🧾</span>
        Dine In Orders
        <span className="ml-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-500">
          0
        </span>
      </h1>
      <button className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs hover:bg-slate-50">
        Export
      </button>
    </div>
  )
}

function DineInSearchBar() {
  return (
    <div className="mb-4">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search your order..."
          className="w-full rounded-md border border-slate-200 bg-white pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>
    </div>
  )
}

function DineInTableEmpty() {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="min-w-full text-xs">
        <thead className="bg-slate-50 text-slate-500">
          <tr>
            <th className="px-4 py-3 text-left font-medium">Sl</th>
            <th className="px-4 py-3 text-left font-medium">Order ID</th>
            <th className="px-4 py-3 text-left font-medium">Order Date</th>
            <th className="px-4 py-3 text-left font-medium">Customer Information</th>
            <th className="px-4 py-3 text-left font-medium">Restaurant</th>
            <th className="px-4 py-3 text-left font-medium">Total Amount</th>
            <th className="px-4 py-3 text-left font-medium">Order Status</th>
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

export default function DineInOrders() {
  return (
    <div className="p-4 lg:p-6">
      <DineInHeader />
      <DineInSearchBar />
      <DineInTableEmpty />
    </div>
  )
}


