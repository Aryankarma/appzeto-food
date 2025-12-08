import { useState, useMemo, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { 
  ArrowLeft,
  ChevronDown,
  Calendar
} from "lucide-react"
import { formatCurrency } from "../../restaurant/utils/currency"
import { DateRangeCalendar } from "@/components/ui/date-range-calendar"

export default function DeductionStatement() {
  const navigate = useNavigate()
  
  // Date range state
  const [startDate, setStartDate] = useState(() => {
    const today = new Date()
    const weekAgo = new Date(today)
    weekAgo.setDate(today.getDate() - 7)
    return weekAgo
  })
  const [endDate, setEndDate] = useState(new Date())
  const [showCalendar, setShowCalendar] = useState(false)
  const calendarRef = useRef(null)
  
  // Format date range display
  const dateRangeDisplay = useMemo(() => {
    if (!startDate || !endDate) return "Select date range"
    const formatDate = (date) => {
      const day = date.getDate()
      const month = date.toLocaleString('en-US', { month: 'short' })
      return `${day} ${month}`
    }
    return `${formatDate(startDate)} - ${formatDate(endDate)}`
  }, [startDate, endDate])
  
  // Handle date range change from calendar
  const handleDateRangeChange = (start, end) => {
    setStartDate(start)
    setEndDate(end)
    // Here you would fetch deduction data for the selected date range
    // fetchDeductionData(start, end)
  }
  
  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false)
      }
    }
    
    if (showCalendar) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showCalendar])
  
  // Fetch deduction data based on selected date range (mock function - replace with actual API call)
  const getDeductionDataForDateRange = (start, end) => {
    // This would be an API call in a real application
    // For now, return empty array
    return []
  }
  
  // Get deduction data for current selected date range
  const deductions = useMemo(() => {
    if (!startDate || !endDate) return []
    return getDeductionDataForDateRange(startDate, endDate)
  }, [startDate, endDate])
  
  return (
    <div className="min-h-screen bg-[#f6e9dc] overflow-x-hidden pb-24 md:pb-6">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 md:py-6 flex items-center gap-4 rounded-b-3xl md:rounded-b-none">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Deduction statement</h1>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6">
        {/* Date Range Selector with Calendar */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-md border border-gray-100">
          <div className="flex justify-center relative" ref={calendarRef}>
            <button
              onClick={() => setShowCalendar(!showCalendar)}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full transition-colors"
            >
              <Calendar className="w-4 h-4 text-gray-600" />
              <span className="text-gray-900 text-sm font-medium">{dateRangeDisplay}</span>
              <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${showCalendar ? 'rotate-180' : ''}`} />
            </button>
            
            {/* Calendar Popup */}
            {showCalendar && (
              <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 z-50 md:left-auto md:transform-none md:right-0">
                <DateRangeCalendar
                  startDate={startDate}
                  endDate={endDate}
                  onDateRangeChange={handleDateRangeChange}
                  onClose={() => setShowCalendar(false)}
                />
              </div>
            )}
          </div>
        </div>

        {/* Transactions List */}
        {deductions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            {/* Empty State Illustration */}
            <div className="flex flex-col gap-2 mb-6">
              <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200 w-64">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded mt-1"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200 w-64">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded mt-1"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200 w-64">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded mt-1"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-gray-600 text-base font-medium">No transactions</p>
          </div>
        ) : (
          <div className="space-y-3">
            {deductions.map((deduction, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-4 shadow-md border border-gray-100"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded ${
                      index % 3 === 0 ? 'bg-green-500' : 
                      index % 3 === 1 ? 'bg-orange-500' : 'bg-blue-500'
                    }`}></div>
                    <div>
                      <p className="text-gray-900 text-sm font-medium">{deduction.description}</p>
                      <p className="text-gray-500 text-xs">{deduction.date}</p>
                    </div>
                  </div>
                  <div className="text-orange-500 text-sm font-medium">
                    -{formatCurrency(Math.abs(deduction.amount))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

