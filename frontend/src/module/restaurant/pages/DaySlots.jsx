import { useState, useRef, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { motion } from "framer-motion"
import Lenis from "lenis"
import { ArrowLeft, Clock, Edit2, Trash2, ChevronDown, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const STORAGE_KEY = "restaurant_outlet_timings"

const getDefaultDayData = () => ({
  isOpen: true,
  slots: [{ id: Date.now(), start: "03:45", end: "02:15", startPeriod: "am", endPeriod: "pm" }]
})

export default function DaySlots() {
  const navigate = useNavigate()
  const { day } = useParams()
  const dayName = day ? day.charAt(0).toUpperCase() + day.slice(1) : "Monday"
  
  const [dayData, setDayData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const allDays = JSON.parse(saved)
        return allDays[dayName] || getDefaultDayData()
      }
    } catch (error) {
      console.error("Error loading day slots:", error)
    }
    return getDefaultDayData()
  })

  const [copyToAllDays, setCopyToAllDays] = useState(false)
  const startTimePickerRefs = useRef({})
  const endTimePickerRefs = useRef({})

  // Lenis smooth scrolling
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
  }, [])

  // Calculate duration for a slot
  const calculateSlotDuration = (start, end, startPeriod, endPeriod) => {
    const parseTime = (timeStr, period) => {
      if (!timeStr || !timeStr.includes(":")) return 0
      const [hours, minutes] = timeStr.split(":")
      let hour = parseInt(hours) || 0
      const mins = parseInt(minutes) || 0
      if (period === "pm" && hour !== 12) hour += 12
      if (period === "am" && hour === 12) hour = 0
      return hour * 60 + mins
    }

    const startMinutes = parseTime(start, startPeriod)
    const endMinutes = parseTime(end, endPeriod)
    let diff = endMinutes - startMinutes
    
    if (diff < 0) diff += 24 * 60
    
    const hours = Math.floor(diff / 60)
    const minutes = diff % 60
    
    if (minutes === 0) {
      return `${hours} hrs`
    }
    return `${hours} hrs ${minutes} mins`
  }

  // Calculate total duration
  const calculateTotalDuration = () => {
    if (!dayData.slots || dayData.slots.length === 0) return "0 hrs"

    let totalMinutes = 0
    dayData.slots.forEach(slot => {
      const parseTime = (timeStr, period) => {
        const [hours, minutes] = timeStr.split(":")
        let hour = parseInt(hours)
        if (period === "pm" && hour !== 12) hour += 12
        if (period === "am" && hour === 12) hour = 0
        return hour * 60 + parseInt(minutes)
      }

      const startMinutes = parseTime(slot.start, slot.startPeriod)
      const endMinutes = parseTime(slot.end, slot.endPeriod)
      let diff = endMinutes - startMinutes
      if (diff < 0) diff += 24 * 60
      totalMinutes += diff
    })

    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60

    if (minutes === 0) {
      return `${hours} hrs`
    }
    return `${hours} hrs ${minutes} mins`
  }

  const updateSlot = (slotId, field, value) => {
    setDayData(prev => ({
      ...prev,
      slots: prev.slots.map(slot =>
        slot.id === slotId ? { ...slot, [field]: value } : slot
      )
    }))
  }

  // Convert time format from HH:MM to HH:MM format for time input
  const formatTimeForInput = (timeStr) => {
    if (!timeStr || !timeStr.includes(":")) return "00:00"
    const [hours, minutes] = timeStr.split(":")
    const h = hours.padStart(2, "0")
    const m = minutes.padStart(2, "0")
    return `${h}:${m}`
  }

  // Convert time format from HH:MM (24h) to HH:MM (12h) format
  const formatTimeFromInput = (timeStr) => {
    if (!timeStr || !timeStr.includes(":")) return "00:00"
    const [hours, minutes] = timeStr.split(":")
    const h = parseInt(hours)
    const m = minutes.padStart(2, "0")
    // Convert 24h to 12h format
    if (h === 0) return `12:${m}`
    if (h <= 12) return `${h}:${m}`
    return `${h - 12}:${m}`
  }

  // Handle time picker change
  const handleTimePickerChange = (slotId, field, timeValue) => {
    const formattedTime = formatTimeFromInput(timeValue)
    updateSlot(slotId, field, formattedTime)
    
    // Auto-update period based on 24h time
    const [hours] = timeValue.split(":")
    const h = parseInt(hours)
    if (field === "start") {
      if (h >= 12) {
        updateSlot(slotId, "startPeriod", "pm")
      } else {
        updateSlot(slotId, "startPeriod", "am")
      }
    } else {
      if (h >= 12) {
        updateSlot(slotId, "endPeriod", "pm")
      } else {
        updateSlot(slotId, "endPeriod", "am")
      }
    }
    
    setActiveTimePicker(null)
  }

  // Open time picker
  const openTimePicker = (slotId, field) => {
    setActiveTimePicker({ slotId, field })
  }

  const addSlot = () => {
    if (dayData.slots.length >= 3) {
      alert("Maximum 3 slots allowed per day")
      return
    }
    setDayData(prev => ({
      ...prev,
      slots: [
        ...prev.slots,
        {
          id: Date.now() + Math.random(),
          start: "09:00",
          end: "05:00",
          startPeriod: "am",
          endPeriod: "pm"
        }
      ]
    }))
  }

  const deleteSlot = (slotId) => {
    if (dayData.slots.length === 1) {
      alert("At least one slot is required")
      return
    }
    
    // Open confirmation dialog
    setSlotToDelete(slotId)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (slotToDelete) {
      setDayData(prev => ({
        ...prev,
        slots: prev.slots.filter(slot => slot.id !== slotToDelete)
      }))
      setDeleteDialogOpen(false)
      setSlotToDelete(null)
    }
  }

  const handleSave = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      let allDays = saved ? JSON.parse(saved) : {}

      if (copyToAllDays) {
        // Copy to all days
        const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        dayNames.forEach(d => {
          allDays[d] = { ...dayData }
        })
      } else {
        // Update only current day
        allDays[dayName] = dayData
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(allDays))
      window.dispatchEvent(new Event("outletTimingsUpdated"))
      navigate("/restaurant/outlet-timings")
    } catch (error) {
      console.error("Error saving day slots:", error)
      alert("Error saving slots. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-white overflow-x-hidden flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/restaurant/outlet-timings")}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-6 h-6 text-gray-900" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">{dayName}</h1>
            <p className="text-sm text-gray-500">Appzeto delivery</p>
          </div>
        </div>
      </div>
        
        <div className="bg-gray-50 p-2">
          <p className="text-sm text-gray-700">
            Add or modify your restaurant timings here. You can create maximum up to 3 time slots in a day.
          </p>
        </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto pb-32">  
        {/* Instructional Text */}

        {/* Time Slots */}
        <div className="space-y-6 mb-6">
          {dayData.slots.map((slot, index) => {
            const duration = calculateSlotDuration(slot.start, slot.end, slot.startPeriod, slot.endPeriod)
            return (
              <motion.div
                key={slot.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.1 }}
                className="bg-white rounded-lg p-4 space-y-4"
              >
                {/* Slot Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-base font-bold text-gray-900">Slot-{index + 1}</span>
                    <span className="text-sm text-gray-600 ml-2">({duration})</span>
                  </div>
                  <button
                    onClick={() => deleteSlot(slot.id)}
                    className="w-8 h-8 bg-pink-100 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors"
                    aria-label="Delete slot"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>

                {/* Start Time - All in one row */}
                <div className="flex w-full justify-between items-center gap-3">
                  <div className="flex  items-center gap-2 shrink-0">
                    <Clock className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Start Time</span>
                  </div>
                  <div className="relative flex items-center border border-gray-300 rounded-sm bg-gray-50">
                    <input
                      type="text"
                      value={slot.start}
                      onClick={() => openTimePicker(slot.id, "start")}
                      onChange={(e) => {
                        let value = e.target.value.replace(/[^0-9:]/g, '')
                        // Auto-format as user types
                        if (value.length === 2 && !value.includes(':')) {
                          value = value + ':'
                        }
                        if (value.length <= 5) {
                          updateSlot(slot.id, "start", value)
                        }
                      }}
                      placeholder="03:45"
                      maxLength={5}
                      className="w-20 px-2 py-2 bg-transparent text-gray-900 font-bold focus:outline-none cursor-pointer"
                      style={{ fontSize: '15px' }}
                    />
                    <Edit2 className="w-4 h-4 text-gray-500 mr-2 shrink-0 pointer-events-none" />
                    {/* Hidden time input for picker */}
                    <input
                      type="time"
                      value={(() => {
                        const [h, m] = (slot.start || "00:00").split(":")
                        const hour = parseInt(h) || 0
                        const period = slot.startPeriod || "am"
                        let hour24 = hour
                        if (period === "pm" && hour !== 12) hour24 = hour + 12
                        if (period === "am" && hour === 12) hour24 = 0
                        return `${hour24.toString().padStart(2, "0")}:${(m || "00").padStart(2, "0")}`
                      })()}
                      onChange={(e) => handleTimePickerChange(slot.id, "start", e.target.value)}
                      className="absolute opacity-0 w-0 h-0 pointer-events-none"
                      ref={(input) => {
                        if (input) {
                          startTimePickerRefs.current[slot.id] = input
                        }
                      }}
                    />
                  </div>
                  <div className="relative shrink-0">
                    <select
                      value={slot.startPeriod}
                      onChange={(e) => updateSlot(slot.id, "startPeriod", e.target.value)}
                      className="px-3 py-2 pr-8 border border-gray-300 rounded-sm bg-white text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none min-w-[70px]"
                    >
                      <option value="am">AM</option>
                      <option value="pm">PM</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* End Time - All in one row */}
                <div className="flex w-full justify-between items-center gap-3">
                  <div className="flex items-center gap-2 shrink-0">
                    <Clock className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700 whitespace-nowrap">End Time</span>
                  </div>
                  <div className="relative flex items-center border border-gray-300 rounded-sm bg-gray-50">
                    <input
                      type="text"
                      value={slot.end}
                      onClick={() => openTimePicker(slot.id, "end")}
                      onChange={(e) => {
                        let value = e.target.value.replace(/[^0-9:]/g, '')
                        // Auto-format as user types
                        if (value.length === 2 && !value.includes(':')) {
                          value = value + ':'
                        }
                        if (value.length <= 5) {
                          updateSlot(slot.id, "end", value)
                        }
                      }}
                      placeholder="02:15"
                      maxLength={5}
                      className="w-20 px-2 py-2 bg-transparent text-gray-900 font-bold focus:outline-none cursor-pointer"
                      style={{ fontSize: '15px' }}
                    />
                    <Edit2 className="w-4 h-4 text-gray-500 mr-2 shrink-0 pointer-events-none" />
                    {/* Hidden time input for picker */}
                    <input
                      type="time"
                      value={(() => {
                        const [h, m] = (slot.end || "00:00").split(":")
                        const hour = parseInt(h) || 0
                        const period = slot.endPeriod || "pm"
                        let hour24 = hour
                        if (period === "pm" && hour !== 12) hour24 = hour + 12
                        if (period === "am" && hour === 12) hour24 = 0
                        return `${hour24.toString().padStart(2, "0")}:${(m || "00").padStart(2, "0")}`
                      })()}
                      onChange={(e) => handleTimePickerChange(slot.id, "end", e.target.value)}
                      className="absolute opacity-0 w-0 h-0 pointer-events-none"
                      ref={(input) => {
                        if (input) {
                          endTimePickerRefs.current[slot.id] = input
                        }
                      }}
                    />
                  </div>
                  <div className="relative shrink-0">
                    <select
                      value={slot.endPeriod}
                      onChange={(e) => updateSlot(slot.id, "endPeriod", e.target.value)}
                      className="px-3 py-2 pr-8 border border-gray-300 rounded-sm bg-white text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none min-w-[70px]"
                    >
                      <option value="am">AM</option>
                      <option value="pm">PM</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Add Time Slot Button */}
        {dayData.slots.length < 3 && (
          <button
            onClick={addSlot}
            className="w-full text-blue-600 hover:text-blue-700 text-sm font-medium py-3 transition-colors"
          >
            + Add time slot
          </button>
        )}
      </div>

      {/* Sticky Bottom Controls */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-4 z-40 shadow-lg">
        <div className="space-y-4">
          {/* Copy to all days */}
          <div className="flex items-center gap-3">
            <Checkbox
              id="copy-to-all"
              checked={copyToAllDays}
              onCheckedChange={setCopyToAllDays}
              className="w-5 h-5 border-2 border-gray-300 rounded data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
            />
            <label
              htmlFor="copy-to-all"
              className="text-sm text-gray-700 cursor-pointer"
            >
              Copy above timings to all days
            </label>
          </div>

          {/* Total Duration */}
          <div className="text-sm text-gray-700">
            Total: {calculateTotalDuration()}
          </div>

          {/* Save Button */}
          <Button
            onClick={handleSave}
            className="w-full bg-gray-800 hover:bg-gray-900 text-white font-medium py-3 rounded-lg"
          >
            Save
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <DialogTitle className="text-left">Delete Time Slot</DialogTitle>
            </div>
            <DialogDescription className="text-left text-gray-600 pt-2">
              Are you sure you want to delete this time slot? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false)
                setSlotToDelete(null)
              }}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDelete}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
