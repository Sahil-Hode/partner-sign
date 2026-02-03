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
    signatureName: data.signatureName,
    signatureDataUrl: data.signatureDataUrl || '',
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})

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
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-lg font-semibold text-slate-900 mb-4">E-Signature</h3>
              <SignaturePad
                value={formData.signatureDataUrl}
                onChange={(value) => handleChange('signatureDataUrl', value)}
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
