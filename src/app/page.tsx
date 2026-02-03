"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FileText } from 'lucide-react'
import { AgreementCard, AgreementHeader, AgreementBody, AgreementFooter } from '@/components/AgreementCard'
import { Button } from '@/components/Button'
import { useAgreement } from '@/context/AgreementContext'

const AGREEMENT_TEXT = `AFFILIATE PARTNER AGREEMENT

This Affiliate Partner Agreement (“Agreement”) is entered into on this 28th day of January 2026, by and between:
Yours Faithfully Advisors LLP / AuditVeda (“Company”), having PAN No- AABFY7975M at its principal place of business at 207, 2nd Floor Building No 1 Millenium Business Park Sector-2 Mahape Navi Mumbai 40710,
AND
Affiliate Manager (“Partner”), having PAN No: ______________________ residing at ______________________
The Company and the Partner shall collectively be referred to as the “Parties” and individually as a “Party.”

1. PURPOSE OF THE AGREEMENT
The purpose of this Agreement is to appoint the Partner as an Independent Affiliate Manager to onboard, manage, and retain audit professionals, freelancers, and field candidates (“Candidates”) onto the AuditVeda platform and ecosystem. This Agreement is structured to:
    • Protect the Partner’s professional network and candidate relationships
    • Ensure strict non-disclosure and non-circumvention of the Partner’s network
    • Provide confidence in the AuditVeda App as a transparent, tech-enabled audit execution and payout platform
    • Enable long-term, performance-linked lifetime income opportunities for the Partner

2. APPOINTMENT & SCOPE
2.1 The Company appoints the Partner as a Non-Exclusive Affiliate Manager to: - Identify, onboard, and activate Candidates on the AuditVeda App - Support Candidates in understanding audit workflows, checklists, reporting, and payouts - Act as a relationship manager to drive retention and engagement
2.2 The Partner shall operate as an independent contractor and nothing herein shall be deemed to create an employer-employee, agency, or partnership relationship.

3. NON-DISCLOSURE & NETWORK PROTECTION
3.1 Ownership of Network
All Candidates introduced or onboarded by the Partner shall be deemed part of the Partner’s protected professional network.
3.2 Non-Circumvention
The Company agrees that it shall not, directly or indirectly: - Bypass the Partner to engage, reassign, or commercially negotiate with the Partner’s onboarded Candidates - Reallocate such Candidates to other partners without written consent of the Partner
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
As long as the Candidate continues to execute audits through AuditVeda under the Partner’s network, the Partner’s rights over fee distribution and network control shall continue, irrespective of expansion into new audit service lines.

6. RETENTION & SUPPORT RESPONSIBILITIES
The Partner agrees to: - Encourage ethical conduct and compliance by Candidates - Assist Candidates with onboarding, basic app usage, and escalation support - Promote long-term association rather than short-term engagements

7. NON-SOLICITATION
During the term of this Agreement and for a period of 12 months post-termination, neither Party shall solicit or induce the other Party’s Candidates, partners, or employees in a manner detrimental to the original introducer.

8. TERM & TERMINATION
8.1 This Agreement shall commence on the Effective Date and remain valid unless terminated by either Party with 30 days’ written notice.
8.2 Termination shall not affect: - Accrued payouts - Network protection and non-disclosure obligations

9. COMPLIANCE & ETHICAL STANDARDS
The Partner agrees to: - Comply with all applicable laws and regulations - Avoid misrepresentation of audit scope, payouts, or authority - Uphold the reputation and integrity of the Company

10. GOVERNING LAW & JURISDICTION
This Agreement shall be governed by and construed in accordance with the laws of India, and courts at __________ shall have exclusive jurisdiction.

11. ENTIRE AGREEMENT
This Agreement constitutes the entire understanding between the Parties and supersedes all prior discussions or understandings, whether written or oral.

IN WITNESS WHEREOF
The Parties have executed this Agreement on the date first written above.
For the Company
Name: _______________________
Designation: __________________
Signature: ____________________
Date: ________________________
For the Partner
Name: _______________________
Signature: ____________________
Date: ________________________`

export default function HomePage(): JSX.Element {
  const router = useRouter()
  const { updateData } = useAgreement()
  const [hasAgreed, setHasAgreed] = useState(false)

  const handleContinue = (): void => {
    updateData({ hasAgreed: true })
    router.push('/details')
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
          <FileText className="w-8 h-8 text-slate-900" />
        </div>
        <h1 className="text-4xl font-bold mb-3 text-slate-900">Affiliate Partner Agreement</h1>
        <p className="text-slate-600 text-lg">Please read the agreement carefully before proceeding</p>
      </motion.div>

      <AgreementCard>
        <AgreementHeader>
          <h2 className="text-2xl font-semibold text-slate-900">Agreement Terms & Conditions</h2>
        </AgreementHeader>

        <AgreementBody className="max-h-[500px] overflow-y-auto">
          <div className="prose prose-slate max-w-none">
            {AGREEMENT_TEXT.split('\n\n').map((paragraph, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.02 }}
                className="mb-4 text-slate-800 leading-relaxed whitespace-pre-line"
              >
                {paragraph}
              </motion.p>
            ))}
          </div>
        </AgreementBody>

        <AgreementFooter>
          <label className="flex items-start gap-3 cursor-pointer mb-6">
            <input
              type="checkbox"
              checked={hasAgreed}
              onChange={(e) => setHasAgreed(e.target.checked)}
              className="mt-1 w-5 h-5"
            />
            <span className="text-slate-900 font-medium">
              I have read and agree to the terms and conditions of this Affiliate Partner Agreement
            </span>
          </label>

          <Button onClick={handleContinue} disabled={!hasAgreed} size="lg" className="w-full">
            Continue to Partner Details
          </Button>
        </AgreementFooter>
      </AgreementCard>
    </div>
  )
}
