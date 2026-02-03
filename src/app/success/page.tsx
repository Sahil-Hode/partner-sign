"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle, Download } from 'lucide-react'
import { AgreementCard, AgreementBody } from '@/components/AgreementCard'
import { Button } from '@/components/Button'
import { useAgreement } from '@/context/AgreementContext'

export default function SuccessPage() {
  const router = useRouter()
  const { data, resetData } = useAgreement()

  useEffect(() => {
    if (!data.fullName) {
      router.push('/details')
    }
  }, [data.fullName, router])

  const handleStartAgain = (): void => {
    resetData()
    router.push('/')
  }

  const openBase64Download = (base64: string): void => {
    const link = document.createElement('a')
    link.href = base64
    link.download = `Affiliate_Partner_Agreement_${data.fullName.replace(/\s+/g, '_')}.pdf`
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  const handleDownload = async (): Promise<void> => {
    try {
      if (data.downloadLink) {
        window.open(data.downloadLink, '_blank')
        return
      }

      if (data.downloadBase64) {
        openBase64Download(data.downloadBase64)
        return
      }

      const response = await fetch('/api/agreements/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to generate agreement')
      }

      const result = await response.json()

      if (result.success && result.downloadLink) {
        window.open(result.downloadLink, '_blank')
        return
      }

      if (result.success && result.downloadBase64) {
        openBase64Download(result.downloadBase64)
        return
      }

      alert('Failed to download agreement. Please try again.')
    } catch (error) {
      console.error('Download error:', error)
      alert('Error downloading agreement. Please try again.')
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', duration: 0.6 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-emerald-100 mb-6">
          <CheckCircle className="w-12 h-12 text-emerald-600" />
        </div>
        <h1 className="text-4xl font-bold mb-3 text-slate-900">Agreement Submitted Successfully!</h1>
        <p className="text-slate-600 text-lg">Your agreement has been recorded.</p>
      </motion.div>

      <AgreementCard>
        <AgreementBody>
          <div className="space-y-3">
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
            {data.uploadWarning && (
              <p className="text-sm text-amber-700">{data.uploadWarning}</p>
            )}
          </div>

          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Button variant="secondary" onClick={handleDownload}>
              <Download className="w-4 h-4" />
              Download Agreement
            </Button>
            <Button onClick={handleStartAgain}>Start New Agreement</Button>
          </div>
        </AgreementBody>
      </AgreementCard>
    </div>
  )
}
