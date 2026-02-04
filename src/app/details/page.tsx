"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { User, ArrowLeft } from 'lucide-react'
import { AgreementCard, AgreementHeader, AgreementBody, AgreementFooter } from '@/components/AgreementCard'
import { FormInput, FormTextarea } from '@/components/FormInput'
import { SignaturePad } from '@/components/SignaturePad'
import { Button } from '@/components/Button'
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
    signatureName: data.signatureName,
    signatureDataUrl: data.signatureDataUrl || '',
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [otpSent, setOtpSent] = useState(false)
  const [otpCode, setOtpCode] = useState('')
  const [otpError, setOtpError] = useState('')
  const [verificationNote, setVerificationNote] = useState('')

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

  const handleSendOtp = (): void => {
    if (!/^\d{12}$/.test(formData.aadhaarNumber)) {
      setErrors(prev => ({ ...prev, aadhaarNumber: 'Aadhaar number must be 12 digits' }))
      setVerificationNote('')
      return
    }
    setOtpSent(true)
    setOtpCode('')
    setOtpError('')
    setVerificationNote('OTP sent (UI-only). Enter any 6-digit code to verify.')
  }

  const handleVerifyOtp = (): void => {
    if (!otpSent) {
      setOtpError('Please send OTP first')
      return
    }
    if (!/^\d{6}$/.test(otpCode)) {
      setOtpError('Enter a valid 6-digit OTP')
      return
    }
    setOtpError('')
    setVerificationNote('Aadhaar verified successfully')
    setFormData(prev => ({ ...prev, aadhaarVerified: true }))
    if (errors.aadhaarVerified) {
      setErrors(prev => ({ ...prev, aadhaarVerified: '' }))
    }
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
                  onChange={(e) => handleChange('panNumber', e.target.value)}
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
                        handleChange('aadhaarNumber', e.target.value.replace(/\D/g, '').slice(0, 12))
                        if (formData.aadhaarVerified) {
                          setFormData(prev => ({ ...prev, aadhaarVerified: false }))
                        }
                      }}
                      error={errors.aadhaarNumber}
                      placeholder="Enter 12-digit Aadhaar number"
                      inputMode="numeric"
                      required
                    />
                    <div className="grid grid-cols-3 gap-4 items-end">
                      <div className="col-span-2">
                        <FormInput
                          label="OTP"
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          error={otpError}
                          placeholder="Enter 6-digit OTP"
                          inputMode="numeric"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleSendOtp}
                        className="h-10 mt-6"
                      >
                        Send OTP
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <Button
                        type="button"
                        onClick={handleVerifyOtp}
                        disabled={!otpSent}
                      >
                        Verify OTP
                      </Button>
                      <span className="text-sm text-slate-500">Not verified</span>
                    </div>
                    {verificationNote && (
                      <p className="text-sm text-slate-600">{verificationNote}</p>
                    )}
                    {errors.aadhaarVerified && (
                      <p className="text-sm text-red-600 font-medium">{errors.aadhaarVerified}</p>
                    )}
                  </>
                ) : (
                  <div className="flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-sm">✓</span>
                    <span className="text-sm font-medium">Aadhaar verified successfully</span>
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
