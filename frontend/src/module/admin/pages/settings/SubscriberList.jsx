import { useState } from "react";
import { Search, Download } from "lucide-react";

import burgerIcon from "../../assets/Dashboard-icons/image13.png";
import leafIcon from "../../assets/Dashboard-icons/image14.png";
import chefIcon from "../../assets/Dashboard-icons/image16.png";

const statsCards = [
  { id: 1, label: "Total Subscribed User", value: 3, bg: "bg-sky-50" },
  { id: 2, label: "Active Subscriptions", value: 0, bg: "bg-emerald-50" },
  { id: 3, label: "Expired Subscription", value: 3, bg: "bg-rose-50" },
  { id: 4, label: "Expiring Soon", value: 0, bg: "bg-amber-50" },
];

const restaurantRows = [
  {
    id: 1,
    name: "Tasty Lunch",
    icon: leafIcon,
    packageName: "Standard",
    price: "$ 799.00",
    expDate: "23 May 2023",
    subscriptionUsed: 1,
    isTrial: "No",
    isCancel: "No",
    status: "Expired",
  },
  {
    id: 2,
    name: "Cheese Burger",
    icon: burgerIcon,
    packageName: "Pro",
    price: "$ 1,199.00",
    expDate: "19 Oct 2025",
    subscriptionUsed: 2,
    isTrial: "No",
    isCancel: "No",
    status: "Expired",
  },
  {
    id: 3,
    name: "Cheesy Restaurant",
    icon: chefIcon,
    packageName: "Pro",
    price: "$ 1,199.00",
    expDate: "19 Oct 2025",
    subscriptionUsed: 1,
    isTrial: "No",
    isCancel: "No",
    status: "Expired",
  },
];

export default function SubscriberList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [zoneFilter] = useState("All Zones");

  const filteredRows = restaurantRows.filter((row) =>
    row.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  return (
    <div className="p-4 lg:p-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <h1 className="text-xl lg:text-2xl font-bold text-slate-900 flex items-center gap-2">
          <span role="img" aria-label="subscribed">
            📋
          </span>
          <span>Subscribed Restaurant List</span>
        </h1>

        <div className="relative">
          <select className="pl-3 pr-8 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none">
            <option value="all-zones">{zoneFilter}</option>
          </select>
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 pointer-events-none">
            ▾
          </span>
        </div>
      </div>

      {/* Top stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        {statsCards.map((card) => (
          <div
            key={card.id}
            className={`${card.bg} rounded-lg px-5 py-4 flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-slate-600">
                {card.label}
              </p>
              <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center">
                <span className="text-lg">📊</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Summary strip */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-4">
        <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-200">
          <div className="flex-1 px-5 py-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-sky-50 text-sky-600 text-lg">
                ⬜
              </span>
              <div>
                <p className="font-semibold">TOTAL TRANSACTIONS</p>
                <p className="text-[11px] text-slate-500">5</p>
              </div>
            </div>
          </div>

          <div className="flex-1 px-5 py-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 text-lg">
                💰
              </span>
              <div>
                <p className="font-semibold">TOTAL EARNING</p>
                <p className="text-[11px] text-emerald-600 font-semibold">
                  $ 4,795.00
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 px-5 py-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-50 text-amber-600 text-lg">
                📈
              </span>
              <div>
                <p className="font-semibold">EARNED THIS MONTH</p>
                <p className="text-[11px] text-slate-500">$ 0.00</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Restaurant list card */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="px-4 py-3 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-slate-900">
              Restaurant List
            </h2>
            <span className="inline-flex items-center justify-center min-w-[24px] h-6 text-xs font-semibold rounded-full bg-slate-100 text-slate-700">
              3
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <div className="relative">
              <select className="pl-3 pr-8 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none">
                <option>All</option>
              </select>
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 pointer-events-none">
                ▾
              </span>
            </div>

            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Ex: Search by name & pack"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>

            <button className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-100 transition-colors">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-xs">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-5 py-3 text-left font-semibold text-slate-600">
                  Sl
                </th>
                <th className="px-5 py-3 text-left font-semibold text-slate-600">
                  Restaurant Info
                </th>
                <th className="px-5 py-3 text-left font-semibold text-slate-600">
                  Current Package Name
                </th>
                <th className="px-5 py-3 text-left font-semibold text-slate-600">
                  Package Price
                </th>
                <th className="px-5 py-3 text-left font-semibold text-slate-600">
                  Exp Date
                </th>
                <th className="px-5 py-3 text-left font-semibold text-slate-600">
                  Total Subscription Used
                </th>
                <th className="px-5 py-3 text-left font-semibold text-slate-600">
                  Is Trial
                </th>
                <th className="px-5 py-3 text-left font-semibold text-slate-600">
                  Is Cancel
                </th>
                <th className="px-5 py-3 text-left font-semibold text-slate-600">
                  Status
                </th>
                <th className="px-5 py-3 text-left font-semibold text-slate-600">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRows.map((row, index) => (
                <tr key={row.id} className="hover:bg-slate-50">
                  <td className="px-5 py-3 text-slate-700">{index + 1}</td>
                  <td className="px-5 py-3 text-slate-700">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center overflow-hidden border border-slate-200">
                        <img
                          src={row.icon}
                          alt={row.name}
                          className="w-8 h-8 object-contain"
                        />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-semibold">
                          {row.name}
                        </span>
                        <span className="text-[11px] text-amber-500">
                          ★ 0
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-slate-700">
                    {row.packageName}
                  </td>
                  <td className="px-5 py-3 text-slate-700">{row.price}</td>
                  <td className="px-5 py-3 text-slate-700">{row.expDate}</td>
                  <td className="px-5 py-3 text-slate-700">
                    {row.subscriptionUsed}
                  </td>
                  <td className="px-5 py-3">
                    <StatusPill label={row.isTrial} variant="neutral" />
                  </td>
                  <td className="px-5 py-3">
                    <StatusPill label={row.isCancel} variant="neutral" />
                  </td>
                  <td className="px-5 py-3">
                    <StatusPill label={row.status} variant="danger" />
                  </td>
                  <td className="px-5 py-3">
                    <button className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-orange-400 text-orange-500 hover:bg-orange-50 transition-colors text-[11px] font-semibold">
                      👁
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatusPill({ label, variant }) {
  if (variant === "danger") {
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full bg-rose-50 text-rose-500 text-[11px] font-semibold">
        {label}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-semibold">
      {label}
    </span>
  );
}
