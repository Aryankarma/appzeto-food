import { useState } from "react";
import { Search, Download, Plus, Edit3 } from "lucide-react";

const initialTaxes = [
  { id: 1, name: "GST", rate: "15%", active: true },
  { id: 2, name: "Custom Tax", rate: "10%", active: true },
  { id: 3, name: "Income Tax", rate: "5%", active: true },
];

export default function CreateTaxes() {
  const [taxes, setTaxes] = useState(initialTaxes);
  const [search, setSearch] = useState("");

  const filtered = taxes.filter((tax) =>
    tax.name.toLowerCase().includes(search.toLowerCase().trim())
  );

  const toggleStatus = (id) => {
    setTaxes((prev) =>
      prev.map((t) => (t.id === id ? { ...t, active: !t.active } : t))
    );
  };

  return (
    <div className="p-4 lg:p-6 bg-slate-50 min-h-screen">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-slate-900">
            All Taxes
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Ex: Tax"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-48 lg:w-64 pl-8 pr-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>

          <button className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-100 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>

          <button className="inline-flex items-center gap-1 px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            <span>Create Tax</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900">
            List of Taxes
          </h2>
          <span className="inline-flex items-center justify-center min-w-[24px] h-6 text-xs font-semibold rounded-full bg-slate-100 text-slate-700">
            {filtered.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-xs">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-5 py-3 text-left font-semibold text-slate-600">
                  Sl
                </th>
                <th className="px-5 py-3 text-left font-semibold text-slate-600">
                  Tax Name
                </th>
                <th className="px-5 py-3 text-left font-semibold text-slate-600">
                  Tax Rate
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
              {filtered.map((tax, index) => (
                <tr key={tax.id} className="hover:bg-slate-50">
                  <td className="px-5 py-3 text-slate-700">
                    {index + 1}
                  </td>
                  <td className="px-5 py-3 text-slate-700">{tax.name}</td>
                  <td className="px-5 py-3 text-slate-700">{tax.rate}</td>
                  <td className="px-5 py-3">
                    <ToggleSwitch
                      enabled={tax.active}
                      onToggle={() => toggleStatus(tax.id)}
                    />
                  </td>
                  <td className="px-5 py-3">
                    <button className="inline-flex items-center justify-center w-8 h-8 rounded border border-blue-500 text-blue-600 hover:bg-blue-50 transition-colors">
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-8 text-center text-xs text-slate-500"
                  >
                    No taxes found.
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
