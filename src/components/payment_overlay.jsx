"use client"

import { useState, useEffect } from "react"
import { X, CreditCard, Smartphone, Check, Eye, EyeOff, AlertCircle } from "lucide-react"

const PaymentOverlay = ({
  isOpen,
  onClose,
  amount = "5000",
  package: packageName = "Forfait Premium",
  onPaymentRequest,
  onPasswordValidation,
  onPaymentSuccess
}) => {
  const [paymentMethod, setPaymentMethod] = useState(null)
  const [step, setStep] = useState("method")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [randomizedNumbers, setRandomizedNumbers] = useState([])
  const [error, setError] = useState(null)
  const [attemptCount, setAttemptCount] = useState(0)
  const [isBlocked, setIsBlocked] = useState(false)
  const [blockTimer, setBlockTimer] = useState(0)
  const [isDark, setIsDark] = useState(false)

  // Detect system theme preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    setIsDark(mediaQuery.matches)

    const handleChange = (e) => setIsDark(e.matches)
    mediaQuery.addEventListener("change", handleChange)

    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  // Minimal Theme
  const theme = {
    overlay: isDark ? "bg-gray-900/95 backdrop-blur-sm" : "bg-white/95 backdrop-blur-sm",
    backdrop: "bg-black/40",
    border: isDark ? "border-gray-800" : "border-gray-200",
    text: {
      primary: isDark ? "text-white" : "text-gray-900",
      secondary: isDark ? "text-gray-400" : "text-gray-600",
      muted: isDark ? "text-gray-500" : "text-gray-500",
    },
    button: {
      primary: isDark ? "bg-white text-gray-900 hover:bg-gray-100" : "bg-gray-900 text-white hover:bg-gray-800",
      secondary: isDark
        ? "bg-gray-800 hover:bg-gray-700 border-gray-700"
        : "bg-gray-50 hover:bg-gray-100 border-gray-200",
      ghost: isDark ? "hover:bg-gray-800" : "hover:bg-gray-100",
    },
    input: isDark
      ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-gray-600"
      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-gray-400",
    card: isDark ? "bg-gray-800/50 border-gray-700" : "bg-gray-50/50 border-gray-200",
    error: isDark ? "bg-red-900/20 border-red-800 text-red-400" : "bg-red-50 border-red-200 text-red-600",
    success: isDark ? "bg-gray-800" : "bg-gray-900",
  }

  // Shuffle array function
  const shuffleArray = (array) => {
    const newArray = [...array]
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
    }
    return newArray
  }

  // Generate random number layout when overlay opens
  useEffect(() => {
    if (isOpen) {
      const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
      setRandomizedNumbers(shuffleArray(numbers))
    }
  }, [isOpen])

  // Block timer countdown
  useEffect(() => {
    let interval
    if (isBlocked && blockTimer > 0) {
      interval = setInterval(() => {
        setBlockTimer((prev) => {
          if (prev <= 1) {
            setIsBlocked(false)
            setAttemptCount(0)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isBlocked, blockTimer])

  const resetState = () => {
    setPaymentMethod(null)
    setStep("method")
    setPassword("")
    setShowPassword(false)
    setIsProcessing(false)
    setRandomizedNumbers([])
    setError(null)
    setAttemptCount(0)
    setIsBlocked(false)
    setBlockTimer(0)
  }

  const handleClose = () => {
    resetState()
    onClose()
    if(step === "success" && onPaymentSuccess) {
      onPaymentSuccess()
    }
  }

  const handleMethodSelect = (method) => {
    setError(null)
    setPaymentMethod(method)
    setStep("confirm")
  }

  const handleConfirm = () => {
    setError(null)
    if (paymentMethod === "credit") {
      processPayment()
    } else {
      setStep("password")
    }
  }

  const processPayment = async () => {
    setIsProcessing(true)
    setError(null)

    try {
      const paymentData = {
        amount: amount,
        method: paymentMethod,
        package: packageName,
        timestamp: new Date().toISOString(),
      }

      if (onPaymentRequest) {
        const result = await onPaymentRequest(paymentData)
        console.log("Payment result:", result);
        if (result.success) {
          setIsProcessing(false)
          setStep("success")
          setAttemptCount(0)
        } else {
          throw new Error(result.error || "Payment failed")
        }
      } else {
        setIsProcessing(false)
        setStep("success")
        setAttemptCount(0)
      }
    } catch (err) {
      setIsProcessing(false)
      setError(err.message || "Une erreur s'est produite")
      setStep("error")
    }
  }

  const handlePasswordSubmit = async () => {
    if (password.length < 4) {
      setError("Mot de passe trop court")
      return
    }

    if (isBlocked) {
      setError("Compte temporairement bloqué")
      return
    }

    try {
      if (onPasswordValidation) {
        const isValid = await onPasswordValidation(password)

        if (!isValid) {
          const newAttemptCount = attemptCount + 1
          setAttemptCount(newAttemptCount)

          if (newAttemptCount >= 3) {
            setIsBlocked(true)
            setBlockTimer(30)
            setError("Compte bloqué après 3 tentatives")
            setPassword("")
            return
          }

          setError("Mot de passe incorrect")
          setPassword("")
          return
        }
      }

      processPayment()
    } catch (err) {
      setError(err.message || "Erreur de validation")
    }
  }

  const handleNumberClick = (num) => {
    if (isBlocked) return
    if (password.length < 6) {
      setPassword((prev) => prev + num)
      setError(null)
    }
  }

  const handleBackspace = () => {
    if (isBlocked) return
    setPassword((prev) => prev.slice(0, -1))
    setError(null)
  }

  const handleRetry = () => {
    setError(null)
    if (step === "error") {
      if (paymentMethod === "credit") {
        setStep("confirm")
      } else {
        setStep("password")
        setPassword("")
      }
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className={`fixed inset-0 z-50 ${theme.backdrop}`} onClick={handleClose} />

      {/* Overlay */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom duration-300 rounded-t-xl border-t ${theme.overlay} ${theme.border}`}
        style={{ height: "40vh", minHeight: "350px", maxHeight: "500px" }}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className={`flex items-center justify-between p-4 border-b ${theme.border}`}>
            <h2 className={`text-lg font-medium ${theme.text.primary}`}>
              {step === "method" && "Mode de paiement"}
              {step === "confirm" && "Confirmation"}
              {step === "password" && "Mot de passe"}
              {step === "success" && "Succès"}
              {step === "error" && "Erreur"}
            </h2>
            <button onClick={handleClose} className={`p-1 rounded-md transition-colors ${theme.button.ghost}`}>
              <X className={`w-5 h-5 ${theme.text.secondary}`} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-4 flex flex-col">
            {/* Method Selection */}
            {step === "method" && (
              <div className="flex flex-col h-full justify-between space-y-4">
                <div className={`p-4 rounded-lg border ${theme.card}`}>
                  <div className={`text-sm ${theme.text.secondary} mb-1`}>{packageName}</div>
                  <div className={`text-xl font-semibold ${theme.text.primary}`}>{amount} FCFA</div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => handleMethodSelect("credit")}
                    className={`w-full p-4 rounded-lg transition-colors flex items-center gap-3 border ${theme.button.secondary}`}
                  >
                    <CreditCard className={`w-5 h-5 ${theme.text.primary}`} />
                    <span className={`font-medium ${theme.text.primary}`}>Paiement par crédit</span>
                  </button>

                  <button
                    onClick={() => handleMethodSelect("mobile")}
                    className={`w-full p-4 rounded-lg transition-colors flex items-center gap-3 border ${theme.button.secondary}`}
                  >
                    <Smartphone className={`w-5 h-5 ${theme.text.primary}`} />
                    <span className={`font-medium ${theme.text.primary}`}>Orange Money</span>
                  </button>
                </div>
              </div>
            )}

            {/* Confirmation */}
            {step === "confirm" && (
              <div className="flex flex-col h-full justify-between space-y-4">
                <div className={`p-4 rounded-lg border ${theme.card}`}>
                  <div className="flex items-center gap-3 mb-3">
                    {paymentMethod === "credit" ? (
                      <CreditCard className={`w-4 h-4 ${theme.text.primary}`} />
                    ) : (
                      <Smartphone className={`w-4 h-4 ${theme.text.primary}`} />
                    )}
                    <span className={`font-medium ${theme.text.primary}`}>
                      {paymentMethod === "credit" ? "Crédit" : "Orange Money"}
                    </span>
                  </div>
                  <div className={`text-sm ${theme.text.secondary} mb-1`}>{packageName}</div>
                  <div className={`text-lg font-semibold ${theme.text.primary}`}>{amount} FCFA</div>
                </div>

                <button
                  onClick={handleConfirm}
                  disabled={isProcessing}
                  className={`w-full py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${theme.button.primary}`}
                >
                  {isProcessing ? "Traitement..." : "Confirmer"}
                </button>
              </div>
            )}

            {/* Password Input */}
            {step === "password" && (
              <div className="flex flex-col h-full space-y-4">
                {/* Error display */}
                {error && (
                  <div className={`p-3 rounded-lg flex items-center gap-2 border text-sm ${theme.error}`}>
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <div>
                      <p>{error}</p>
                      {attemptCount > 0 && !isBlocked && (
                        <p className="text-xs mt-1 opacity-80">Tentative {attemptCount}/3</p>
                      )}
                      {isBlocked && <p className="text-xs mt-1 opacity-80">Déblocage dans {formatTime(blockTimer)}</p>}
                    </div>
                  </div>
                )}

                {/* Password Field */}
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      if (!isBlocked) {
                        setPassword(e.target.value.replace(/\D/g, "").slice(0, 6))
                        setError(null)
                      }
                    }}
                    placeholder={isBlocked ? "Compte bloqué" : "Mot de passe"}
                    disabled={isBlocked}
                    className={`w-full p-3 rounded-lg focus:outline-none pr-12 transition-colors ${theme.input} ${
                      isBlocked ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isBlocked}
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors disabled:opacity-50 ${theme.text.secondary} hover:${theme.text.primary}`}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Number Pad */}
                <div className="flex-1 flex flex-col justify-center space-y-2">
                  <div className="grid grid-cols-5 gap-2">
                    {randomizedNumbers.slice(0, 5).map((num) => (
                      <button
                        key={`${num}-${Math.random()}`}
                        onClick={() => handleNumberClick(num.toString())}
                        disabled={isBlocked}
                        className={`h-10 rounded-lg text-sm font-medium transition-colors border ${theme.button.secondary} ${
                          isBlocked ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        <span className={theme.text.primary}>{num}</span>
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {randomizedNumbers.slice(5, 10).map((num) => (
                      <button
                        key={`${num}-${Math.random()}`}
                        onClick={() => handleNumberClick(num.toString())}
                        disabled={isBlocked}
                        className={`h-10 rounded-lg text-sm font-medium transition-colors border ${theme.button.secondary} ${
                          isBlocked ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        <span className={theme.text.primary}>{num}</span>
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={handleBackspace}
                    disabled={isBlocked}
                    className={`w-full h-10 rounded-lg text-sm font-medium transition-colors border ${theme.button.secondary} ${
                      isBlocked ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <span className={theme.text.primary}>Effacer</span>
                  </button>
                </div>

                <button
                  onClick={handlePasswordSubmit}
                  disabled={password.length < 4 || isProcessing || isBlocked}
                  className={`w-full py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${theme.button.primary}`}
                >
                  {isProcessing ? "Traitement..." : isBlocked ? `Bloqué (${formatTime(blockTimer)})` : "Valider"}
                </button>
              </div>
            )}

            {/* Error Screen */}
            {step === "error" && (
              <div className="flex flex-col h-full justify-center items-center text-center space-y-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${theme.error}`}>
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className={`text-lg font-semibold mb-2 ${theme.text.primary}`}>Transaction échouée</h3>
                  <p className={`text-sm mb-4 ${theme.text.secondary}`}>{error}</p>
                </div>

                <div className="w-full space-y-2">
                  <button
                    onClick={handleRetry}
                    className={`w-full py-3 rounded-lg font-medium transition-colors ${theme.button.primary}`}
                  >
                    Réessayer
                  </button>
                  <button
                    onClick={handleClose}
                    className={`w-full py-3 rounded-lg font-medium transition-colors border ${theme.button.secondary}`}
                  >
                    <span className={theme.text.primary}>Annuler</span>
                  </button>
                </div>
              </div>
            )}

            {/* Success */}
            {step === "success" && (
              <div className="flex flex-col h-full justify-center items-center text-center space-y-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${theme.success}`}>
                  <Check className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className={`text-lg font-semibold mb-1 ${theme.text.primary}`}>Transaction réussie</h3>
                  <p className={`text-sm ${theme.text.secondary}`}>Paiement de {amount} FCFA effectué</p>
                </div>
                <button
                  onClick={handleClose}
                  className={`w-full py-3 rounded-lg font-medium transition-colors ${theme.button.primary}`}
                >
                  Terminer
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default PaymentOverlay
