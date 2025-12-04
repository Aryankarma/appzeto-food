import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Loader2, CheckCircle2, AlertCircle, UtensilsCrossed } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import loginBg from "@/assets/login page img.jpg"

export default function RestaurantOTP() {
  const navigate = useNavigate()
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)
  const [authData, setAuthData] = useState(null)
  const inputRefs = useRef([])

  // Default OTP for testing
  const DEFAULT_OTP = "123456"
  const DEFAULT_PHONE = "+91 9876543210"

  useEffect(() => {
    // Get auth data from sessionStorage
    const stored = sessionStorage.getItem("restaurantAuthData")
    if (!stored) {
      // No auth data, redirect to login
      navigate("/restaurant/login")
      return
    }
    setAuthData(JSON.parse(stored))

    // Start resend timer (60 seconds)
    setResendTimer(60)
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [navigate])

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [])

  const handleChange = (index, value) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) {
      return
    }

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    setError("")

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-submit when all 6 digits are entered
    if (newOtp.every((digit) => digit !== "") && newOtp.length === 6) {
      handleVerify(newOtp.join(""))
    }
  }

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === "Backspace") {
      if (otp[index]) {
        // If current input has value, clear it
        const newOtp = [...otp]
        newOtp[index] = ""
        setOtp(newOtp)
      } else if (index > 0) {
        // If current input is empty, move to previous and clear it
        inputRefs.current[index - 1]?.focus()
        const newOtp = [...otp]
        newOtp[index - 1] = ""
        setOtp(newOtp)
      }
    }
    // Handle paste
    if (e.key === "v" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      navigator.clipboard.readText().then((text) => {
        const digits = text.replace(/\D/g, "").slice(0, 6).split("")
        const newOtp = [...otp]
        digits.forEach((digit, i) => {
          if (i < 6) {
            newOtp[i] = digit
          }
        })
        setOtp(newOtp)
        if (digits.length === 6) {
          handleVerify(newOtp.join(""))
        } else {
          inputRefs.current[digits.length]?.focus()
        }
      })
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text")
    const digits = pastedData.replace(/\D/g, "").slice(0, 6).split("")
    const newOtp = [...otp]
    digits.forEach((digit, i) => {
      if (i < 6) {
        newOtp[i] = digit
      }
    })
    setOtp(newOtp)
    if (digits.length === 6) {
      handleVerify(newOtp.join(""))
    } else {
      inputRefs.current[digits.length]?.focus()
    }
  }

  const handleVerify = async (otpValue = null) => {
    const code = otpValue || otp.join("")
    
    if (code.length !== 6) {
      setError("Please enter the complete 6-digit code")
      return
    }

    setIsLoading(true)
    setError("")
    setSuccess(false)

    // Simulate API call
    try {
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Accept default OTP or any 6-digit code for demo
          if (code === DEFAULT_OTP || code === "000000" || code.length === 6) {
            resolve()
          } else {
            reject(new Error("Invalid OTP. Please try again."))
          }
        }, 1500)
      })

      setSuccess(true)
      
      // Clear auth data from sessionStorage
      sessionStorage.removeItem("restaurantAuthData")
      
      // Set authentication state in localStorage
      localStorage.setItem("restaurant_authenticated", "true")
      localStorage.setItem("restaurant_user", JSON.stringify({
        phone: authData.phone,
        name: authData.name || "Restaurant Partner"
      }))
      
      // Dispatch custom event for same-tab updates
      window.dispatchEvent(new Event('restaurantAuthChanged'))

      // Redirect to restaurant module/home after short delay
      setTimeout(() => {
        navigate("/restaurant")
      }, 1000)
    } catch (err) {
      setError(err.message || "Invalid OTP. Please try again.")
      // Clear OTP on error
      setOtp(["", "", "", "", "", ""])
      inputRefs.current[0]?.focus()
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    if (resendTimer > 0) return

    setIsLoading(true)
    setError("")

    // Simulate resend API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Reset timer
    setResendTimer(60)
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    setIsLoading(false)
    setError("")
    setOtp(["", "", "", "", "", ""])
    inputRefs.current[0]?.focus()
  }

  const getContactInfo = () => {
    if (!authData) return DEFAULT_PHONE
    return authData.phone || DEFAULT_PHONE
  }

  if (!authData) {
    return null
  }

  return (
    <div className="h-screen w-full flex bg-white overflow-hidden">
      {/* Left image section */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img
          src={loginBg}
          alt="Restaurant background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center text-white pointer-events-none">
          <div
            className="bg-primary-orange/80 rounded-r-full py-10 xl:py-20 pl-10 xl:pl-14 pr-10 xl:pr-20 max-w-[70%] shadow-xl backdrop-blur-[1px]"
            style={{ animation: "slideInLeft 0.8s ease-out both" }}
          >
            <h1 className="text-3xl xl:text-4xl font-extrabold mb-4 tracking-wide leading-tight">
              VERIFY
              <br />
              YOUR ACCOUNT
            </h1>
            <p className="text-base xl:text-lg opacity-95 max-w-xl">
              Enter the OTP sent to your phone number.
            </p>
          </div>
        </div>
      </div>

      {/* Right form section */}
      <div className="w-full lg:w-1/2 h-full flex flex-col">
        {/* Top logo */}
        <div className="relative flex items-center justify-center px-6 sm:px-10 lg:px-16 pt-6 pb-4">
          <div
            className="flex items-center gap-3"
            style={{ animation: "fadeInDown 0.7s ease-out both" }}
          >
            <div className="h-11 w-11 rounded-xl bg-primary-orange flex items-center justify-center text-white shadow-lg">
              <UtensilsCrossed className="h-6 w-6" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-2xl font-bold tracking-wide text-primary-orange">
                Appzeto Food
              </span>
              <span className="text-xs font-medium text-gray-500">
                Restaurant Panel
              </span>
            </div>
          </div>
        </div>

        {/* Centered content */}
        <div
          className="flex-1 flex flex-col items-center justify-center px-6 sm:px-10 lg:px-16 pb-8"
          style={{ animation: "fadeInUp 0.8s ease-out 0.15s both" }}
        >
          <Card className="w-full max-w-lg shadow-lg relative">
            <CardHeader className="text-center space-y-2 relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-4"
                onClick={() => navigate(authData.isSignUp ? "/restaurant/signup" : "/restaurant/login")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <CardTitle className="text-3xl font-bold">Verify OTP</CardTitle>
              <CardDescription className="text-base">
                We sent a verification code to
                <br />
                <span className="font-semibold text-foreground">{getContactInfo()}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {success ? (
                <div className="text-center space-y-4 py-4">
                  <div className="flex justify-center">
                    <CheckCircle2 className="h-16 w-16 text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-green-600">Verification Successful!</h3>
                    <p className="text-muted-foreground mt-2">
                      {authData.isSignUp ? "Your account has been created." : "You're signed in."}
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    <div className="flex justify-center gap-2">
                      {otp.map((digit, index) => (
                        <Input
                          key={index}
                          ref={(el) => (inputRefs.current[index] = el)}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleChange(index, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          onPaste={index === 0 ? handlePaste : undefined}
                          disabled={isLoading}
                          className="w-12 h-12 text-center text-lg font-semibold p-0 border-2 border-primary-orange focus-visible:ring-2 focus-visible:ring-primary-orange focus-visible:border-primary-orange"
                        />
                      ))}
                    </div>

                    {error && (
                      <div className="flex items-center gap-2 justify-center text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                        <AlertCircle className="h-4 w-4" />
                        <span>{error}</span>
                      </div>
                    )}

                    <div className="text-center text-sm text-muted-foreground">
                      <p>Enter the 6-digit code sent to your phone</p>
                      <p className="mt-1 text-xs text-primary-orange font-semibold">
                        Default OTP: {DEFAULT_OTP}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button
                      onClick={() => handleVerify()}
                      className="w-full bg-primary-orange hover:bg-primary-orange/90 text-white"
                      disabled={isLoading || otp.some((digit) => !digit)}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        "Verify Code"
                      )}
                    </Button>

                    <div className="text-center text-sm">
                      {resendTimer > 0 ? (
                        <p className="text-muted-foreground">
                          Resend code in <span className="font-semibold">{resendTimer}s</span>
                        </p>
                      ) : (
                        <button
                          type="button"
                          onClick={handleResend}
                          disabled={isLoading}
                          className="text-primary-orange hover:underline font-medium disabled:opacity-50"
                        >
                          Resend Code
                        </button>
                      )}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Simple keyframe animations */}
        <style>{`
          @keyframes slideInLeft {
            from {
              opacity: 0;
              transform: translateX(-40px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes fadeInDown {
            from {
              opacity: 0;
              transform: translateY(-16px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    </div>
  )
}

