import { useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Mail, Phone, AlertCircle, Loader2 } from "lucide-react"
import AnimatedPage from "../../components/AnimatedPage"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Common country codes
const countryCodes = [
  { code: "+1", country: "US/CA", flag: "🇺🇸" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+91", country: "IN", flag: "🇮🇳" },
  { code: "+86", country: "CN", flag: "🇨🇳" },
  { code: "+81", country: "JP", flag: "🇯🇵" },
  { code: "+49", country: "DE", flag: "🇩🇪" },
  { code: "+33", country: "FR", flag: "🇫🇷" },
  { code: "+39", country: "IT", flag: "🇮🇹" },
  { code: "+34", country: "ES", flag: "🇪🇸" },
  { code: "+61", country: "AU", flag: "🇦🇺" },
  { code: "+7", country: "RU", flag: "🇷🇺" },
  { code: "+55", country: "BR", flag: "🇧🇷" },
  { code: "+52", country: "MX", flag: "🇲🇽" },
  { code: "+82", country: "KR", flag: "🇰🇷" },
  { code: "+65", country: "SG", flag: "🇸🇬" },
  { code: "+971", country: "AE", flag: "🇦🇪" },
  { code: "+966", country: "SA", flag: "🇸🇦" },
  { code: "+27", country: "ZA", flag: "🇿🇦" },
  { code: "+31", country: "NL", flag: "🇳🇱" },
  { code: "+46", country: "SE", flag: "🇸🇪" },
]

export default function SignIn() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const isSignUp = searchParams.get("mode") === "signup"
  
  const [authMethod, setAuthMethod] = useState("phone") // "phone" or "email"
  const [formData, setFormData] = useState({
    phone: "",
    countryCode: "+1",
    email: "",
    name: "",
  })
  const [errors, setErrors] = useState({
    phone: "",
    email: "",
    name: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const validateEmail = (email) => {
    if (!email.trim()) {
      return "Email is required"
    }
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    if (!emailRegex.test(email.trim())) {
      return "Please enter a valid email address"
    }
    return ""
  }

  const validatePhone = (phone) => {
    if (!phone.trim()) {
      return "Phone number is required"
    }
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, "")
    const phoneRegex = /^\d{7,15}$/
    if (!phoneRegex.test(cleanPhone)) {
      return "Phone number must be 7-15 digits"
    }
    return ""
  }

  const validateName = (name) => {
    if (!name.trim()) {
      return "Name is required"
    }
    if (name.trim().length < 2) {
      return "Name must be at least 2 characters"
    }
    if (name.trim().length > 50) {
      return "Name must be less than 50 characters"
    }
    const nameRegex = /^[a-zA-Z\s'-]+$/
    if (!nameRegex.test(name.trim())) {
      return "Name can only contain letters, spaces, hyphens, and apostrophes"
    }
    return ""
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Real-time validation
    if (name === "email") {
      setErrors({ ...errors, email: validateEmail(value) })
    } else if (name === "phone") {
      setErrors({ ...errors, phone: validatePhone(value) })
    } else if (name === "name") {
      setErrors({ ...errors, name: validateName(value) })
    }
  }

  const handleCountryCodeChange = (value) => {
    setFormData({
      ...formData,
      countryCode: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Validate based on auth method
    let hasErrors = false
    const newErrors = { phone: "", email: "", name: "" }

    if (authMethod === "phone") {
      const phoneError = validatePhone(formData.phone)
      newErrors.phone = phoneError
      if (phoneError) hasErrors = true
    } else {
      const emailError = validateEmail(formData.email)
      newErrors.email = emailError
      if (emailError) hasErrors = true
    }

    // Validate name for sign up
    if (isSignUp) {
      const nameError = validateName(formData.name)
      newErrors.name = nameError
      if (nameError) hasErrors = true
    }

    setErrors(newErrors)

    if (hasErrors) {
      setIsLoading(false)
      return
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Store auth data in sessionStorage for OTP page
    const authData = {
      method: authMethod,
      phone: authMethod === "phone" ? `${formData.countryCode} ${formData.phone}` : null,
      email: authMethod === "email" ? formData.email : null,
      name: isSignUp ? formData.name : null,
      isSignUp,
    }
    sessionStorage.setItem("authData", JSON.stringify(authData))

    setIsLoading(false)
    navigate("/user/auth/otp")
  }

  const handleGoogleSignIn = () => {
    // Redirect to OAuth callback
    // In a real app, this would redirect to Google OAuth
    const authUrl = "/user/auth/callback?provider=google"
    window.location.href = authUrl
  }

  const toggleMode = () => {
    const newMode = isSignUp ? "signin" : "signup"
    navigate(`/user/auth/sign-in?mode=${newMode}`, { replace: true })
    // Reset form
    setFormData({ phone: "", countryCode: "+1", email: "", name: "" })
    setErrors({ phone: "", email: "", name: "" })
  }

  return (
    <AnimatedPage className="min-h-screen flex items-center justify-center bg-gradient-to-b from-yellow-50/30 via-white to-orange-50/20 p-3 sm:p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-2 p-4 sm:p-6">
          <CardTitle className="text-2xl sm:text-3xl font-bold">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            {isSignUp
              ? "Sign up to start ordering delicious food"
              : "Sign in to continue to your account"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name field for sign up */}
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2 text-sm sm:text-base">
                  <Mail className="h-4 w-4" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`text-sm sm:text-base ${errors.name ? "border-red-500" : ""}`}
                  aria-invalid={errors.name ? "true" : "false"}
                />
                {errors.name && (
                  <div className="flex items-center gap-1 text-xs sm:text-sm text-red-600">
                    <AlertCircle className="h-3 w-3" />
                    <span>{errors.name}</span>
                  </div>
                )}
              </div>
            )}

            {/* Auth method toggle */}
            <div className="flex gap-2">
              <Button
                type="button"
                variant={authMethod === "phone" ? "default" : "outline"}
                onClick={() => setAuthMethod("phone")}
                className="flex-1 text-xs sm:text-sm h-9 sm:h-10"
              >
                <Phone className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Phone
              </Button>
              <Button
                type="button"
                variant={authMethod === "email" ? "default" : "outline"}
                onClick={() => setAuthMethod("email")}
                className="flex-1 text-xs sm:text-sm h-9 sm:h-10"
              >
                <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Email
              </Button>
            </div>

            {/* Phone input */}
            {authMethod === "phone" && (
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2 text-sm sm:text-base">
                  <Phone className="h-4 w-4" />
                  Phone Number
                </Label>
                <div className="flex gap-2">
                  <Select
                    value={formData.countryCode}
                    onValueChange={handleCountryCodeChange}
                  >
                    <SelectTrigger className="w-20 sm:w-24 md:w-[100px] text-xs sm:text-sm">
                      <SelectValue placeholder="Code" />
                    </SelectTrigger>
                    <SelectContent>
                      {countryCodes.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          <span className="flex items-center gap-2 text-xs sm:text-sm">
                            <span>{country.flag}</span>
                            <span>{country.code}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex-1 min-w-0">
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="Enter phone number"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`flex-1 text-sm sm:text-base bg-green-600 text-white placeholder:text-green-200 ${errors.phone ? "border-red-500" : ""}`}
                      aria-invalid={errors.phone ? "true" : "false"}
                    />
                  </div>
                </div>
                {errors.phone && (
                  <div className="flex items-center gap-1 text-xs sm:text-sm text-red-600">
                    <AlertCircle className="h-3 w-3" />
                    <span>{errors.phone}</span>
                  </div>
                )}
              </div>
            )}

            {/* Email input */}
            {authMethod === "email" && (
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2 text-sm sm:text-base">
                  <Mail className="h-4 w-4" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleChange}
                  className={`text-sm sm:text-base bg-green-600 text-white placeholder:text-green-200 ${errors.email ? "border-red-500" : ""}`}
                  aria-invalid={errors.email ? "true" : "false"}
                />
                {errors.email && (
                  <div className="flex items-center gap-1 text-xs sm:text-sm text-red-600">
                    <AlertCircle className="h-3 w-3" />
                    <span>{errors.email}</span>
                  </div>
                )}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold text-sm sm:text-base h-10 sm:h-11 transition-colors"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  <span className="hidden sm:inline">{isSignUp ? "Creating Account..." : "Signing In..."}</span>
                  <span className="sm:hidden">{isSignUp ? "Creating..." : "Signing In..."}</span>
                </>
              ) : (
                isSignUp ? "Create Account" : "Continue"
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full text-sm sm:text-base h-10 sm:h-11"
            onClick={handleGoogleSignIn}
          >
            <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign {isSignUp ? "up" : "in"} with Google
          </Button>

          <div className="text-center text-xs sm:text-sm">
            {isSignUp ? (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-primary hover:underline font-medium"
                >
                  Sign in
                </button>
              </>
            ) : (
              <>
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-primary hover:underline font-medium"
                >
                  Sign up
                </button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </AnimatedPage>
  )
}
