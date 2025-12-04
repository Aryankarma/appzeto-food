import { useState } from "react";
import { Search, Download, Plus, Eye, Edit3 } from "lucide-react";

const initialPackages = [
  { id: 1, name: "Pro", price: "$ 1,199.00", duration: "365 Days", subscribers: 0, active: true },
  { id: 2, name: "Standard", price: "$ 799.00", duration: "180 Days", subscribers: 0, active: true },
  { id: 3, name: "Basic", price: "$ 399.00", duration: "120 Days", subscribers: 0, active: true },
];

export default function SubscriptionPackages() {
  const [packages, setPackages] = useState(initialPackages);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = packages.filter((pkg) =>
    pkg.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const toggleStatus = (id) => {
    setPackages((prev) =>
      prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p))
    );
  };

  return (
    <div className="p-4 lg:p-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <h1 className="text-xl lg:text-2xl font-bold text-slate-900 flex items-center gap-2">
          <span role="img" aria-label="subscription">
            📦
          </span>
          <span>Subscription Package List</span>
          <span className="inline-flex items-center justify-center text-[11px] font-semibold rounded-full bg-slate-100 text-slate-700 px-2 py-0.5">
            3
          </span>
        </h1>
      </div>

      {/* Overview section */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between px-4 py-3 border-b border-slate-100 gap-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Overview</h2>
            <p className="text-xs text-slate-500 mt-1">
              See overview of all the packages earnings
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            {["All", "This Year", "This Month", "This Week"].map((label) => {
              const active = activeFilter === label;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => setActiveFilter(label)}
                  className={`px-3 py-1 rounded-full font-semibold border text-xs transition-all ${
                    active
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4 py-4">
          <OverviewCard
            title="Basic"
            amount="$ 399.00"
            previous="$ 399.00"
            bgColor="bg-sky-50"
          />
          <OverviewCard
            title="Standard"
            amount="$ 1,598.00"
            previous="$ 1,598.00"
            bgColor="bg-amber-50"
          />
          <OverviewCard
            title="Pro"
            amount="$ 3,597.00"
            previous="$ 3,597.00"
            bgColor="bg-sky-50"
          />
        </div>
      </div>

      {/* Search + actions */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-4">
        <div className="px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex-1 md:flex-none">
            <div className="relative w-full md:w-72">
              <input
                type="text"
                placeholder="Search by name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-100 transition-colors">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button className="inline-flex items-center gap-1 px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4" />
              <span>Add Subscription Package</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border-t border-slate-100">
          <table className="min-w-full divide-y divide-slate-100 text-xs">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-5 py-3 text-left font-semibold text-slate-600">Sl</th>
                <th className="px-5 py-3 text-left font-semibold text-slate-600">
                  Package Name
                </th>
                <th className="px-5 py-3 text-left font-semibold text-slate-600">Pricing</th>
                <th className="px-5 py-3 text-left font-semibold text-slate-600">Duration</th>
                <th className="px-5 py-3 text-left font-semibold text-slate-600">
                  Current Subscriber
                </th>
                <th className="px-5 py-3 text-left font-semibold text-slate-600">Status</th>
                <th className="px-5 py-3 text-left font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((pkg, index) => (
                <tr key={pkg.id} className="hover:bg-slate-50">
                  <td className="px-5 py-3 text-slate-700">{index + 1}</td>
                  <td className="px-5 py-3 text-slate-700">{pkg.name}</td>
                  <td className="px-5 py-3 text-slate-700">{pkg.price}</td>
                  <td className="px-5 py-3 text-slate-700">{pkg.duration}</td>
                  <td className="px-5 py-3 text-slate-700">
                    {pkg.subscribers}
                  </td>
                  <td className="px-5 py-3">
                    <ToggleSwitch
                      enabled={pkg.active}
                      onToggle={() => toggleStatus(pkg.id)}
                    />
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <button className="inline-flex items-center justify-center w-8 h-8 rounded border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="inline-flex items-center justify-center w-8 h-8 rounded border border-blue-500 text-blue-600 hover:bg-blue-50 transition-colors">
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-8 text-center text-xs text-slate-500"
                  >
                    No subscription packages found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function OverviewCard({ title, amount, previous, bgColor }) {
  return (
    <div className={`${bgColor} rounded-xl px-6 py-5 flex flex-col items-center justify-between`}>
      <div className="mb-4 flex items-center justify-center w-14 h-14 rounded-full bg-white shadow-sm">
        <span role="img" aria-label={title} className="text-xl">
          💳
        </span>
      </div>
      <p className="text-sm font-semibold text-slate-700 mb-1">{title}</p>
      <p className="text-2xl font-bold text-sky-700 mb-1">{amount}</p>
      <p className="text-sm font-semibold line-through text-slate-400">
        {previous}
      </p>
    </div>
  );
}

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
  );
}
