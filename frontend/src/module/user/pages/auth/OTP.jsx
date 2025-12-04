import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import AnimatedPage from "../../components/AnimatedPage"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function OTP() {
  const navigate = useNavigate()
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)
  const [authData, setAuthData] = useState(null)
  const inputRefs = useRef([])

  useEffect(() => {
    // Get auth data from sessionStorage
    const stored = sessionStorage.getItem("authData")
    if (!stored) {
      // No auth data, redirect to sign in
      navigate("/user/auth/sign-in")
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
          // Simulate success (in real app, verify with backend)
          if (code === "123456" || code === "000000") {
            // Demo codes for testing
            resolve()
          } else {
            // Randomly fail for demo purposes (80% success rate)
            if (Math.random() > 0.2) {
              resolve()
            } else {
              reject(new Error("Invalid OTP. Please try again."))
            }
          }
        }, 1500)
      })

      setSuccess(true)
      
      // Clear auth data from sessionStorage
      sessionStorage.removeItem("authData")

      // Redirect to home after short delay
      setTimeout(() => {
        navigate("/user")
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
    if (!authData) return ""
    if (authData.method === "phone") {
      return authData.phone || ""
    }
    return authData.email || ""
  }

  if (!authData) {
    return null
  }

  return (
    <AnimatedPage className="min-h-screen flex items-center justify-center bg-gradient-to-b from-yellow-50/30 via-white to-orange-50/20 p-4">
      <Card className="w-full max-w-md shadow-lg relative">
        <CardHeader className="text-center space-y-2 relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-4"
            onClick={() => navigate("/user/auth/sign-in")}
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
                      className="w-12 h-12 text-center text-lg font-semibold p-0 border-2 border-black focus-visible:ring-2 focus-visible:ring-black focus-visible:border-black"
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
                  <p>Enter the 6-digit code sent to your {authData.method === "phone" ? "phone" : "email"}</p>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={() => handleVerify()}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  disabled={isLoading || otp.some((digit) => !digit)}
                >
                  {isLoading ? (
                    <>
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
                      className="text-primary hover:underline font-medium disabled:opacity-50"
                    >
                      Resend Code
                    </button>
                  )}
                </div>
              </div>

              <div className="text-center text-xs text-muted-foreground pt-4 border-t">
                <p>Didn't receive the code? Check your spam folder or try resending.</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </AnimatedPage>
  )
}
