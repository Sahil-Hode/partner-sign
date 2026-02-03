"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FileCheck, ArrowLeft } from 'lucide-react'
import { AgreementCard, AgreementHeader, AgreementBody, AgreementFooter } from '@/components/AgreementCard'
import { Button } from '@/components/Button'
import { Stepper } from '@/components/Stepper'
import { useAgreement } from '@/context/AgreementContext'

export default function PreviewPage() {
  const router = useRouter()
  const { data } = useAgreement()

  const companyName = 'Yours Faithfully Advisors LLP / AuditVeda'
  const companyPan = 'AABFY7975M'
  const companyAddress = '207, 2nd Floor, Building No. 1, Millennium Business Park, Sector-2, Mahape, Navi Mumbai 400710'

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
        case 1: return 'st'
        case 2: return 'nd'
        case 3: return 'rd'
        default: return 'th'
      }
    }
    return `${day}${suffix(day)} day of ${month} ${year}`
  }

  const signatureDateDisplay = formatAgreementDate(effectiveDate)

  // ---------------------------------------------------------------------------
  // Full Agreement Text — Version 1.0 (January 2026)
  // ---------------------------------------------------------------------------
  const agreementText = `AFFILIATE PARTNER AGREEMENT
Version 1.0 – January 2026

This Affiliate Partner Agreement ("Agreement") is entered into on this ${signatureDateDisplay}, by and between:

${companyName} ("Company"), a Limited Liability Partnership having PAN No. ${companyPan}, with its principal place of business at ${companyAddress},

AND

${signatureNameDisplay} ("Partner" or "Manager"), having PAN No: ${partnerPanDisplay} with registered/residential address at ${partnerAddressDisplay}.

The Company and the Partner shall collectively be referred to as the "Parties" and individually as a "Party."

──────────────────────────────────────

1. DEFINITIONS

In this Agreement, unless the context otherwise requires:

1.1 "Agreement" means this Affiliate Partner Agreement, including all annexures and amendments.

1.2 "Assignment" means any audit, verification, stock audit, concurrent audit, internal audit, statutory audit, certification, compliance check, physical verification, or field verification work published on the Platform by the Company or its clients.

1.3 "Candidate" means an audit professional, chartered accountant, semi-qualified chartered accountant, article assistant, audit associate, field executive, or any other professional onboarded to the Platform to perform Assignments.

1.4 "Company" means Yours Faithfully Advisors LLP / AuditVeda.

1.5 "Manager" or "Partner" means the independent affiliate partner who directly contracts with the Company under this Agreement to onboard, manage, and support Candidates and Sub-Managers.

1.6 "Network" means all Candidates and Sub-Managers onboarded by the Manager, including those onboarded through Sub-Managers, forming the Manager's professional ecosystem.

1.7 "Pin Code Territory" means the specific geographical area identified by one or more postal pin codes to which a Candidate is linked for receiving Assignment notifications and allocations.

1.8 "Platform" means the AuditVeda mobile application, web portal, and associated technology infrastructure operated by the Company.

1.9 "Sub-Manager" means a person appointed by the Manager to onboard and manage Candidates within a designated territory or pin code area, subject to the terms of this Agreement.

──────────────────────────────────────

2. PURPOSE OF THE AGREEMENT

The purpose of this Agreement is to appoint the Partner as an Independent Affiliate Manager to onboard, manage, and retain audit professionals, freelancers, and field candidates onto the AuditVeda Platform and ecosystem. This Agreement is structured to:

• Protect the Partner's professional network and candidate relationships through strict non-circumvention provisions
• Ensure strict confidentiality and data protection of the Partner's network information
• Provide confidence in the AuditVeda Platform as a transparent, tech-enabled audit execution and payout system
• Enable long-term, performance-linked income opportunities for the Partner
• Establish clear governance, quality standards, and dispute resolution mechanisms

──────────────────────────────────────

3. APPOINTMENT & SCOPE

3.1 Appointment: The Company hereby appoints the Partner as a non-exclusive Affiliate Manager to:
(a) Identify, onboard, and activate Candidates on the AuditVeda Platform;
(b) Support Candidates in understanding audit workflows, checklists, reporting, and payout mechanisms;
(c) Act as a relationship manager to drive retention, engagement, and performance improvement;
(d) Appoint Sub-Managers in accordance with Section 4 to expand territorial coverage.

3.2 Independent Contractor Status: The Partner shall operate as an independent contractor. Nothing in this Agreement shall be deemed to create an employer-employee, agency, partnership, or joint venture relationship between the Parties. The Partner is solely responsible for all applicable taxes, insurance, and statutory compliances arising from this engagement.

3.3 Non-Exclusive Engagement: This is a non-exclusive engagement. More than one manager or sub-manager may onboard candidates in the same area/region/pin code.

3.4 Territory: The Partner may operate pan-India or in specific regions as mutually agreed and recorded on the Platform. Candidates shall be linked to specific Pin Code Territories as per Section 5.

──────────────────────────────────────

4. SUB-MANAGER APPOINTMENT & HIERARCHY

4.1 Appointment Rights: The Manager may appoint Sub-Managers to onboard and manage Candidates within designated Pin Code Territories, subject to:
(a) Written notification to the Company via the Platform's Sub-Manager registration module;
(b) Sub-Manager accepting terms substantially similar to this Agreement;
(c) Completion of KYC verification by the Sub-Manager.

4.2 Hierarchy Limitation: The organizational structure shall be limited to: Manager → Sub-Manager → Candidate. No further sub-levels are permitted. Sub-Managers may not appoint additional sub-managers.

4.3 Revenue Sharing Structure: The revenue distribution for Assignments shall be as specified in Annexure B. When a Candidate is directly onboarded by the Manager (no Sub-Manager), the fee is split between Company, Manager, and Candidate. When a Candidate is onboarded through a Sub-Manager, the fee is split among Company, Manager, Sub-Manager, and Candidate as per Annexure B.

4.4 Sub-Manager Responsibilities: Sub-Managers shall:
(a) Onboard and activate Candidates within their assigned Pin Code Territories;
(b) Link Candidates to specific pin codes on the Platform;
(c) Provide first-level support, training, and troubleshooting assistance;
(d) Monitor assignment completion, quality, and Candidate performance;
(e) Ensure compliance with Platform policies and quality standards.

4.5 Manager's Liability: The Manager remains responsible and liable for all Sub-Managers and Candidates in their Network, including:
(a) Quality of work delivered by any Candidate in the Network;
(b) Compliance with Platform policies, ethical standards, and applicable laws;
(c) Any misconduct, fraud, or breach by Sub-Managers or Candidates.

──────────────────────────────────────

5. CANDIDATE ONBOARDING & TERRITORY ALLOCATION

5.1 Onboarding Process: Managers/Sub-Managers shall onboard Candidates through the Platform by:
(a) Collecting Candidate's Aadhaar;
(b) Bank details or UPI;
(c) Obtaining explicit written/digital consent from the Candidate on fee structure and engagement terms (as per Annexure A);
(d) Location.

5.2 KYC Verification:
(a) Collecting Candidate's Aadhaar;
(b) Bank details or UPI.

5.3 Pin Code Allocation: Each Candidate shall be linked to one or more Pin Code Territories on the Platform. Multiple Candidates may serve the same pin code. Candidates may update their pin code preferences via the Platform, subject to Manager/Sub-Manager approval.

5.4 Assignment Allocation Mechanism: When an Assignment is published on the Platform:
(a) All Candidates linked to the relevant pin code shall receive push notifications;
(b) Assignment details including location, scope, duration, expected deliverables, and fee shall be visible;
(c) The first Candidate to accept the Assignment shall be allocated, subject to client approval (if required);
(d) In case of simultaneous acceptance by multiple Candidates, allocation priority shall be based on: proximity, past performance rating, completion rate, or random selection. Assignment will also be allocated to one candidate as standby candidate. Standby candidate will be paid as per Annexure B.

5.5 Candidate Consent Requirements: Each Candidate must provide explicit digital consent confirming:
(a) Agreed per-assignment or per-day fee structure as decided by Manager/Sub-Manager;
(b) Understanding that they are independent contractors, not employees;
(c) Acceptance of Platform terms, data privacy policy, and Code of Conduct (Annexure C);
(d) Acknowledgment that fee distribution is controlled by Manager/Sub-Manager;
(e) Consent for collection and processing of personal data for Platform operations.

──────────────────────────────────────

6. AUDITVEDA PLATFORM – TRANSPARENCY & VALUE ASSURANCE

6.1 Platform Capabilities: The Company confirms that AuditVeda is a proprietary, technology-enabled audit platform designed to provide:
(a) Transparent assignment allocation and real-time completion tracking;
(b) Digital checklists and SOP-based audit workflows;
(c) Real-time status updates, dashboards, and performance analytics;
(d) Clear, traceable payout mechanisms with detailed statements;
(e) Geo-tagging, time-stamping, and photo verification for field assignments;
(f) Client feedback and rating system;
(g) Dispute resolution and support ticketing system.

6.2 Partner Representation: The Partner may represent AuditVeda to prospective Candidates as:
(a) A fair and transparent audit execution platform with technology-driven accountability;
(b) A system-driven alternative to manual, opaque audit assignment processes;
(c) A long-term professional engagement ecosystem, not merely a gig-based model;
(d) A platform backed by experienced CA firm promoters with domain expertise.

6.3 Platform Updates: The Company reserves the right to update Platform features, user interface, fee structures, and terms of use.

──────────────────────────────────────

7. AUDIT FEE DISTRIBUTION MODEL

7.1 Manager-Controlled Distribution: The Partner shall have complete control and authority over the distribution of audit fees among Candidates and any appointed Sub-Managers within their Network, subject to:
(a) Explicit written consent from each Candidate as per Section 5.5;
(b) Compliance with applicable minimum wage laws (if any);
(c) Fair dealing and transparency in communicating fee structure to Candidates.

7.2 Consent-Based Fee Structure: Each Candidate, upon onboarding to the Platform, shall provide explicit consent confirming:
(a) The agreed per-assignment or per-day fee payable to them;
(b) The distribution mechanism as decided by the Manager or Sub-Manager;
(c) Understanding that the Company's role is limited to facilitating payments based on Manager-approved structures.

7.3 Platform Facilitation Role: AuditVeda shall act solely as a technology and facilitation platform to:
(a) Record and track assignment completion;
(b) Calculate payouts based on Partner-approved fee structures;
(c) Execute disbursements as per payment terms in Section 8;
(d) Generate payment statements and transaction reports.

7.4 No Direct Interference: The Company shall not interfere with, alter, or override the fee distribution agreed between the Manager, Sub-Manager, and Candidates, provided such arrangements:
(a) Comply with applicable laws and regulations;
(b) Are transparently communicated and consented to by Candidates;
(c) Do not involve fraud, coercion, or unethical practices.

7.5 Continuity of Earnings: As long as a Candidate continues to execute assignments through AuditVeda under the Partner's Network, the Partner's rights over fee distribution and network control shall continue, irrespective of:
(a) Expansion into new audit service lines or geographies;
(b) Changes in Platform features or pricing;
(c) Addition of new clients or assignment types.
This lifetime earning model ensures that the Partner's initial effort in onboarding and nurturing Candidates is continuously rewarded.

──────────────────────────────────────

8. PAYMENT TERMS & FINANCIAL GOVERNANCE

8.1 Payment Flow & Timeline: Payment flow shall be as follows:
(a) Client pays the Company within agreed payment terms (typically 45–60 days from invoice date);
(b) Company processes payments to Managers, Sub-Managers, and Candidates within 7 business days;
(c) All payment transactions shall be recorded and tracked transparently on the Platform dashboard with payment IDs, dates, and status.

8.2 Invoice & Documentation: The Company shall raise invoices to clients in its own name or as per client requirements. Managers shall receive detailed payment summaries showing: Assignment ID, Client name (if not confidential), Assignment type, Location, Completion date, Total fee, Company's share, Manager's share, Payment due date, Payment status. Managers may download payment statements and tax summaries from the Platform.

8.3 GST Compliance: The Company shall charge GST to clients as per applicable law and remit to government authorities. Managers who are GST-registered must provide their GSTIN to the Company and issue tax invoices for services rendered. If Manager is GST-registered, GST shall be added to Manager's share as per applicable rates. Managers are responsible for their own GST compliance, including registration, return filing, and payment to authorities.

8.4 TDS Compliance: If the Company is required by law to deduct Tax Deducted at Source (TDS) on payments to Managers under Section 194J or any other applicable section of the Income Tax Act, 1961, it shall:
(a) Deduct TDS at the applicable rate;
(b) Provide TDS certificates (Form 16A) via the Platform within the statutory timeline;
(c) File quarterly TDS returns.

8.5 Payment Disputes: Any dispute regarding payment amounts, calculation methodology, deductions, or allocations shall be:
(a) Raised via the Platform's dispute resolution module within 7 days;
(b) Reviewed and responded to by the Company within 7 business days;
(c) Resolved through good-faith negotiation within 15 business days;
(d) Escalated to Section 18 dispute resolution if unresolved.

8.6 Withheld Payments: The Company may withhold payments or place them in escrow if:
(a) Assignment quality is disputed by the client and under investigation;
(b) Candidate, Manager, or Sub-Manager is alleged to have committed fraud or material breach;
(c) Legal or regulatory notice/order is received requiring withholding.
Withheld amounts shall be released or forfeited after resolution of the underlying issue.

8.7 Payment Method: All payments shall be made via NEFT/RTGS/IMPS to the Manager's registered bank account. Changes to bank account details must be authenticated via OTP and documented on the Platform.

──────────────────────────────────────

9. ASSIGNMENT EXECUTION & QUALITY STANDARDS

9.1 Execution Standards: All Candidates in the Manager's Network shall:
(a) Complete assignments strictly as per scope, checklists, and SOPs provided on the Platform;
(b) Adhere to professional standards, ethical guidelines, and applicable laws;
(c) Submit deliverables in specified format via the Platform;
(d) Meet deadlines unless extension is formally requested and approved;
(e) Maintain confidentiality of client information.

9.2 Platform-Based Tracking: All assignments shall be tracked via the Platform with real-time status updates. Candidates must upload geo-tagged photographs and time-stamped check-ins where required. Non-compliance may result in delayed payment verification or assignment cancellation.

9.3 Client Feedback & Rating System: Clients may provide feedback and ratings (1–5 stars). Persistent low ratings (average below 3.0 stars over 5 assignments, or below 2.5 stars over 3 assignments) may result in:
(a) Manager-led counseling and additional training;
(b) Temporary suspension from new assignments;
(c) Termination from the Platform (at Company's discretion after giving Manager opportunity to remediate).

9.4 Quality Review & Audit: The Company reserves the right to:
(a) Conduct random quality audits of completed assignments;
(b) Request revision if deliverables do not meet standards;
(c) Withhold payment pending satisfactory completion of revisions;
(d) Share quality audit findings with the Manager for corrective action.

9.5 Client Complaints & Remediation: If a client raises a complaint:
(a) The Company shall notify the Manager and Candidate within 24 hours;
(b) The Candidate must respond within 48 hours;
(c) Revision must be completed within 3–5 business days;
(d) If Candidate cannot rectify, Manager may assign another Candidate;
(e) Additional rectification costs shall be borne by original Candidate/Manager unless reimbursed by the client;
(f) Repeated complaints (3+ within 6 months) may lead to suspension or termination of the Candidate.

9.6 Professional Liability: Candidates are primarily responsible for accuracy and professional quality of their work. Managers are responsible for ensuring Candidates are adequately qualified and supervised. The Company's role is limited to facilitating assignment allocation; it is not responsible for professional errors by Candidates or Managers.

──────────────────────────────────────

10. RETENTION & SUPPORT RESPONSIBILITIES

The Partner agrees to:
• Encourage ethical conduct, professional behavior, and compliance among all Candidates and Sub-Managers
• Assist Candidates with initial onboarding, Platform navigation, and troubleshooting
• Provide or facilitate training on audit procedures, checklists, and quality standards
• Act as the first point of escalation for Candidates facing issues
• Promote long-term association and career development
• Monitor Network performance metrics and take proactive corrective measures

──────────────────────────────────────

11. NON-DISCLOSURE & NETWORK PROTECTION

11.1 Ownership of Network: All Candidates and Sub-Managers onboarded by the Partner shall be deemed part of the Partner's protected professional network. The Partner retains exclusive relationship rights.

11.2 Non-Circumvention by Company: The Company shall not:
(a) Bypass the Partner to engage with the Partner's Candidates or Sub-Managers;
(b) Reallocate Candidates to other Managers without consent;
(c) Solicit Candidates to work outside the Platform;
(d) Share Candidate contact information with third parties without consent.

11.3 Confidentiality Obligations: Both Parties agree to maintain strict confidentiality of:
(a) Candidate data and performance metrics;
(b) Commercial terms and revenue sharing mechanisms;
(c) Client information and business strategies;
(d) Proprietary Platform features and technological processes.

11.4 Survival of Confidentiality: The confidentiality and non-circumvention obligations shall survive termination indefinitely.

──────────────────────────────────────

12. DATA PROTECTION & INTELLECTUAL PROPERTY

12.1 Data Ownership: Client information and audit data remain the property of the Company and/or the client. Managers and Candidates may access data solely to perform assigned work.

12.2 Personal Data Protection: All Parties shall comply with applicable data protection laws including IT Act, 2000, DPDP Act, 2023. Parties shall:
(a) Collect data only for legitimate purposes;
(b) Implement reasonable security measures;
(c) Not share data without consent;
(d) Report data breaches immediately.

12.3 Platform Intellectual Property: The AuditVeda Platform, including software, branding, checklists, and SOPs, is the exclusive property of the Company. Managers receive a non-exclusive, non-transferable license to use the Platform solely for assignments. Reverse engineering or copying is prohibited.

12.4 Work Product Ownership: All deliverables created by Candidates shall be the property of the client or the Company. Candidates retain no rights after submission and payment.

──────────────────────────────────────

13. NON-SOLICITATION

During the term of this Agreement and for 12 months post-termination, neither Party shall:
• Solicit, induce, or encourage the other Party's Candidates, Sub-Managers, or partners to terminate their relationship
• Hire or contract with such persons in a manner detrimental to the original introducer
• Interfere with or disrupt business relationships established under this Agreement

This restriction shall not apply to general public solicitations not specifically targeted at the other Party's network.

──────────────────────────────────────

14. COMPLIANCE & ETHICAL STANDARDS

The Partner and all Network members agree to:
• Comply with all applicable laws including CA Act 1949, ICAI Code of Ethics, Income Tax Act, GST laws
• Avoid misrepresentation of audit scope, findings, payouts, or authority
• Not engage in fraud, bribery, corruption, or unethical practices
• Uphold the reputation and integrity of the Company, Platform, and audit profession
• Not discriminate based on caste, religion, gender, age, disability, or protected characteristics
• Report suspected violations to the Company immediately

──────────────────────────────────────

15. LIABILITY, INDEMNIFICATION & INSURANCE

15.1 Company's Limitation of Liability: The Company's total liability shall be limited to aggregate amounts paid to Manager in the preceding 12 months. Company is NOT liable for:
(a) Indirect, consequential, or punitive damages;
(b) Loss of business or reputation;
(c) Professional errors by Candidates/Managers;
(d) Client disputes or non-payment;
(e) Platform downtime (except as per Section 6.3);
(f) Third-party claims from Candidate work.

15.2 Manager's Indemnification: Manager shall indemnify the Company against claims arising from:
(a) Work performed by Network Candidates;
(b) Breach of Agreement or laws;
(c) Professional negligence or errors;
(d) IP infringement, fraud, or misrepresentation;
(e) Data breaches caused by Manager's actions;
(f) Violation of third-party rights.

15.3 Company's Indemnification: Company shall indemnify Manager against claims arising solely from:
(a) Platform defects or security breaches caused by Company's negligence;
(b) Material misrepresentation of Platform capabilities by Company.

15.4 Insurance Recommendation: Company recommends (but does not mandate) that Managers maintain professional indemnity insurance. For assignments above ₹50,000, Candidates may be required to have insurance.

15.5 Force Majeure: Neither Party liable for failure due to events beyond reasonable control (natural disasters, pandemics, war, government actions, internet outages, etc.).

──────────────────────────────────────

16. PLATFORM GOVERNANCE & ACCEPTABLE USE

16.1 Platform Access: Managers receive unique login credentials. Credentials are personal, confidential, and non-transferable. Managers are responsible for maintaining security.

16.2 Acceptable Use Policy: Users shall NOT:
(a) Use Platform for unlawful purposes;
(b) Upload malicious software or breach security;
(c) Impersonate others or create fake profiles;
(d) Manipulate assignment allocation or billing;
(e) Solicit clients directly to bypass Platform;
(f) Defame or disparage Company, other Managers, or Candidates;
(g) Reverse engineer Platform.

16.3 Suspension & Termination Triggers: Company may suspend/terminate access if:
(a) Manager commits fraud or ethical violations;
(b) Repeated client complaints indicate quality issues;
(c) Confidentiality or data protection breached;
(d) Legal action initiated against Manager;
(e) Platform misuse detected.

16.4 Appeals Process: If suspended:
(a) Manager notified with reasons;
(b) May appeal within 7 days with evidence;
(c) Company reviews within 15 business days;
(d) Final decision with Company, subject to Section 18 dispute resolution.

16.5 Platform Modifications: Company may update features or terms. Material adverse changes require mutual consent or opt-out option.

──────────────────────────────────────

17. TERM & TERMINATION

17.1 Commencement & Duration: This Agreement commences on the Effective Date and continues for one (1) year.

17.2 Automatic Renewal: Agreement auto-renews for successive one-year terms unless either Party gives 60 days' written notice of non-renewal.

17.3 Termination for Convenience: Either Party may terminate without cause with 30 days' written notice.

17.4 Termination for Cause: Either Party may terminate immediately if:
(a) Other Party materially breaches and fails to cure within 15 days;
(b) Other Party becomes insolvent or bankrupt;
(c) Legal/regulatory action prohibits continuation;
(d) Fraud or gross negligence proven.

17.5 Effect of Termination: Upon termination:
(a) Manager's Platform access revoked immediately;
(b) Manager entitled to payments for completed assignments;
(c) Ongoing assignments may be completed with mutual consent;
(d) Confidentiality, non-disclosure, non-circumvention obligations survive indefinitely;
(e) Non-solicitation (Section 13) remains in effect for 12 months.

17.6 Transition of Network: Upon termination:
(a) Sub-Managers and Candidates notified;
(b) Company may offer Sub-Managers option to become direct Managers;
(c) Candidates may be reassigned to other Managers, subject to their consent;
(d) Terminated Manager shall NOT contact or solicit former Network for 12 months.

──────────────────────────────────────

18. DISPUTE RESOLUTION

18.1 Good-Faith Negotiation: Any dispute shall first be attempted to be resolved through good-faith negotiations within 30 days of written notice.

18.2 Mediation: If unresolved, refer to mediation by mutually agreed mediator within next 30 days. Mediation per rules of recognized center in Mumbai/Thane.

18.3 Arbitration: If mediation fails or is not completed within 30 days, arbitration shall apply:
(a) Sole arbitrator appointed by mutual consent within 15 days, else by MCIA or Indian Council of Arbitration;
(b) Seat: Mumbai or Thane, Maharashtra;
(c) Language: English;
(d) Per Arbitration and Conciliation Act, 1996;
(e) Award final and binding;
(f) Each Party bears own costs unless arbitrator directs otherwise.

18.4 Exceptions to Arbitration: Does not apply to:
(a) Interim/injunctive relief (seek from courts);
(b) Recovery of undisputed payments;
(c) IP infringement claims.

──────────────────────────────────────

19. GOVERNING LAW & JURISDICTION

This Agreement shall be governed by the laws of India. Subject to Section 18 dispute resolution, courts at ${data.jurisdiction || 'Mumbai or Thane, Maharashtra'} shall have exclusive jurisdiction.

──────────────────────────────────────

20. ANTI-COMPETITIVE & ETHICAL CONDUCT

The Manager shall NOT:
• Engage in price-fixing or collusion with other Managers
• Misrepresent their authority or Platform's capabilities
• Offer or accept bribes, kickbacks, or inappropriate inducements
• Discriminate based on caste, religion, gender, or protected characteristics

Violations may result in immediate termination and legal action.

──────────────────────────────────────

21. NOTICES

All notices shall be:
• In writing (email or physical delivery)
• Sent to addresses in preamble (or updated via Platform)
• Deemed received: (a) If emailed, 24 hours after sending; (b) If physical, 3 days after posting

──────────────────────────────────────

22. ASSIGNMENT & TRANSFER

Manager may NOT assign or transfer this Agreement without Company's prior written consent.
Company may assign to affiliate or successor entity with notice to Manager.

──────────────────────────────────────

23. ENTIRE AGREEMENT

This Agreement constitutes the entire understanding between the Parties and supersedes all prior discussions or understandings, whether written or oral. No amendment shall be valid unless in writing and signed by both Parties. If any provision is found invalid, the remainder shall continue in full force. This Agreement may be executed in counterparts and via digital signature, which shall have the same legal effect as physical signatures.

──────────────────────────────────────

ANNEXURE A – CANDIDATE ONBOARDING FORM

This form shall be completed by each Candidate during onboarding:

1. Personal Details: Name, resume, Aadhaar, Date of Birth, Contact (Mobile/Email), Address
2. Experience: Post Graduate, Graduate, and Undergraduate
3. Fee Consent: I agree to receive ₹________ per assignment / ₹________ per day as decided by my Manager/Sub-Manager
4. Independent Contractor: I understand I am NOT an employee of Company, Manager, or Sub-Manager
5. Platform Terms: I accept the Platform Terms, Data Privacy Policy, and Code of Conduct (Annexure C)
6. Data Consent: I consent to collection and processing of my personal data for Platform operations

──────────────────────────────────────

ANNEXURE B – REVENUE SHARING STRUCTURE (SAMPLE)

Total fee for the network will be INR ____ per man day which will be divided between Manager, Sub-Manager (if applicable), and Candidate as accepted by Sub-Manager and Candidate on the Platform.

The following is an illustrative revenue sharing structure. Actual amounts shall be mutually agreed and documented on the Platform.

Scenario 1: Manager → Candidate (No Sub-Manager)

A. Candidate is employee of the Manager
Total Assignment Fee: INR 1,200 per man day
Candidate's share: INR Nil
Manager's share: INR 1,200 per man day

B. Candidate is NOT employee of the Manager
Total Assignment Fee: INR 1,200 per man day
Candidate's share: INR 700 per man day
Manager's share: INR 500 per man day

Scenario 2: Manager → Sub-Manager → Candidate

A. Candidate is employee of the Sub-Manager
Total Assignment Fee: INR 1,200 per man day
Candidate's share: INR Nil
Sub-Manager's share: INR 1,000 per man day
Manager's share: INR 200 per man day

B. Candidate is NOT employee of the Sub-Manager
Total Assignment Fee: INR 1,200 per man day
Candidate's share: INR 700 per man day
Sub-Manager's share: INR 300 per man day
Manager's share: INR 200 per man day

All payments will be made directly by the Company to Candidate, Sub-Manager, and Manager. Manager and Sub-Manager will raise monthly invoices for their portion of the professional fee.

To protect the margins of Manager, Candidates and Sub-Manager will not have access to the amount being paid to Manager and Sub-Manager. Similarly, to protect the margin of Sub-Manager, the Manager will not have access to the amount being paid to Candidates onboarded by Sub-Managers. No Manager or Sub-Manager will have access to amounts being paid to other Managers and Sub-Managers.

──────────────────────────────────────

ANNEXURE C – CODE OF CONDUCT

All Managers, Sub-Managers, and Candidates shall adhere to the following Code of Conduct:

1. Professional Ethics – Maintain highest standards of professional ethics and integrity in all dealings
2. Honesty – Provide truthful and accurate information in all assignments and Platform interactions
3. Confidentiality – Maintain strict confidentiality of client data and sensitive information
4. Quality – Deliver work of professional quality meeting or exceeding client expectations
5. Timeliness – Complete assignments within agreed timelines or communicate delays proactively
6. Compliance – Comply with all applicable laws, regulations, and professional standards
7. Respect – Treat all stakeholders (clients, colleagues, Managers, Company) with respect and courtesy
8. Non-Discrimination – Do not discriminate on basis of caste, religion, gender, age, disability
9. No Harassment – Do not engage in harassment, bullying, or inappropriate conduct
10. Conflict of Interest – Disclose any potential conflicts of interest to Manager and Company
11. Data Security – Implement reasonable measures to protect data and prevent unauthorized access
12. No Misrepresentation – Do not misrepresent qualifications, experience, or capabilities
13. Platform Integrity – Do not manipulate, abuse, or circumvent Platform systems
14. Reporting Violations – Promptly report any suspected violations of this Code to Manager or Company

Violations of this Code may result in warnings, suspension, termination, and/or legal action as deemed appropriate by the Company and/or Manager.

──────────────────────────────────────

ANNEXURE D – PLATFORM USAGE TERMS

Detailed Platform Usage Terms are available at www.auditveda.com/terms and are incorporated by reference. Key highlights:

• Account Security: Users responsible for maintaining credential confidentiality
• Acceptable Use: Platform to be used only for legitimate audit assignment purposes
• Prohibited Activities: No hacking, malware uploading, data scraping, or unauthorized access attempts
• Data Privacy: Personal data processed per Privacy Policy at www.auditveda.com/privacy
• Intellectual Property: All Platform IP belongs to Company; unauthorized use prohibited
• Service Availability: Company strives for 99% uptime but does not guarantee uninterrupted access
• Updates & Modifications: Company may update Platform features with notice
• Termination: Company may suspend/terminate access for violations or non-payment
• Limitation of Liability: Company's liability limited as per Section 15 of Agreement
• User Content: Users grant Company license to use content uploaded to Platform for service provision`

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
          <h2 className="text-2xl font-semibold text-slate-900">Affiliate Partner Agreement – Version 1.0</h2>
        </AgreementHeader>

        <AgreementBody className="max-h-[600px] overflow-y-auto relative">
          <div className="prose prose-slate max-w-none relative z-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {/* ── Title Block ── */}
              <h1 className="text-center text-3xl font-bold mb-2 text-slate-900">
                AFFILIATE PARTNER AGREEMENT
              </h1>
              <p className="text-center text-sm text-slate-500 mb-1">Version 1.0 – January 2026</p>
              <p className="text-center text-sm text-slate-500 mb-8">
                Effective Date: {signatureDateDisplay}
              </p>

              {/* ── Party Details Card ── */}
              <h2 className="text-xl font-bold mt-8 mb-4 text-slate-900">PARTY DETAILS</h2>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6 space-y-2">
                <p className="text-sm text-slate-900"><span className="font-semibold">Company:</span> {companyName}</p>
                <p className="text-sm text-slate-900"><span className="font-semibold">Company PAN:</span> {companyPan}</p>
                <p className="text-sm text-slate-900"><span className="font-semibold">Company Address:</span> {companyAddress}</p>
                <hr className="border-slate-200 my-2" />
                <p className="text-sm text-slate-900">
                  <span className="font-semibold">Partner Name:</span>{' '}
                  <span className="bg-yellow-100 px-2 py-0.5 rounded">{data.fullName}</span>
                </p>
                <p className="text-sm text-slate-900">
                  <span className="font-semibold">Partner PAN:</span>{' '}
                  <span className="bg-yellow-100 px-2 py-0.5 rounded">{partnerPanDisplay}</span>
                </p>
                <p className="text-sm text-slate-900">
                  <span className="font-semibold">Partner Address:</span>{' '}
                  <span className="bg-yellow-100 px-2 py-0.5 rounded">{partnerAddressDisplay}</span>
                </p>
                <p className="text-sm text-slate-900">
                  <span className="font-semibold">Jurisdiction:</span>{' '}
                  <span className="bg-yellow-100 px-2 py-0.5 rounded">{data.jurisdiction || 'Mumbai or Thane, Maharashtra'}</span>
                </p>
                <p className="text-sm text-slate-900">
                  <span className="font-semibold">Signature Name:</span>{' '}
                  <span className="bg-yellow-100 px-2 py-0.5 rounded">{signatureNameDisplay}</span>
                </p>
              </div>

              {/* ── Agreement Body ── */}
              {agreementText.split('\n\n').map((paragraph, index) => (
                <p
                  key={index}
                  className="mb-4 text-slate-900 leading-relaxed whitespace-pre-line"
                >
                  {paragraph}
                </p>
              ))}

              {/* ── Execution / Signature Block ── */}
              <div className="mt-10 pt-6 border-t border-slate-300">
                <p className="text-slate-900 font-semibold mb-2">EXECUTION</p>
                <p className="text-slate-900 font-semibold mb-6">IN WITNESS WHEREOF</p>
                <p className="text-slate-900 mb-6">
                  The Parties have executed this Agreement on the date first written above.
                </p>

                <div className="grid grid-cols-2 gap-10">
                  {/* Company side */}
                  <div className="space-y-1">
                    <p className="font-semibold text-slate-900">FOR THE COMPANY (Yours Faithfully Advisors LLP / AuditVeda)</p>
                    <p className="text-slate-900 mt-3">Name: _______________________</p>
                    <p className="text-slate-900">Designation: __________________</p>
                    <p className="text-slate-900">Signature: ____________________</p>
                    <p className="text-slate-900">Date: ________________________</p>
                    <p className="text-slate-900">Place: _______________________</p>
                  </div>

                  {/* Partner side */}
                  <div className="space-y-1">
                    <p className="font-semibold text-slate-900">FOR THE PARTNER (Affiliate Manager)</p>
                    <p className="text-slate-900 mt-3">Name: <span className="bg-yellow-100 px-2 py-0.5 rounded">{signatureNameDisplay}</span></p>
                    <p className="text-slate-900">PAN: <span className="bg-yellow-100 px-2 py-0.5 rounded">{partnerPanDisplay}</span></p>

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
                    <p className="text-slate-900">Place: _______________________</p>
                  </div>
                </div>

                <p className="text-xs text-slate-400 mt-8 italic">
                  Note: This Agreement may be executed via digital signature, which shall have the same legal validity as physical signatures.
                </p>
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