"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FileCheck, ArrowLeft } from 'lucide-react'
import { AgreementCard, AgreementHeader, AgreementBody, AgreementFooter } from '@/components/AgreementCard'
import { Button } from '@/components/Button'
import { Stepper } from '@/components/Stepper'
import { useAgreement } from '@/context/AgreementContext'

export default function PreviewPage(): JSX.Element {
  const router = useRouter()
  const { data } = useAgreement()

  const companyName = 'Yours Faithfully Advisors LLP / AuditVeda'
  const companyPan = 'AABFY7975M'
  const companyAddress = '207, 2nd Floor Building No 1 Millenium Business Park Sector-2 Mahape Navi Mumbai 40710'

  useEffect(() => {
    if (!data.fullName) {
      router.push('/details')
    }
  }, [data.fullName, router])

  const partnerAddress = [data.address, data.city, data.state].filter(Boolean).join(', ')
  const partnerPanDisplay = data.panNumber || '______________________'
  const partnerAddressDisplay = partnerAddress || '______________________'
  const signatureNameDisplay = data.signatureName || '_____________________'
  const effectiveDate = data.date || new Date().toISOString().split('T')[0]
  const formatAgreementDate = (value: string): string => {
    const dateValue = new Date(value)
    const day = dateValue.getDate()
    const month = dateValue.toLocaleDateString('en-US', { month: 'long' })
    const year = dateValue.getFullYear()
    const suffix = (num: number): string => {
      if (num % 100 >= 11 && num % 100 <= 13) return 'th'
      switch (num % 10) {
        case 1:
          return 'st'
        case 2:
          return 'nd'
        case 3:
          return 'rd'
        default:
          return 'th'
      }
    }
    return `${day}${suffix(day)} day of ${month} ${year}`
  }
  const signatureDateDisplay = formatAgreementDate(effectiveDate)

  const agreementText = `1. PURPOSE OF THE AGREEMENT
The purpose of this Agreement is to appoint the Partner as an Independent Affiliate Manager to onboard, manage, and retain audit professionals, freelancers, and field candidates ("Candidates") onto the AuditVeda platform and ecosystem. This Agreement is structured to:
    • Protect the Partner's professional network and candidate relationships
    • Ensure strict non-disclosure and non-circumvention of the Partner's network
    • Provide confidence in the AuditVeda App as a transparent, tech-enabled audit execution and payout platform
    • Enable long-term, performance-linked lifetime income opportunities for the Partner

2. APPOINTMENT & SCOPE
2.1 The Company appoints the Partner as a Non-Exclusive Affiliate Manager to: - Identify, onboard, and activate Candidates on the AuditVeda App - Support Candidates in understanding audit workflows, checklists, reporting, and payouts - Act as a relationship manager to drive retention and engagement
2.2 The Partner shall operate as an independent contractor and nothing herein shall be deemed to create an employer-employee, agency, or partnership relationship.

3. NON-DISCLOSURE & NETWORK PROTECTION
3.1 Ownership of Network
All Candidates introduced or onboarded by the Partner shall be deemed part of the Partner's protected professional network.
3.2 Non-Circumvention
The Company agrees that it shall not, directly or indirectly: - Bypass the Partner to engage, reassign, or commercially negotiate with the Partner's onboarded Candidates - Reallocate such Candidates to other partners without written consent of the Partner
3.3 Confidentiality
Both Parties agree to maintain strict confidentiality of: - Candidate data, contact details, performance metrics - Commercial terms, incentives, payouts, and internal processes
This obligation shall survive termination of this Agreement.

4. AUDITVEDA APP – TRANSPARENCY & VALUE ASSURANCE
4.1 The Company confirms that AuditVeda is a proprietary, technology-enabled audit platform designed to provide: - Transparent audit allocation and completion tracking - Digital checklists and SOP-based audits - Real-time status updates and dashboards - Clear, traceable payout mechanisms
4.2 The Partner may represent AuditVeda to Candidates as: - A fair and transparent audit execution platform - A system-driven alternative to manual, opaque audit processes - A long-term engagement ecosystem, not just a gig-based model

5. AUDIT FEE DISTRIBUTION MODEL
5.1 Manager-Controlled Distribution
The Partner shall have complete control and authority over the distribution of audit fees among Candidates and any appointed sub-managers within their network.
5.2 Consent-Based Fee Structure
Each Candidate, upon onboarding to the AuditVeda App, shall provide explicit consent confirming: - The agreed per-day audit fee - The distribution mechanism as decided by the Partner or sub-manager
This consent-based model mirrors the historical offline audit engagement practice followed by the Parties and ensures continuity, transparency, and trust.
5.3 Platform Facilitation Role
AuditVeda shall act solely as a technology and facilitation platform to record, track, and execute audit assignments and payouts based on the Partner-approved fee structure.
5.4 No Direct Interference
The Company shall not interfere with, alter, or override the fee distribution agreed between the Partner, sub-manager, and Candidates, provided such arrangements comply with applicable laws.
5.5 Continuity of Earnings
As long as the Candidate continues to execute audits through AuditVeda under the Partner's network, the Partner's rights over fee distribution and network control shall continue, irrespective of expansion into new audit service lines.

6. RETENTION & SUPPORT RESPONSIBILITIES
The Partner agrees to: - Encourage ethical conduct and compliance by Candidates - Assist Candidates with onboarding, basic app usage, and escalation support - Promote long-term association rather than short-term engagements

7. NON-SOLICITATION
During the term of this Agreement and for a period of 12 months post-termination, neither Party shall solicit or induce the other Party's Candidates, partners, or employees in a manner detrimental to the original introducer.

8. TERM & TERMINATION
8.1 This Agreement shall commence on the Effective Date and remain valid unless terminated by either Party with 30 days' written notice.
8.2 Termination shall not affect: - Accrued payouts - Network protection and non-disclosure obligations

9. COMPLIANCE & ETHICAL STANDARDS
The Partner agrees to: - Comply with all applicable laws and regulations - Avoid misrepresentation of audit scope, payouts, or authority - Uphold the reputation and integrity of the Company

10. GOVERNING LAW & JURISDICTION
This Agreement shall be governed by and construed in accordance with the laws of India, and courts at ${data.jurisdiction || '______________________'} shall have exclusive jurisdiction.

11. ENTIRE AGREEMENT
This Agreement constitutes the entire understanding between the Parties and supersedes all prior discussions or understandings, whether written or oral.`

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
          onClick={() => router.push('/details')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Details
        </Button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
            <FileCheck className="w-8 h-8 text-slate-900" />
          </div>
          <h1 className="text-5xl font-bold mb-3 text-slate-900">Preview Agreement</h1>
          <p className="text-slate-600 text-lg">Review your personalized agreement document</p>
        </div>

        <Stepper
          currentStep={3}
          totalSteps={4}
          steps={['Read Agreement', 'Enter Details', 'Preview', 'Submit']}
        />
      </motion.div>

      <AgreementCard>
        <AgreementHeader>
          <h2 className="text-2xl font-semibold text-slate-900">Affiliate Partner Agreement</h2>
        </AgreementHeader>

        <AgreementBody className="max-h-[600px] overflow-y-auto relative">
          <div className="prose prose-slate max-w-none relative z-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-center text-3xl font-bold mb-4 text-slate-900">
                AFFILIATE PARTNER AGREEMENT
              </h1>
              <p className="text-center text-sm text-slate-500 mb-8">
                Effective Date: {signatureDateDisplay}
              </p>

              <h2 className="text-xl font-bold mt-8 mb-4 text-slate-900">PARTY DETAILS</h2>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6 space-y-2">
                <p className="text-sm text-slate-900">Company: {companyName}</p>
                <p className="text-sm text-slate-900">Company PAN: {companyPan}</p>
                <p className="text-sm text-slate-900">Company Address: {companyAddress}</p>
                <p className="text-sm text-slate-900">
                  Partner Name:{' '}
                  <span className="bg-yellow-100 px-2 py-0.5 rounded">{data.fullName}</span>
                </p>
                <p className="text-sm text-slate-900">
                  Partner PAN:{' '}
                  <span className="bg-yellow-100 px-2 py-0.5 rounded">{partnerPanDisplay}</span>
                </p>
                <p className="text-sm text-slate-900">
                  Partner Address:{' '}
                  <span className="bg-yellow-100 px-2 py-0.5 rounded">{partnerAddressDisplay}</span>
                </p>
                <p className="text-sm text-slate-900">
                  Jurisdiction:{' '}
                  <span className="bg-yellow-100 px-2 py-0.5 rounded">{data.jurisdiction}</span>
                </p>
                <p className="text-sm text-slate-900">
                  Signature Name:{' '}
                  <span className="bg-yellow-100 px-2 py-0.5 rounded">{signatureNameDisplay}</span>
                </p>
              </div>

              {agreementText.split('\n\n').map((paragraph, index) => (
                <p
                  key={index}
                  className="mb-4 text-slate-900 leading-relaxed whitespace-pre-line"
                >
                  {paragraph}
                </p>
              ))}

              <div className="mt-10 pt-6 border-t border-slate-300">
                <p className="text-slate-900 font-semibold mb-6">IN WITNESS WHEREOF</p>
                <p className="text-slate-900 mb-6">
                  The Parties have executed this Agreement on the date first written above.
                </p>

                <div className="grid grid-cols-2 gap-10">
                  <div className="space-y-1">
                    <p className="font-semibold text-slate-900">For the Company</p>
                    <p className="text-slate-900">Name: _______________________</p>
                    <p className="text-slate-900">Designation: __________________</p>
                    <p className="text-slate-900">Signature: ____________________</p>
                    <p className="text-slate-900">Date: ________________________</p>
                  </div>

                  <div className="space-y-1">
                    <p className="font-semibold text-slate-900">For the Partner</p>
                    <p className="text-slate-900">Name: {signatureNameDisplay}</p>

                    <div className="pt-2">
                      {data.signatureDataUrl ? (
                        <img
                          src={data.signatureDataUrl}
                          alt="Partner Signature"
                          className="h-20 border-b border-black"
                        />
                      ) : (
                        <p className="text-slate-900">Signature: ____________________</p>
                      )}
                    </div>

                    <p className="text-slate-900">Date: {signatureDateDisplay}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </AgreementBody>

        <AgreementFooter>
          <div className="flex gap-4 justify-end">
            <Button
              variant="outline"
              onClick={() => router.push('/details')}
            >
              Back to Edit
            </Button>
            <Button
              onClick={() => router.push('/submit')}
            >
              Continue to Submit
            </Button>
          </div>
        </AgreementFooter>
      </AgreementCard>
    </div>
  )
}
