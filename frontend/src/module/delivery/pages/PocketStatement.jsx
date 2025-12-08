import { useState, useMemo, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { 
  ArrowLeft,
  ChevronDown,
  Calendar,
  Filter
} from "lucide-react"
import { formatCurrency } from "../../restaurant/utils/currency"
import { DateRangeCalendar } from "@/components/ui/date-range-calendar"

export default function PocketStatement() {
  const navigate = useNavigate()
  
  // Filter state: 'thisWeek', 'lastWeek', 'select'
  const [activeFilter, setActiveFilter] = useState('thisWeek')
  const [showFiltersDropdown, setShowFiltersDropdown] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const filtersRef = useRef(null)
  const calendarRef = useRef(null)
  
  // Date range state
  const [startDate, setStartDate] = useState(() => {
    const today = new Date()
    const weekAgo = new Date(today)
    weekAgo.setDate(today.getDate() - 7)
    return weekAgo
  })
  const [endDate, setEndDate] = useState(new Date())
  
  // Get week start (Monday) and end (Sunday) for a given date
  const getWeekRange = (date) => {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1) // Adjust to Monday
    const monday = new Date(d.setDate(diff))
    const sunday = new Date(monday)
    sunday.setDate(monday.getDate() + 6)
    
    const formatDate = (date) => {
      const day = date.getDate()
      const month = date.toLocaleString('en-US', { month: 'short' })
      return `${day} ${month}`
    }
    
    return {
      start: monday,
      end: sunday,
      formatted: `${formatDate(monday)} - ${formatDate(sunday)}`
    }
  }
  
  // Calculate current date range based on filter
  const currentDateRange = useMemo(() => {
    if (activeFilter === 'thisWeek') {
      return getWeekRange(new Date())
    } else if (activeFilter === 'lastWeek') {
      const lastWeekDate = new Date()
      lastWeekDate.setDate(lastWeekDate.getDate() - 7)
      return getWeekRange(lastWeekDate)
    } else {
      // Use selected dates
      if (startDate && endDate) {
        const formatDate = (date) => {
          const day = date.getDate()
          const month = date.toLocaleString('en-US', { month: 'short' })
          return `${day} ${month}`
        }
        return {
          start: startDate,
          end: endDate,
          formatted: `${formatDate(startDate)} - ${formatDate(endDate)}`
        }
      }
      return getWeekRange(new Date())
    }
  }, [activeFilter, startDate, endDate])
  
  // Handle filter selection
  const handleFilterSelect = (filter) => {
    setActiveFilter(filter)
    setShowFiltersDropdown(false)
    
    if (filter === 'thisWeek') {
      const today = new Date()
      const weekRange = getWeekRange(today)
      setStartDate(weekRange.start)
      setEndDate(weekRange.end)
    } else if (filter === 'lastWeek') {
      const lastWeekDate = new Date()
      lastWeekDate.setDate(lastWeekDate.getDate() - 7)
      const weekRange = getWeekRange(lastWeekDate)
      setStartDate(weekRange.start)
      setEndDate(weekRange.end)
    }
  }
  
  // Handle date range change from calendar
  const handleDateRangeChange = (start, end) => {
    setStartDate(start)
    setEndDate(end)
    setActiveFilter('select')
    // Here you would fetch pocket statement data for the selected date range
    // fetchPocketStatementData(start, end)
  }
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filtersRef.current && !filtersRef.current.contains(event.target)) {
        setShowFiltersDropdown(false)
      }
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false)
      }
    }
    
    if (showFiltersDropdown || showCalendar) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showFiltersDropdown, showCalendar])
  
  // Initialize dates based on active filter
  useEffect(() => {
    if (activeFilter === 'thisWeek') {
      const today = new Date()
      const weekRange = getWeekRange(today)
      setStartDate(weekRange.start)
      setEndDate(weekRange.end)
    } else if (activeFilter === 'lastWeek') {
      const lastWeekDate = new Date()
      lastWeekDate.setDate(lastWeekDate.getDate() - 7)
      const weekRange = getWeekRange(lastWeekDate)
      setStartDate(weekRange.start)
      setEndDate(weekRange.end)
    }
  }, [activeFilter])
  
  // Fetch pocket statement data based on selected date range (mock function - replace with actual API call)
  const getPocketStatementDataForDateRange = (start, end) => {
    // This would be an API call in a real application
    // Sample data matching the image
    return [
      {
        id: 1,
        description: "Extra cash adjusted from payout",
        timestamp: new Date(start.getFullYear(), start.getMonth(), start.getDate(), 6, 23),
        amount: 1632.81,
        type: "credit"
      }
    ]
  }
  
  // Get pocket statement data for current selected date range
  const transactions = useMemo(() => {
    if (!startDate || !endDate) return []
    return getPocketStatementDataForDateRange(startDate, endDate)
  }, [startDate, endDate])
  
  // Format timestamp
  const formatTimestamp = (date) => {
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const ampm = hours >= 12 ? 'PM' : 'AM'
    const displayHours = hours % 12 || 12
    const displayMinutes = minutes.toString().padStart(2, '0')
    const day = date.getDate()
    const month = date.toLocaleString('en-US', { month: 'short' })
    return `${displayHours}:${displayMinutes} ${ampm} • ${day} ${month}`
  }
  
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
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Pocket statement</h1>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6">
        {/* Filters Bar */}
        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
          {/* Filters Button */}
          <div className="relative shrink-0" ref={filtersRef}>
            <button
              onClick={() => setShowFiltersDropdown(!showFiltersDropdown)}
              className="flex items-center gap-2 bg-white hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors text-gray-700 text-sm font-medium shadow-sm border border-gray-200"
            >
              <Filter className="w-4 h-4" />
              Filters
              <ChevronDown className={`w-4 h-4 transition-transform ${showFiltersDropdown ? 'rotate-180' : ''}`} />
            </button>
            
            {/* Filters Dropdown */}
            {showFiltersDropdown && (
              <div className="absolute top-full mt-2 left-0 bg-white rounded-lg shadow-lg border border-gray-200 z-50 min-w-[150px]">
                <button
                  onClick={() => {
                    // Could add filter options here
                    setShowFiltersDropdown(false)
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-900 text-sm transition-colors"
                >
                  All transactions
                </button>
                <button
                  onClick={() => {
                    setShowFiltersDropdown(false)
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-900 text-sm transition-colors"
                >
                  Credits only
                </button>
                <button
                  onClick={() => {
                    setShowFiltersDropdown(false)
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-900 text-sm transition-colors"
                >
                  Debits only
                </button>
              </div>
            )}
          </div>
          
          {/* This Week Button */}
          <button
            onClick={() => handleFilterSelect('thisWeek')}
            className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeFilter === 'thisWeek'
                ? 'bg-green-500 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm border border-gray-200'
            }`}
          >
            This week
          </button>
          
          {/* Last Week Button */}
          <button
            onClick={() => handleFilterSelect('lastWeek')}
            className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeFilter === 'lastWeek'
                ? 'bg-green-500 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm border border-gray-200'
            }`}
          >
            Last week
          </button>
          
          {/* Select Button */}
          <div className="relative shrink-0" ref={calendarRef}>
            <button
              onClick={() => {
                setShowCalendar(!showCalendar)
                if (!showCalendar) {
                  setActiveFilter('select')
                }
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === 'select'
                  ? 'bg-green-500 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm border border-gray-200'
              }`}
            >
              Select
            </button>
            
            {/* Calendar Popup */}
            {showCalendar && (
              <div className="absolute top-full mt-2 right-0 z-50">
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

        {/* Date Range Display */}
        <div className="text-center mb-6">
          <p className="text-gray-900 text-base font-medium">{currentDateRange.formatted}</p>
        </div>

        {/* Transactions List */}
        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-600 text-base font-medium">No transactions</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="bg-white rounded-xl p-4 shadow-md border border-gray-100"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-gray-900 text-sm font-medium mb-1">
                      {transaction.description}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {formatTimestamp(transaction.timestamp)}
                    </p>
                  </div>
                  <div className={`text-sm font-semibold ml-4 ${
                    transaction.type === 'credit' ? 'text-green-600' : 'text-red-500'
                  }`}>
                    {transaction.type === 'credit' ? '+' : '-'}
                    {formatCurrency(Math.abs(transaction.amount))}
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

