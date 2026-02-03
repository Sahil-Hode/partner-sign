"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Send } from 'lucide-react'
import { AgreementCard, AgreementHeader, AgreementBody, AgreementFooter } from '@/components/AgreementCard'
import { Button } from '@/components/Button'
import { Stepper } from '@/components/Stepper'
import { useAgreement } from '@/context/AgreementContext'

export default function SubmitPage(): JSX.Element {
  const router = useRouter()
  const { data, updateData } = useAgreement()
  const [confirmed, setConfirmed] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!data.fullName) {
      router.push('/details')
    }
  }, [data.fullName, router])

  const handleSubmit = async (): Promise<void> => {
    if (!confirmed) return
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/agreements/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to process agreement')
      }

      const result = await response.json()

      if (result.success) {
        updateData({
          downloadLink: result.downloadLink || '',
          downloadBase64: result.downloadBase64 || '',
          uploadWarning: result.uploadWarning || '',
        })
        setTimeout(() => router.push('/success'), 1200)
        return
      }

      alert('Error submitting agreement. Please try again.')
    } catch (error) {
      console.error('Submission error:', error)
      alert('Error submitting agreement. Please try again.')
    } finally {
      setIsSubmitting(false)
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
          onClick={() => router.push('/preview')}
          className="mb-6"
          disabled={isSubmitting}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Preview
        </Button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
            <Send className="w-8 h-8 text-slate-900" />
          </div>
          <h1 className="text-4xl font-bold mb-3 text-slate-900">Final Review & Submit</h1>
          <p className="text-slate-600 text-lg">Confirm your details before submission</p>
        </div>

        <Stepper
          currentStep={4}
          totalSteps={4}
          steps={['Read Agreement', 'Enter Details', 'Preview', 'Submit']}
        />
      </motion.div>

      <AgreementCard>
        <AgreementHeader>
          <h2 className="text-2xl font-semibold text-slate-900">Ready to Submit</h2>
        </AgreementHeader>

        <AgreementBody>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-500">Partner Name</p>
              <p className="text-base font-semibold text-slate-900">{data.fullName}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">PAN Number</p>
              <p className="text-base font-semibold text-slate-900">{data.panNumber}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Agreement Date</p>
              <p className="text-base font-semibold text-slate-900">{data.date}</p>
            </div>
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="mt-1 w-5 h-5"
                disabled={isSubmitting}
              />
              <span className="text-sm text-slate-700">
                I confirm that all information is accurate and I authorize submission of this agreement.
              </span>
            </label>
          </div>
        </AgreementBody>

        <AgreementFooter>
          <div className="flex gap-4 justify-end">
            <Button variant="outline" onClick={() => router.push('/preview')} disabled={isSubmitting}>
              Back to Preview
            </Button>
            <Button disabled={!confirmed || isSubmitting} onClick={handleSubmit}>
              {isSubmitting ? 'Submitting...' : 'Submit Agreement'}
            </Button>
          </div>
        </AgreementFooter>
      </AgreementCard>
    </div>
  )
}
