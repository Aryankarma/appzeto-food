import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Share2, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react"
import { formatCurrency } from "../../restaurant/utils/currency"
import { useProgressStore } from "../store/progressStore"

export default function Earnings() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("day")
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showWeekPicker, setShowWeekPicker] = useState(false)
  const [showMonthPicker, setShowMonthPicker] = useState(false)

  // Generate dummy data based on selected date
  const generateDummyData = (date, period) => {
    // Generate random but consistent data based on date
    const dateStr = date.toISOString().split('T')[0]
    const seed = dateStr.split('-').join('')
    const seedNum = parseInt(seed) % 10000

    // Different multipliers for different periods
    const multiplier = period === 'day' ? 1 : period === 'week' ? 7 : 30
    
    const orders = (seedNum % 20) * multiplier
    const hours = Math.floor((seedNum % 8) * multiplier / 2)
    const minutes = ((seedNum % 60) * multiplier) % 60
    
    const orderEarning = (seedNum % 500 + 100) * multiplier
    const incentive = (seedNum % 200 + 50) * multiplier
    const otherEarnings = (seedNum % 100 + 20) * multiplier
    const totalEarnings = orderEarning + incentive + otherEarnings

    return {
      totalEarnings,
      orders,
      hours,
      minutes,
      orderEarning,
      incentive,
      otherEarnings
    }
  }

  const [earningsData, setEarningsData] = useState(() => 
    generateDummyData(selectedDate, activeTab)
  )

  const { updateTodayEarnings } = useProgressStore()

  useEffect(() => {
    const data = generateDummyData(selectedDate, activeTab)
    setEarningsData(data)
    
    // Update store if viewing today's data
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const selectedDateNormalized = new Date(selectedDate)
    selectedDateNormalized.setHours(0, 0, 0, 0)
    
    if (activeTab === "day" && selectedDateNormalized.getTime() === today.getTime()) {
      updateTodayEarnings(data.totalEarnings)
    }
  }, [selectedDate, activeTab, updateTodayEarnings])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowDatePicker(false)
      setShowWeekPicker(false)
      setShowMonthPicker(false)
    }
    if (showDatePicker || showWeekPicker || showMonthPicker) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [showDatePicker, showWeekPicker, showMonthPicker])

  // Format date for display
  const formatDateDisplay = (date) => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    } else {
      const options = { day: 'numeric', month: 'long' }
      return date.toLocaleDateString('en-US', options)
    }
  }

  // Format date with day name
  const formatDateWithDay = (date) => {
    const options = { weekday: 'short', day: 'numeric', month: 'long' }
    return date.toLocaleDateString('en-US', options)
  }

  // Get week range
  const getWeekRange = (date) => {
    const startOfWeek = new Date(date)
    const day = startOfWeek.getDay()
    const diff = startOfWeek.getDate() - day
    startOfWeek.setDate(diff)
    
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)
    
    return { start: startOfWeek, end: endOfWeek }
  }

  // Format month
  const formatMonth = (date) => {
    const options = { month: 'long', year: 'numeric' }
    return date.toLocaleDateString('en-US', options)
  }

  // Generate recent weeks list
  const generateRecentWeeks = () => {
    const weeks = []
    const today = new Date()
    for (let i = 0; i < 12; i++) {
      const weekStart = new Date(today)
      weekStart.setDate(today.getDate() - (today.getDay() + i * 7))
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 6)
      weeks.push({ start: weekStart, end: weekEnd })
    }
    return weeks
  }

  // Generate recent months list
  const generateRecentMonths = () => {
    const months = []
    const today = new Date()
    for (let i = 0; i < 12; i++) {
      const month = new Date(today.getFullYear(), today.getMonth() - i, 1)
      months.push(month)
    }
    return months
  }

  const recentWeeks = generateRecentWeeks()
  const recentMonths = generateRecentMonths()

  // Navigate dates
  const navigateDate = (direction) => {
    const newDate = new Date(selectedDate)
    if (activeTab === "day") {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1))
    } else if (activeTab === "week") {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7))
    } else if (activeTab === "month") {
      newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1))
    }
    setSelectedDate(newDate)
  }

  // Format time
  const formatTime = (hours, minutes) => {
    const h = String(hours).padStart(2, '0')
    const m = String(minutes).padStart(2, '0')
    return `${h}:${m} hrs`
  }

  // Handle share
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Earnings',
        text: `My earnings for ${formatDateDisplay(selectedDate)}: ${formatCurrency(earningsData.totalEarnings)}`
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`My earnings: ${formatCurrency(earningsData.totalEarnings)}`)
      alert('Earnings copied to clipboard!')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-black text-white px-4 py-4 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-800 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold">Earnings</h1>
        <button
          onClick={handleShare}
          className="p-2 hover:bg-gray-800 rounded-full transition-colors flex items-center gap-1"
        >
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-black px-4 py-3 flex gap-2">
        <button
          onClick={() => {
            setActiveTab("day")
            setShowDatePicker(false)
            setShowWeekPicker(false)
            setShowMonthPicker(false)
          }}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
            activeTab === "day"
              ? "bg-white text-black"
              : "bg-transparent text-white"
          }`}
        >
          Day
        </button>
        <button
          onClick={() => {
            setActiveTab("week")
            setShowDatePicker(false)
            setShowWeekPicker(false)
            setShowMonthPicker(false)
          }}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
            activeTab === "week"
              ? "bg-white text-black"
              : "bg-transparent text-white"
          }`}
        >
          Week
        </button>
        <button
          onClick={() => {
            setActiveTab("month")
            setShowDatePicker(false)
            setShowWeekPicker(false)
            setShowMonthPicker(false)
          }}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
            activeTab === "month"
              ? "bg-white text-black"
              : "bg-transparent text-white"
          }`}
        >
          Month
        </button>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6">
        {/* Earnings Card */}
        <div className="bg-white rounded-lg shadow-sm mb-4">
          {/* Date Selector and Navigation */}
          <div className="px-4 pt-4 pb-3 flex items-center justify-between">
            <button
              onClick={() => navigateDate("prev")}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation()
                if (activeTab === "day") setShowDatePicker(!showDatePicker)
                else if (activeTab === "week") setShowWeekPicker(!showWeekPicker)
                else if (activeTab === "month") setShowMonthPicker(!showMonthPicker)
              }}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <span className="text-sm font-medium text-gray-900">
                {activeTab === "day" 
                  ? `${formatDateDisplay(selectedDate)}: ${selectedDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long' })}`
                  : activeTab === "week"
                  ? `${getWeekRange(selectedDate).start.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })} - ${getWeekRange(selectedDate).end.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}`
                  : formatMonth(selectedDate)
                }
              </span>
              <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${(showDatePicker || showWeekPicker || showMonthPicker) ? 'rotate-180' : ''}`} />
            </button>
            
            <button
              onClick={() => navigateDate("next")}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Date/Week/Month Picker Dropdown */}
          {(showDatePicker || showWeekPicker || showMonthPicker) && (
            <div className="px-4 pb-4 max-h-60 overflow-y-auto">
              {showDatePicker && (
                <div className="space-y-2">
                  {Array.from({ length: 30 }, (_, i) => {
                    const date = new Date()
                    date.setDate(date.getDate() - i)
                    return (
                      <button
                        key={i}
                        onClick={() => {
                          setSelectedDate(date)
                          setShowDatePicker(false)
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors ${
                          date.toDateString() === selectedDate.toDateString() ? 'bg-gray-100 font-medium' : ''
                        }`}
                      >
                        {formatDateWithDay(date)}
                      </button>
                    )
                  })}
                </div>
              )}
              
              {showWeekPicker && (
                <div className="space-y-2">
                  {recentWeeks.map((week, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedDate(week.start)
                        setShowWeekPicker(false)
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors ${
                        week.start.toDateString() === getWeekRange(selectedDate).start.toDateString() ? 'bg-gray-100 font-medium' : ''
                      }`}
                    >
                      {week.start.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })} - {week.end.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                    </button>
                  ))}
                </div>
              )}
              
              {showMonthPicker && (
                <div className="space-y-2">
                  {recentMonths.map((month, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedDate(month)
                        setShowMonthPicker(false)
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors ${
                        month.getMonth() === selectedDate.getMonth() && month.getFullYear() === selectedDate.getFullYear() ? 'bg-gray-100 font-medium' : ''
                      }`}
                    >
                      {formatMonth(month)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Total Earnings */}
          <div className="px-4 pb-4 text-center">
            <p className="text-5xl font-bold text-gray-900">
              {earningsData.totalEarnings === 0 ? '₹0' : `₹${Math.round(earningsData.totalEarnings)}`}
            </p>
          </div>

          {/* Statistics */}
          <div className="px-4 pb-4 border-t border-gray-200 pt-4 flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold text-gray-900">{earningsData.orders} Orders</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-gray-900">
                {formatTime(earningsData.hours, earningsData.minutes)}
              </p>
              <p className="text-sm text-gray-600">Time on order</p>
            </div>
          </div>
        </div>

          {/* Earnings Breakdown */}
        <div className="space-y-3">
          <div className="bg-white rounded-lg shadow-sm px-4 py-4 flex items-center justify-between">
            <span className="text-base text-gray-900">Order earning</span>
            <span className="text-base font-semibold text-gray-900">
              {earningsData.orderEarning === 0 ? '₹0' : `₹${Math.round(earningsData.orderEarning)}`}
            </span>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm px-4 py-4 flex items-center justify-between">
            <span className="text-base text-gray-900">Incentive</span>
            <span className="text-base font-semibold text-gray-900">
              {earningsData.incentive === 0 ? '₹0' : `₹${Math.round(earningsData.incentive)}`}
            </span>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm px-4 py-4 flex items-center justify-between">
            <span className="text-base text-gray-900">Other earnings</span>
            <span className="text-base font-semibold text-gray-900">
              {earningsData.otherEarnings === 0 ? '₹0' : `₹${Math.round(earningsData.otherEarnings)}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

