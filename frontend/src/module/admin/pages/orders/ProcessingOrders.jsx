import { Search } from "lucide-react"
import { ordersDummy } from "../../data/ordersDummy"

const processingOrders = ordersDummy.filter((order) => order.orderStatus === "Processing")

function ProcessingHeader() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
      <div>
        <h1 className="text-lg font-semibold text-slate-800">Processing Orders</h1>
        <p className="text-xs text-slate-500">
          Orders that are currently being prepared by restaurants.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button className="px-3 py-2 text-xs rounded-md border border-slate-200 bg-white hover:bg-slate-50">
          Export
        </button>
        <button className="px-3 py-2 text-xs rounded-md border border-slate-200 bg-white hover:bg-slate-50">
          Filters
        </button>
      </div>
    </div>
  )
}

function ProcessingSearchBar() {
  return (
    <div className="mb-4">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search your order..."
          className="w-full rounded-md border border-slate-200 bg-white pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>
    </div>
  )
}

function ProcessingTable() {
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
            <th className="px-4 py-3 text-right font-medium">Total Amount</th>
            <th className="px-4 py-3 text-left font-medium">Order Status</th>
            <th className="px-4 py-3 text-left font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-700">
          {processingOrders.map((order) => (
            <tr key={order.orderId} className="hover:bg-slate-50">
              <td className="px-4 py-3">{order.sl}</td>
              <td className="px-4 py-3 text-emerald-600 font-semibold">#{order.orderId}</td>
              <td className="px-4 py-3">
                <div>{order.date}</div>
                <div className="text-[10px] text-slate-500">{order.time}</div>
              </td>
              <td className="px-4 py-3">
                <div className="font-medium text-xs">{order.customerName}</div>
                <div className="text-[10px] text-slate-500">{order.customerPhone}</div>
              </td>
              <td className="px-4 py-3 text-xs">{order.restaurant}</td>
              <td className="px-4 py-3 text-right font-semibold">
                ${order.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </td>
              <td className="px-4 py-3">
                <div className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-50 text-amber-600">
                  Processing
                </div>
                <div className="text-[10px] text-slate-500 mt-1">{order.deliveryType}</div>
              </td>
              <td className="px-4 py-3">
                <button className="px-2 py-1 text-[10px] rounded-md border border-slate-200 hover:bg-slate-50">
                  Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function ProcessingOrders() {
  return (
    <div className="p-4 lg:p-6">
      <ProcessingHeader />
      <ProcessingSearchBar />
      <ProcessingTable />
    </div>
  )
}


