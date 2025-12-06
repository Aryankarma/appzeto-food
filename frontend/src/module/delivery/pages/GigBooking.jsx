import { useState, useEffect, useRef } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { gsap } from "gsap"
import Lenis from "lenis"
import { 
  X,
  Calendar,
  Clock,
  CheckCircle,
  Circle,
  MapPin,
  AlertCircle,
  Sparkles,
  Home,
  FileText,
  UtensilsCrossed,
  User,
  Building2,
  Sun,
  Sunrise,
  Moon,
  Star,
  XCircle
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useGigStore, USER_LEVELS } from "../store/gigStore"
import {
  generateAvailableDates,
  generateTimeSlots,
  formatTimeDisplay,
  calculateTotalHours,
  getTimeRangeString,
  getLevelBadgeColor,
  getLevelIcon,
  isSlotInPast,
  getGigStatusColor,
  sortGigsByDate,
  categorizeSlotsByMeal,
  generatePayRate,
  getCategoryTimeRange
} from "../utils/gigUtils"
import { toast } from "sonner"

export default function GigBooking() {
  const navigate = useNavigate()
  const location = useLocation()
  const [animationKey, setAnimationKey] = useState(0)
  const [activeTab, setActiveTab] = useState("book") // "book" or "history"
  const [selectedDate, setSelectedDate] = useState(null)
  const [dateChangeKey, setDateChangeKey] = useState(0)
  const summaryRef = useRef(null)
  const slotsRef = useRef(null)
  
  // Track date changes to reset animations
  const handleDateChange = (date) => {
    setSelectedDate(date)
    setDateChangeKey(prev => prev + 1) // Reset animations
  }
  
  const {
    selectedSlots,
    bookedGigs,
    userLevel,
    isOnline,
    toggleSlot,
    clearSelectedSlots,
    bookGig,
    goOnline,
    goOffline,
    isSlotBooked,
    getBookedSlotsForDate,
    getAdvanceDays
  } = useGigStore()

  // Generate available dates
  const availableDates = generateAvailableDates(userLevel)
  
  // Set first date as selected by default
  useEffect(() => {
    if (!selectedDate && availableDates.length > 0) {
      setSelectedDate(availableDates[0].date)
    }
  }, [availableDates])

  // Generate slots for selected date
  const timeSlots = selectedDate ? generateTimeSlots(selectedDate) : []
  const bookedSlotsForDate = selectedDate ? getBookedSlotsForDate(selectedDate) : []

  // Filter out past slots and add pay rates
  const availableSlots = timeSlots
    .filter(slot => !isSlotInPast(slot))
    .map(slot => {
      const booked = isSlotBooked(slot)
      return {
        ...slot,
        payRate: generatePayRate(slot),
        isBooked: booked
      }
    })

  // Categorize slots by meal time
  const categorizedSlots = categorizeSlotsByMeal(availableSlots)

  // Calculate summary
  const totalHours = calculateTotalHours(selectedSlots)
  const timeRange = getTimeRangeString(selectedSlots)
  const canBook = selectedSlots.length > 0

  // Sorted gig history
  const sortedGigs = sortGigsByDate(bookedGigs)

  // Initialize Lenis
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [location.pathname, animationKey])

  // Handle slot selection with smooth scroll
  const handleSlotToggle = (slot) => {
    // Check if slot is already booked
    if (isSlotBooked(slot)) {
      toast.error("This slot is already booked")
      return
    }

    // Check if slot is in the past
    if (isSlotInPast(slot)) {
      toast.error("Cannot book past time slots")
      return
    }

    const wasEmpty = selectedSlots.length === 0
    toggleSlot(slot)
    
    // Smooth scroll to summary after a short delay if this is the first selection
    if (wasEmpty && summaryRef.current) {
      setTimeout(() => {
        summaryRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        })
      }, 300)
    }
  }

  // Handle book gig
  const handleBookGig = () => {
    if (selectedSlots.length === 0) {
      toast.error("Please select at least one time slot")
      return
    }

    // Validate consecutive slots
    const dates = [...new Set(selectedSlots.map(s => s.date))]
    let isValid = true

    dates.forEach(date => {
      const dateSlots = selectedSlots
        .filter(s => s.date === date)
        .sort((a, b) => a.startTime.localeCompare(b.startTime))

      for (let i = 1; i < dateSlots.length; i++) {
        if (dateSlots[i].startTime !== dateSlots[i - 1].endTime) {
          isValid = false
          break
        }
      }
    })

    if (!isValid) {
      toast.error("Please select consecutive time slots")
      return
    }

    const success = bookGig()
    if (success) {
      // Automatically go online when gig is booked
      const onlineSuccess = goOnline()
      if (onlineSuccess) {
        toast.success("Gig booked successfully! You are now online.")
      } else {
        toast.success("Gig booked successfully!")
      }
      clearSelectedSlots()
      setActiveTab("history")
    } else {
      toast.error("Failed to book gig")
    }
  }

  // Handle go online
  const handleGoOnline = () => {
    if (bookedGigs.length === 0) {
      toast.error("Please book a gig first")
      return
    }

    // Find next available gig
    const now = new Date()
    const upcomingGig = bookedGigs
      .filter(gig => {
        const gigDate = new Date(gig.date)
        gigDate.setHours(0, 0, 0, 0)
        return gigDate >= now && gig.status === 'booked'
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date))[0]

    if (!upcomingGig) {
      toast.error("No upcoming gig found")
      return
    }

    const success = goOnline()
    if (success) {
      toast.success("You are now online!")
      navigate("/delivery")
    }
  }

  // Handle go offline
  const handleGoOffline = () => {
    goOffline()
    toast.success("You are now offline")
  }

  // Check if slot is selected
  const isSlotSelected = (slot) => {
    return selectedSlots.some(s => 
      s.date === slot.date && 
      s.startTime === slot.startTime && 
      s.endTime === slot.endTime
    )
  }

  // Get level info
  const levelInfo = USER_LEVELS[userLevel] || USER_LEVELS.Brown
  const levelColor = getLevelBadgeColor(userLevel)
  const levelIcon = getLevelIcon(userLevel)

  return (
    <div className="min-h-screen bg-[#f6e9dc] overflow-x-hidden">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 md:py-3 flex items-center justify-between rounded-b-3xl md:rounded-b-none sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/delivery")}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center gap-2">
            <div className="bg-[#ff8100] rounded-lg p-1.5 md:p-1.5">
              <Calendar className="w-5 h-5 md:w-4 md:h-4 text-white" />
            </div>
            <span className="text-[#ff8100] font-bold text-xl md:text-lg">Book Gig</span>
          </div>
        </div>
        {/* User Level Badge */}
        <div 
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold"
          style={{ 
            backgroundColor: `${levelColor}20`,
            color: levelColor
          }}
        >
          <span>{levelIcon}</span>
          <span>{userLevel}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 pb-24 md:pb-6">
        {/* Tabs - Inspired by Orders Page */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setActiveTab("book")}
            className={`relative flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
              activeTab === "book"
                ? "text-white"
                : "bg-white text-gray-900 hover:bg-orange-50"
            }`}
          >
            {activeTab === "book" && (
              <motion.div
                layoutId="activeGigTab"
                className="absolute inset-0 bg-[#ff8100] rounded-lg z-0"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
            <span className="relative z-10">Book Gig</span>
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`relative flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
              activeTab === "history"
                ? "text-white"
                : "bg-white text-gray-900 hover:bg-orange-50"
            }`}
          >
            {activeTab === "history" && (
              <motion.div
                layoutId="activeGigTab"
                className="absolute inset-0 bg-[#ff8100] rounded-lg z-0"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
            <span className="relative z-10">History</span>
          </button>
        </div>

        {/* Book Tab */}
        <AnimatePresence mode="wait">
          {activeTab === "book" && (
            <motion.div
              key="book"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Date Picker - Improved UI */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">Select Date</h3>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {availableDates.map((dateObj, index) => {
                    const isSelected = selectedDate === dateObj.date
                    return (
                      <motion.button
                        key={dateObj.date}
                        onClick={() => handleDateChange(dateObj.date)}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05, duration: 0.2 }}
                        className={`relative shrink-0 px-4 py-3 rounded-lg font-medium transition-all ${
                          isSelected
                            ? "text-white shadow-lg"
                            : "bg-white text-gray-700 hover:bg-gray-50 shadow-sm"
                        }`}
                        whileTap={{ scale: 0.95 }}
                      >
                        {isSelected && (
                          <motion.div
                            layoutId="selectedDate"
                            className="absolute inset-0 bg-[#ff8100] rounded-lg z-0"
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        )}
                        <div className="text-center relative z-10">
                          <div className={`text-xs mb-1 ${isSelected ? "opacity-90" : "opacity-70"}`}>
                            {dateObj.isToday ? "Today" : dateObj.isTomorrow ? "Tomorrow" : dateObj.displayDate.split(" - ")[0]}
                          </div>
                          <div className="text-sm font-bold">
                            {dateObj.isToday || dateObj.isTomorrow 
                              ? dateObj.displayDate 
                              : dateObj.displayDate.split(" - ")[1]}
                          </div>
                        </div>
                      </motion.button>
                    )
                  })}
                </div>
              </div>

              {/* Time Slots - Redesigned with Meal Categories */}
              {selectedDate && (
                <motion.div
                  key={`${selectedDate}-${dateChangeKey}`} // Key resets animations on date change
                  ref={slotsRef}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.15 }}
                >
                  {categorizedSlots.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-8"
                    >
                      <p className="text-gray-500">No available slots for this date</p>
                    </motion.div>
                  ) : (
                    <div className="space-y-4">
                      <AnimatePresence>
                        {categorizedSlots.map((category, catIndex) => {
                          const categoryTimeRange = getCategoryTimeRange(category)
                          const gigCount = category.slots.length
                          
                          // Get icon based on category
                          const getCategoryIcon = () => {
                            if (category.name.includes('Breakfast')) return <Sunrise className="w-5 h-5 text-yellow-400" />
                            if (category.name.includes('Lunch')) return <Sun className="w-5 h-5 text-yellow-400" />
                            return <Moon className="w-5 h-5 text-yellow-400" />
                          }

                          return (
                            <motion.div
                              key={`${category.name}-${dateChangeKey}`}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ 
                                delay: catIndex * 0.05, // Minimal delay
                                duration: 0.2,
                                type: "spring",
                                stiffness: 300
                              }}
                              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200"
                            >
                              {/* Category Header */}
                              <div className="bg-gray-900 p-4 flex items-center justify-between">
                                <div className="flex-1">
                                  <h4 className="text-white font-bold text-base mb-1">{category.name}</h4>
                                  <p className="text-white/80 text-xs">
                                    {categoryTimeRange} • {gigCount} Gig{gigCount > 1 ? 's' : ''}
                                  </p>
                                </div>
                                <div className="bg-gray-800 rounded-full p-2.5">
                                  {getCategoryIcon()}
                                </div>
                              </div>

                              {/* Gig Slots */}
                              <div className="p-2 space-y-2">
                                <AnimatePresence>
                                  {category.slots.map((slot, slotIndex) => {
                                    const isSelected = isSlotSelected(slot)
                                    const isBooked = slot.isBooked

                                    return (
                                      <motion.button
                                        key={`${slot.id}-${dateChangeKey}`}
                                        initial={{ opacity: 0, x: -5 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 5 }}
                                        transition={{ 
                                          delay: catIndex * 0.05 + slotIndex * 0.02, // Very minimal delay
                                          duration: 0.15, // Very fast animation
                                          type: "spring",
                                          stiffness: 400
                                        }}
                                        onClick={() => !isBooked && handleSlotToggle(slot)}
                                        disabled={isBooked}
                                        className={`w-full rounded-lg p-4 shadow-sm border transition-all ${
                                          isBooked
                                            ? "opacity-60 cursor-not-allowed border-gray-200 bg-gray-50"
                                            : isSelected
                                            ? "border-[#10b981] bg-[#10b981] shadow-md"
                                            : "border-gray-200 bg-white hover:border-[#ff8100] hover:shadow-md"
                                        }`}
                                        whileHover={!isBooked ? { scale: 1.01, y: -1 } : {}}
                                        whileTap={!isBooked ? { scale: 0.99 } : {}}
                                      >
                                        <div className="flex items-start justify-between">
                                          <div className="flex-1">
                                            <div className={`font-bold text-base mb-1 ${
                                              isSelected 
                                                ? "text-white" 
                                                : isBooked 
                                                  ? "text-gray-400" 
                                                  : "text-gray-900"
                                            }`}>
                                              {formatTimeDisplay(slot.startTime)} - {formatTimeDisplay(slot.endTime)}
                                            </div>
                                            <div className={`text-sm mb-2 ${
                                              isSelected 
                                                ? "text-white/90" 
                                                : isBooked 
                                                  ? "text-gray-400" 
                                                  : "text-gray-600"
                                            }`}>
                                              ₹{slot.payRate.min} - ₹{slot.payRate.max} per hour
                                            </div>
                                            {isBooked && (
                                              <div className="text-blue-600 text-sm font-medium">Booked</div>
                                            )}
                                            {isSelected && !isBooked && (
                                              <div className="text-white text-sm font-medium">Selected</div>
                                            )}
                                          </div>
                                          <div className="flex items-center gap-2">
                                            {isSelected && !isBooked && (
                                              <motion.div
                                                initial={{ scale: 0, rotate: -180 }}
                                                animate={{ scale: 1, rotate: 0 }}
                                                transition={{ type: "spring", stiffness: 300 }}
                                              >
                                                <Star className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                                              </motion.div>
                                            )}
                                            {!isBooked && !isSelected && (
                                              <Circle className="w-5 h-5 text-gray-400" />
                                            )}
                                            {isBooked && (
                                              <XCircle className="w-5 h-5 text-gray-400" />
                                            )}
                                          </div>
                                        </div>
                                      </motion.button>
                                    )
                                  })}
                                </AnimatePresence>
                              </div>
                            </motion.div>
                          )
                        })}
                      </AnimatePresence>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Summary - Enhanced Card */}
              <AnimatePresence>
                {selectedSlots.length > 0 && (
                  <motion.div
                    ref={summaryRef}
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ 
                      type: "spring",
                      stiffness: 300,
                      damping: 25
                    }}
                    className="bg-white rounded-xl p-5 border-2 border-[#ff8100] shadow-lg"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <div className="bg-[#ff8100] rounded-full p-2">
                        <Calendar className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-800">Booking Summary</h3>
                    </div>
                    <div className="space-y-3 text-sm">
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex justify-between items-center py-2 border-b border-gray-100"
                      >
                        <span className="text-gray-600 flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Total Hours:
                        </span>
                        <span className="font-bold text-gray-900 text-base">{totalHours} hours</span>
                      </motion.div>
                      {timeRange && (
                        <motion.div 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.15 }}
                          className="flex justify-between items-center py-2 border-b border-gray-100"
                        >
                          <span className="text-gray-600">Time Range:</span>
                          <span className="font-semibold text-gray-900">{timeRange}</span>
                        </motion.div>
                      )}
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex justify-between items-center py-2"
                      >
                        <span className="text-gray-600">Slots Selected:</span>
                        <span className="font-semibold text-[#ff8100] text-base">{selectedSlots.length} slot{selectedSlots.length > 1 ? 's' : ''}</span>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Book Button - Enhanced */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <motion.button
                  onClick={handleBookGig}
                  disabled={!canBook}
                  whileHover={canBook ? { scale: 1.02, y: -2 } : {}}
                  whileTap={canBook ? { scale: 0.98 } : {}}
                  className={`w-full py-6 text-lg font-semibold rounded-lg shadow-lg transition-all ${
                    canBook
                      ? "bg-[#ff8100] hover:bg-[#e67300] text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Book Gig
                </motion.button>
              </motion.div>

              {/* Go Online Button */}
              <AnimatePresence>
                {!isOnline && bookedGigs.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: 0.35 }}
                  >
                    <motion.button
                      onClick={handleGoOnline}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-6 text-lg font-semibold rounded-lg bg-green-600 hover:bg-green-700 text-white shadow-lg transition-all"
                    >
                      Go Online
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Go Offline Button */}
              <AnimatePresence>
                {isOnline && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: 0.35 }}
                  >
                    <motion.button
                      onClick={handleGoOffline}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-6 text-lg font-semibold rounded-lg bg-red-600 hover:bg-red-700 text-white shadow-lg transition-all"
                    >
                      Go Offline
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* History Tab - Enhanced with animations */}
        <AnimatePresence mode="wait">
          {activeTab === "history" && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {sortedGigs.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-white shadow-md">
                    <CardContent className="p-8 text-center">
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                      >
                        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      </motion.div>
                      <p className="text-gray-600 font-medium">No gigs booked yet</p>
                      <p className="text-sm text-gray-500 mt-2">Book your first gig to get started</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                sortedGigs.map((gig, index) => (
                  <motion.div
                    key={gig.id}
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ 
                      delay: index * 0.1,
                      duration: 0.3,
                      type: "spring",
                      stiffness: 100
                    }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="cursor-pointer"
                  >
                    <Card className="bg-white shadow-md hover:shadow-lg transition-shadow border-0">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="bg-[#ff8100]/10 rounded-lg p-1.5">
                                <Calendar className="w-4 h-4 text-[#ff8100]" />
                              </div>
                              <span className="font-bold text-gray-900 text-base">
                                {new Date(gig.date).toLocaleDateString('en-US', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 ml-7">
                              <Clock className="w-4 h-4" />
                              <span className="font-medium">
                                {formatTimeDisplay(gig.startTime)} - {formatTimeDisplay(gig.endTime)}
                              </span>
                            </div>
                          </div>
                          <motion.span 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize shadow-sm ${getGigStatusColor(gig.status)}`}
                          >
                            {gig.status}
                          </motion.span>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                          <div className="flex items-center gap-3 text-sm">
                            <div className="flex items-center gap-1 text-gray-600">
                              <Clock className="w-4 h-4" />
                              <span className="font-semibold text-gray-900">{gig.totalHours} hours</span>
                            </div>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-600">{gig.slots.length} slot{gig.slots.length > 1 ? 's' : ''}</span>
                          </div>
                          {gig.status === 'active' && (
                            <motion.div 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="flex items-center gap-2 text-green-600 text-sm font-semibold"
                            >
                              <motion.div 
                                className="w-2.5 h-2.5 bg-green-600 rounded-full"
                                animate={{ scale: [1, 1.3, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                              />
                              Online
                            </motion.div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Navigation Bar - Mobile Only */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="flex items-center justify-around py-2 px-4">
          <button 
            onClick={() => navigate("/delivery")}
            className="flex flex-col items-center gap-1 p-2 text-gray-600"
          >
            <Home className="w-6 h-6" />
            <span className="text-[10px] text-gray-600 font-medium">Home</span>
          </button>
          <button 
            onClick={() => navigate("/delivery/requests")}
            className="flex flex-col items-center gap-1 p-2 text-gray-600"
          >
            <FileText className="w-6 h-6" />
            <span className="text-[10px] text-gray-600 font-medium">Request</span>
          </button>
          <button 
            onClick={() => {
              if (location.pathname === "/delivery/gig") {
                setAnimationKey(prev => prev + 1)
              } else {
                navigate("/delivery/gig")
              }
            }}
            className="flex flex-col items-center gap-1 p-2 text-[#ff8100]"
          >
            <Sparkles className="w-6 h-6" />
            <span className="text-[10px] text-[#ff8100] font-medium">Gig</span>
          </button>
          <button 
            onClick={() => navigate("/delivery/orders")}
            className="flex flex-col items-center gap-1 p-2 text-gray-600"
          >
            <UtensilsCrossed className="w-6 h-6" />
            <span className="text-[10px] text-gray-600 font-medium">Orders</span>
          </button>
          <button 
            onClick={() => navigate("/delivery/profile")}
            className="flex flex-col items-center gap-1 p-2 text-gray-600"
          >
            <User className="w-6 h-6" />
            <span className="text-[10px] text-gray-600 font-medium">Profile</span>
          </button>
        </div>
      </div>
    </div>
  )
}

