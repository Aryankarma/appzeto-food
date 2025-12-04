export default function PointOfSale() {
  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#f7f8fa] overflow-x-hidden w-full" style={{ maxWidth: '100vw', boxSizing: 'border-box' }}>
      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 w-full overflow-hidden" style={{ maxWidth: '100%', boxSizing: 'border-box' }}>
        <div className="w-full mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-full overflow-hidden">
        {/* Food Section Card */}
        <div className="lg:col-span-2 w-full overflow-hidden" style={{ maxWidth: '100%' }}>
          <div className="rounded-lg bg-white shadow-sm border border-[#e3e6ef] overflow-hidden w-full" style={{ maxWidth: '100%' }}>
            <div className="px-6 py-4 border-b border-[#e3e6ef]">
              <h2 className="text-base font-semibold text-[#334257]">
                Food Section
              </h2>
            </div>

            <div className="bg-[#f9fafc] px-6 py-5">
              {/* First row: Zone & Restaurant */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-[#334257] mb-2">
                    Zone<span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select className="w-full h-11 rounded-md border border-[#e3e6ef] bg-white px-3 pr-10 text-sm text-[#4a5671] focus:outline-none focus:ring-1 focus:ring-[#006fbd]">
                      <option>Select Zone *</option>
                    </select>
                    <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400 text-xs">
                      ▼
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#334257] mb-2">
                    Restaurant<span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select className="w-full h-11 rounded-md border border-[#e3e6ef] bg-white px-3 pr-10 text-sm text-[#4a5671] focus:outline-none focus:ring-1 focus:ring-[#006fbd]">
                      <option>Select Restaurant</option>
                    </select>
                    <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400 text-xs">
                      ▼
                    </span>
                  </div>
                </div>
              </div>

              {/* Second row: Categories & Search */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                <div>
                  <label className="block text-sm font-medium text-[#334257] mb-2">
                    Categories
                  </label>
                  <div className="relative">
                    <select className="w-full h-11 rounded-md border border-[#e3e6ef] bg-white px-3 pr-10 text-sm text-[#4a5671] focus:outline-none focus:ring-1 focus:ring-[#006fbd]">
                      <option>Select Categories</option>
                    </select>
                    <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400 text-xs">
                      ▼
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-transparent mb-2">
                    Search
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 text-sm">
                      🔍
                    </span>
                    <input
                      type="text"
                      placeholder="Ex: Search Food Name"
                      className="w-full h-11 rounded-md border border-[#e3e6ef] bg-white pl-9 pr-3 text-sm text-[#4a5671] placeholder-[#9aa2b6] focus:outline-none focus:ring-1 focus:ring-[#006fbd]"
                    />
                  </div>
                </div>
              </div>

              {/* Empty state */}
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#d1d7e6] flex items-center justify-center mb-4">
                  <span className="text-2xl">🔍</span>
                </div>
                <p className="max-w-md text-[13px] text-[#8a94aa]">
                  To get accurate search results, first select a zone, then choose a
                  restaurant. You can then browse food by category or search
                  manually within that restaurant.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Billing Section Card */}
        <div className="flex flex-col h-full w-full overflow-hidden" style={{ maxWidth: '100%' }}>
          <div className="rounded-lg bg-white shadow-sm border border-[#e3e6ef] overflow-hidden flex flex-col h-full w-full" style={{ maxWidth: '100%' }}>
            <div className="px-6 py-4 border-b border-[#e3e6ef] flex items-center justify-between w-full overflow-hidden">
              <h2 className="text-base font-semibold text-[#334257]">
                Billing Section
              </h2>
            </div>

            <div className="bg-[#f9fafc] px-6 py-5 w-full overflow-hidden" style={{ maxWidth: '100%' }}>
              {/* Content - no scrolling */}
              <div className="space-y-4 w-full overflow-hidden" style={{ maxWidth: '100%' }}>
                {/* Customer + Add button */}
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-[#334257] mb-2">
                      Select Customer
                    </label>
                    <div className="relative">
                      <select className="w-full h-11 rounded-md border border-[#e3e6ef] bg-white px-3 pr-10 text-sm text-[#4a5671] focus:outline-none focus:ring-1 focus:ring-[#006fbd]">
                        <option>Select Customer</option>
                      </select>
                      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400 text-xs">
                        ▼
                      </span>
                    </div>
                  </div>
                  <div className="pt-7">
                    <button className="h-11 whitespace-nowrap px-4 rounded-md bg-[#006fbd] text-white text-sm font-semibold shadow-sm hover:bg-[#00589a]">
                      Add New Customer
                    </button>
                  </div>
                </div>

                {/* Order type */}
                <div>
                  <p className="text-sm font-semibold text-[#334257] mb-2">
                    Select Order Type
                  </p>
                  <div className="rounded-md border border-[#e3e6ef] bg-white px-4 py-3 flex flex-wrap gap-6 text-sm text-[#4a5671]">
                    <label className="inline-flex items-center gap-2">
                      <input type="radio" name="orderType" defaultChecked />
                      <span>Take Away</span>
                    </label>
                    <label className="inline-flex items-center gap-2 text-gray-400">
                      <input type="radio" name="orderType" disabled />
                      <span>Home Delivery</span>
                    </label>
                  </div>
                </div>

                {/* Items table header */}
                <div className="border border-[#e3e6ef] rounded-md overflow-hidden bg-white">
                  <div className="grid grid-cols-4 text-xs font-semibold text-[#334257] bg-[#f5f6fb] px-4 py-2">
                    <div>Item</div>
                    <div className="text-center">Qty</div>
                    <div className="text-right">Price</div>
                    <div className="text-center">Delete</div>
                  </div>
                  <div className="flex flex-col items-center justify-center py-10 text-center text-[#8a94aa] text-sm">
                    <div className="w-10 h-10 rounded-full border-2 border-dashed border-[#d1d7e6] flex items-center justify-center mb-3">
                      <span className="text-lg">🧾</span>
                    </div>
                    <p>No Items added yet</p>
                  </div>
                </div>

                {/* Totals */}
                <div className="space-y-2 text-sm text-[#4a5671]">
                  <div className="flex justify-between">
                    <span>Addon :</span>
                    <span>$ 0.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Subtotal :</span>
                    <span>$ 0.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discount :</span>
                    <span>- $ 0.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery fee :</span>
                    <span>$ 0.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Vat/tax :</span>
                    <span>$ 0.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service Charge :</span>
                    <span>$ 0.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Extra Packaging Amount :</span>
                    <span>$ 0.00</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-dashed border-[#d1d7e6] mt-2">
                    <span className="font-semibold">Total:</span>
                    <span className="font-bold text-lg text-[#334257]">$ 0.00</span>
                  </div>
                </div>

                {/* Paid by */}
                <div className="pt-2">
                  <p className="text-sm font-semibold text-[#334257] mb-2">
                    Paid by
                  </p>
                  <div className="flex gap-2">
                    <button className="px-5 py-2 rounded-md bg-black text-white text-sm font-semibold border border-black">
                      Cash
                    </button>
                    <button className="px-5 py-2 rounded-md bg-white text-[#334257] text-sm border border-[#d1d7e6] hover:bg-gray-50">
                      Card
                    </button>
                    <button className="px-5 py-2 rounded-md bg-white text-[#334257] text-sm border border-[#d1d7e6] hover:bg-gray-50">
                      Wallet
                    </button>
                  </div>
                </div>
              </div>

              {/* Fixed footer buttons */}
              <div className="pt-4 mt-4 border-t border-[#e3e6ef] bg-[#f9fafc]">
                <div className="grid grid-cols-2 gap-4">
                  <button className="h-11 rounded-md bg-[#006fbd] text-white text-sm font-semibold shadow-sm hover:bg-[#00589a]">
                    Place Order
                  </button>
                  <button className="h-11 rounded-md bg-[#f4f5f7] text-[#334257] text-sm font-semibold border border-[#e3e6ef] hover:bg-[#e6e7eb]">
                    Clear Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}


