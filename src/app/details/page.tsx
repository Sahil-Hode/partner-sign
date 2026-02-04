"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { User, ArrowLeft } from 'lucide-react'
import { AgreementCard, AgreementHeader, AgreementBody, AgreementFooter } from '@/components/AgreementCard'
import { FormInput, FormTextarea } from '@/components/FormInput'
import { Button } from '@/components/Button'
import { SignaturePad } from '@/components/SignaturePad'
import { Stepper } from '@/components/Stepper'
import { useAgreement } from '@/context/AgreementContext'

interface FormData {
  fullName: string
  panNumber: string
  address: string
  city: string
  state: string
  date: string
  jurisdiction: string
  place: string
  aadhaarNumber: string
  aadhaarVerified: boolean
  aadhaarVerifiedAt?: string
  signatureName: string
  signatureDataUrl: string
}

export default function DetailsPage() {
  const router = useRouter()
  const { data, updateData } = useAgreement()
  
  const [formData, setFormData] = useState<FormData>({
    fullName: data.fullName,
    panNumber: data.panNumber,
    address: data.address,
    city: data.city,
    state: data.state,
    date: data.date || new Date().toISOString().split('T')[0],
    jurisdiction: data.jurisdiction,
    place: data.place,
    aadhaarNumber: data.aadhaarNumber,
    aadhaarVerified: data.aadhaarVerified || false,
    aadhaarVerifiedAt: data.aadhaarVerifiedAt,
    signatureName: data.signatureName,
    signatureDataUrl: data.signatureDataUrl || '',
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [otpSent, setOtpSent] = useState(false)
  const [otpCode, setOtpCode] = useState('')
  const [otpError, setOtpError] = useState('')
  const [verificationNote, setVerificationNote] = useState('')
  const [otpLoading, setOtpLoading] = useState(false)
  const [verifyLoading, setVerifyLoading] = useState(false)
  const [otpReferenceId, setOtpReferenceId] = useState<string | null>(null)
  const [verifiedAadhaarData, setVerifiedAadhaarData] = useState<any>(null)

  useEffect(() => {
    if (!data.hasAgreed) {
      router.push('/')
    }
  }, [data.hasAgreed, router])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required'
    if (!formData.panNumber.trim()) newErrors.panNumber = 'PAN number is required'
    else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber)) {
      newErrors.panNumber = 'Invalid PAN format (e.g., ABCDE1234F)'
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required'
    if (!formData.city.trim()) newErrors.city = 'City is required'
    if (!formData.state.trim()) newErrors.state = 'State is required'
    if (!formData.date.trim()) newErrors.date = 'Date is required'
    if (!formData.jurisdiction.trim()) newErrors.jurisdiction = 'Jurisdiction is required'
    if (!formData.place.trim()) newErrors.place = 'Place is required'
    if (!formData.aadhaarNumber.trim()) newErrors.aadhaarNumber = 'Aadhaar number is required'
    else if (!/^\d{12}$/.test(formData.aadhaarNumber)) {
      newErrors.aadhaarNumber = 'Aadhaar number must be 12 digits'
    }
    if (!formData.aadhaarVerified) newErrors.aadhaarVerified = 'Aadhaar verification is required'
    if (!formData.signatureName.trim()) newErrors.signatureName = 'Signature name is required'
    if (!formData.signatureDataUrl) newErrors.signatureDataUrl = 'Signature is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    
    if (validateForm()) {
      updateData(formData)
      router.push('/preview')
    }
  }

  const handleChange = (field: string, value: string): void => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleSendOtp = async (): Promise<void> => {
    // Clear previous states
    setOtpError('')
    setVerificationNote('')
    
    // Validate Aadhaar number
    if (!/^\d{12}$/.test(formData.aadhaarNumber)) {
      setErrors(prev => ({ ...prev, aadhaarNumber: 'Aadhaar number must be 12 digits' }))
      return
    }
    
    setOtpLoading(true)
    
    try {
      const response = await fetch('/api/aadhaar/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aadhaarNumber: formData.aadhaarNumber }),
      })
      
      const result = await response.json()
      
      // Log only non-sensitive info for debugging
      if (result.referenceId) {
        console.log('Aadhaar OTP sent. Reference ID:', result.referenceId)
      } else {
        console.log('Aadhaar OTP send response received (no reference ID).')
      }
      
      if (!result.success) {
        // Handle specific error cases
        const errorMessage = result.message || result.error || 'Failed to send OTP'
        
        if (errorMessage.toLowerCase().includes('not linked')) {
          setOtpError('Aadhaar number is not linked to a mobile number')
        } else if (errorMessage.toLowerCase().includes('invalid')) {
          setOtpError('Invalid Aadhaar number. Please check and try again.')
        } else if (result.details?.message) {
          setOtpError(result.details.message)
        } else {
          setOtpError(errorMessage)
        }
        return
      }
      
      // Check for reference ID
      if (!result.referenceId) {
        console.error('No reference ID in response:', result)
        setOtpError('Failed to get reference ID. Please try again.')
        return
      }
      
      // Success
      setOtpSent(true)
      setOtpCode('')
      setOtpReferenceId(result.referenceId)
      setVerificationNote(`OTP sent successfully to registered mobile number (Ref: ${result.referenceId.substring(0, 8)}...)`)
      
    } catch (error) {
      console.error('Send OTP Error:', error)
      setOtpError('Network error. Please check your connection and try again.')
    } finally {
      setOtpLoading(false)
    }
  }

  const handleVerifyOtp = async (): Promise<void> => {
    // Clear previous states
    setOtpError('')
    setVerificationNote('')
    
    // Validate OTP sent
    if (!otpSent) {
      setOtpError('Please send OTP first')
      return
    }
    
    // Validate OTP format
    if (!/^\d{6}$/.test(otpCode)) {
      setOtpError('Enter a valid 6-digit OTP')
      return
    }
    
    // Validate reference ID
    if (!otpReferenceId) {
      setOtpError('No reference ID found. Please send OTP again.')
      return
    }
    
    setVerifyLoading(true)
    
    try {
      const response = await fetch('/api/aadhaar/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          otp: otpCode,
          referenceId: otpReferenceId,
        }),
      })
      
      const result = await response.json()
      
      console.log('Verify OTP Response:', result) // Debug log
      
      if (!result.success || !result.verified) {
        // Handle specific error cases
        const errorMessage = result.message || result.error || 'OTP verification failed'
        
        if (errorMessage.toLowerCase().includes('invalid otp')) {
          setOtpError('Invalid OTP. Please check and try again.')
        } else if (errorMessage.toLowerCase().includes('expired')) {
          setOtpError('OTP has expired. Please request a new one.')
          setOtpSent(false)
          setOtpReferenceId(null)
        } else if (result.details?.message) {
          setOtpError(result.details.message)
        } else {
          setOtpError(errorMessage)
        }
        return
      }
      
      // Success - extract Aadhaar data if available
      const aadhaarData = result.aadhaarData || {}
      setVerifiedAadhaarData(aadhaarData)
      
      // Update form with verified name if available
      if (aadhaarData.name && !formData.fullName) {
        setFormData(prev => ({ ...prev, fullName: aadhaarData.name }))
      }
      
      // Mark as verified
      setFormData(prev => ({ ...prev, aadhaarVerified: true, aadhaarVerifiedAt: new Date().toISOString() }))
      if (errors.aadhaarVerified) {
        setErrors(prev => ({ ...prev, aadhaarVerified: '' }))
      }
      
      setVerificationNote(`✓ Aadhaar verified successfully${aadhaarData.name ? ` - ${aadhaarData.name}` : ''}`)
      
      // Clear OTP fields
      setOtpCode('')
      setOtpSent(false)
      setOtpReferenceId(null)
      
    } catch (error) {
      console.error('Verify OTP Error:', error)
      setOtpError('Network error. Please check your connection and try again.')
    } finally {
      setVerifyLoading(false)
    }
  }

  const handleResendOtp = async (): Promise<void> => {
    setOtpCode('')
    setOtpSent(false)
    setOtpReferenceId(null)
    await handleSendOtp()
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Agreement
        </Button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-lime-100 mb-4">
            <User className="w-8 h-8 text-lime-600" />
          </div>
          <h1 className="text-5xl font-bold mb-3 text-slate-900">Partner Details</h1>
          <p className="text-slate-600 text-lg">Complete your information to continue</p>
        </div>

        <Stepper 
          currentStep={2} 
          totalSteps={4}
          steps={['Read Agreement', 'Enter Details', 'Preview', 'Submit']}
        />
      </motion.div>

      <AgreementCard>
        <AgreementHeader>
          <h2 className="text-2xl font-semibold text-slate-900">Your Information</h2>
        </AgreementHeader>

        <form onSubmit={handleSubmit}>
          <AgreementBody className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Personal Information</h3>
              <div className="space-y-4">
                <FormInput
                  label="Full Name"
                  value={formData.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  error={errors.fullName}
                  placeholder="Enter your full name"
                  required
                />
                <FormInput
                  label="PAN Number"
                  value={formData.panNumber}
                  onChange={(e) => handleChange('panNumber', e.target.value.toUpperCase())}
                  error={errors.panNumber}
                  placeholder="e.g., ABCDE1234F"
                  required
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Address Information</h3>
              <div className="space-y-4">
                <FormTextarea
                  label="Address"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  error={errors.address}
                  placeholder="Enter your complete address"
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormInput
                    label="City"
                    value={formData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    error={errors.city}
                    placeholder="Enter city"
                    required
                  />
                  <FormInput
                    label="State"
                    value={formData.state}
                    onChange={(e) => handleChange('state', e.target.value)}
                    error={errors.state}
                    placeholder="Enter state"
                    required
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Legal Information</h3>
              <div className="space-y-4">
                <FormInput
                  label="Agreement Date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  error={errors.date}
                  required
                />
                <FormInput
                  label="Jurisdiction"
                  value={formData.jurisdiction}
                  onChange={(e) => handleChange('jurisdiction', e.target.value)}
                  error={errors.jurisdiction}
                  placeholder="Enter jurisdiction"
                  required
                />
                <FormInput
                  label="Place of Signing"
                  value={formData.place}
                  onChange={(e) => handleChange('place', e.target.value)}
                  error={errors.place}
                  placeholder="e.g., Navi Mumbai"
                  required
                />
                <FormInput
                  label="Signature Name"
                  value={formData.signatureName}
                  onChange={(e) => handleChange('signatureName', e.target.value)}
                  error={errors.signatureName}
                  placeholder="Enter signature name"
                  required
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Aadhaar Verification</h3>
              <div className="space-y-4">
                {!formData.aadhaarVerified ? (
                  <>
                    <FormInput
                      label="Aadhaar Number"
                      value={formData.aadhaarNumber}
                      onChange={(e) => {
                        const cleanValue = e.target.value.replace(/\D/g, '').slice(0, 12)
                        handleChange('aadhaarNumber', cleanValue)
                        // Reset verification if number changes
                        if (formData.aadhaarVerified) {
                          setFormData(prev => ({ ...prev, aadhaarVerified: false }))
                        }
                        // Reset OTP state if number changes
                        if (otpSent || otpReferenceId) {
                          setOtpSent(false)
                          setOtpReferenceId(null)
                          setOtpCode('')
                          setOtpError('')
                          setVerificationNote('')
                        }
                      }}
                      error={errors.aadhaarNumber}
                      placeholder="Enter 12-digit Aadhaar number"
                      inputMode="numeric"
                      required
                      disabled={otpLoading || verifyLoading}
                    />
                    
                    {/* OTP Section - Only show after OTP is sent */}
                    {otpSent && (
                      <div className="space-y-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-start gap-2">
                          <div className="flex-1">
                            <FormInput
                              label="Enter OTP"
                              value={otpCode}
                              onChange={(e) => {
                                const cleanValue = e.target.value.replace(/\D/g, '').slice(0, 6)
                                setOtpCode(cleanValue)
                                setOtpError('') // Clear error when user types
                              }}
                              placeholder="6-digit OTP"
                              inputMode="numeric"
                              maxLength={6}
                              disabled={verifyLoading}
                            />
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleResendOtp}
                            className="mt-6"
                            disabled={otpLoading || verifyLoading}
                            size="sm"
                          >
                            Resend
                          </Button>
                        </div>
                        
                        <Button
                          type="button"
                          onClick={handleVerifyOtp}
                          disabled={otpCode.length !== 6 || verifyLoading}
                          className="w-full"
                        >
                          {verifyLoading ? (
                            <>
                              <span className="inline-block animate-spin mr-2">⟳</span>
                              Verifying...
                            </>
                          ) : (
                            'Verify OTP'
                          )}
                        </Button>
                        
                        <p className="text-xs text-slate-600 text-center">
                          OTP valid for 10 minutes
                        </p>
                      </div>
                    )}
                    
                    {/* Send OTP Button - Only show if OTP not sent */}
                    {!otpSent && (
                      <Button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={formData.aadhaarNumber.length !== 12 || otpLoading}
                        className="w-full"
                      >
                        {otpLoading ? (
                          <>
                            <span className="inline-block animate-spin mr-2">⟳</span>
                            Sending OTP...
                          </>
                        ) : (
                          'Send OTP to Registered Mobile'
                        )}
                      </Button>
                    )}
                    
                    {/* Success/Info Messages */}
                    {verificationNote && !otpError && (
                      <div className="flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-blue-700">
                        <span className="text-lg">ℹ️</span>
                        <p className="text-sm">{verificationNote}</p>
                      </div>
                    )}
                    
                    {/* Error Messages */}
                    {otpError && (
                      <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                        <span className="text-lg">⚠️</span>
                        <p className="text-sm">{otpError}</p>
                      </div>
                    )}
                    
                    {/* Validation Error */}
                    {errors.aadhaarVerified && (
                      <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-amber-700">
                        <span className="text-lg">⚠️</span>
                        <p className="text-sm font-medium">{errors.aadhaarVerified}</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold">✓</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Aadhaar verified successfully</p>
                        {verifiedAadhaarData?.name && (
                          <p className="text-xs text-emerald-600 mt-0.5">
                            Name: {verifiedAadhaarData.name}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, aadhaarVerified: false }))
                        setOtpSent(false)
                        setOtpReferenceId(null)
                        setOtpCode('')
                        setOtpError('')
                        setVerificationNote('')
                        setVerifiedAadhaarData(null)
                      }}
                      className="text-xs text-slate-500 hover:text-slate-700 underline"
                    >
                      Verify a different Aadhaar number
                    </button>
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-lg font-semibold text-slate-900 mb-4">E-Signature</h3>
              <SignaturePad
                value={formData.signatureDataUrl}
                onChange={(value) => handleChange('signatureDataUrl', value)}
                disabled={!formData.aadhaarVerified}
                disabledMessage="Verify Aadhaar to unlock signature"
              />
              {errors.signatureDataUrl && (
                <p className="text-sm text-red-600 font-medium mt-2">{errors.signatureDataUrl}</p>
              )}
            </motion.div>

          </AgreementBody>

          <AgreementFooter>
            <div className="flex gap-4 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/')}
              >
                Cancel
              </Button>
              <Button type="submit">
                Continue to Preview
              </Button>
            </div>
          </AgreementFooter>
        </form>
      </AgreementCard>
    </div>
  )
}
