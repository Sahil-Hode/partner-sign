import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import { jsPDF } from 'jspdf'
import { PassThrough } from 'stream'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fullName, panNumber, address, city, state, jurisdiction, signatureName, signatureDataUrl, date } = body

    // ─── env checks ───────────────────────────────────────────────────
    const hasServiceAccount = Boolean(
      process.env.GOOGLE_TYPE &&
        process.env.GOOGLE_PROJECT_ID &&
        process.env.GOOGLE_PRIVATE_KEY_ID &&
        process.env.GOOGLE_PRIVATE_KEY &&
        process.env.GOOGLE_CLIENT_EMAIL &&
        process.env.GOOGLE_CLIENT_ID &&
        process.env.GOOGLE_AUTH_URI &&
        process.env.GOOGLE_TOKEN_URI &&
        process.env.GOOGLE_AUTH_PROVIDER_X509_CERT_URL &&
        process.env.GOOGLE_CLIENT_X509_CERT_URL
    )

    const hasOAuth = Boolean(
      process.env.GOOGLE_OAUTH_CLIENT_ID &&
        process.env.GOOGLE_OAUTH_CLIENT_SECRET &&
        process.env.GOOGLE_OAUTH_REDIRECT_URI &&
        process.env.GOOGLE_OAUTH_REFRESH_TOKEN
    )

    const missingEnv: string[] = []
    if (!process.env.GOOGLE_DRIVE_FOLDER_ID) {
      missingEnv.push('GOOGLE_DRIVE_FOLDER_ID')
    }
    if (!hasServiceAccount && !hasOAuth) {
      missingEnv.push('GOOGLE_OAUTH_CLIENT_ID/SECRET/REDIRECT_URI/REFRESH_TOKEN or service account creds')
    }
    if (hasServiceAccount && !hasOAuth && !process.env.GOOGLE_DRIVE_SHARED_DRIVE_ID) {
      missingEnv.push('GOOGLE_DRIVE_SHARED_DRIVE_ID (required for service accounts)')
    }

    // ─── PDF generation ───────────────────────────────────────────────
    const doc = new jsPDF()
    const pageWidth  = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    let yPosition = 18

    const companyName    = 'Yours Faithfully Advisors LLP / AuditVeda'
    const companyPan     = 'AABFY7975M'
    const companyAddress = '207, 2nd Floor Building No 1 Millenium Business Park Sector-2 Mahape Navi Mumbai 40710'
    const partnerAddress = [address, city, state].filter(Boolean).join(', ')

    const addTextBlock = (text: string, fontSize = 9, lineHeight = 5): void => {
      doc.setFontSize(fontSize)
      const lines = doc.splitTextToSize(text, pageWidth - 30)
      lines.forEach((line: string) => {
        if (yPosition > pageHeight - 20) {
          doc.addPage()
          yPosition = 18
        }
        doc.text(line, 15, yPosition)
        yPosition += lineHeight
      })
    }

    // ── Title ─────────────────────────────────────────────────────────
    doc.setFontSize(16)
    doc.text('AFFILIATE PARTNER AGREEMENT', pageWidth / 2, yPosition, { align: 'center' })
    yPosition += 10

    const effectiveDate = date || new Date().toISOString().split('T')[0]
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
    const effectiveDateDisplay = formatAgreementDate(effectiveDate)

    doc.setFontSize(10)
    doc.text(`Effective Date: ${effectiveDateDisplay}`, pageWidth / 2, yPosition, { align: 'center' })
    yPosition += 12

    // ── Party details ─────────────────────────────────────────────────
    doc.setFontSize(12)
    doc.text('PARTY DETAILS', 15, yPosition)
    yPosition += 8

    addTextBlock(`Company: ${companyName}`)
    addTextBlock(`Company PAN: ${companyPan}`)
    addTextBlock(`Company Address: ${companyAddress}`)
    addTextBlock(`Partner Name: ${fullName}`)
    addTextBlock(`Partner PAN: ${panNumber}`)
    addTextBlock(`Partner Address: ${partnerAddress}`)
    addTextBlock(`Jurisdiction: ${jurisdiction}`)
    addTextBlock(`Signature Name: ${signatureName}`)
    yPosition += 6

    // ── Agreement clauses ─────────────────────────────────────────────
    const agreementBody = `This Affiliate Partner Agreement ("Agreement") is entered into on this ${effectiveDateDisplay}, by and between:
${companyName} ("Company"), having PAN No- ${companyPan} at its principal place of business at ${companyAddress},
AND
Affiliate Manager ("Partner"), having PAN No: ${panNumber} residing at ${partnerAddress}
The Company and the Partner shall collectively be referred to as the "Parties" and individually as a "Party."

1. PURPOSE OF THE AGREEMENT
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
This Agreement shall be governed by and construed in accordance with the laws of India, and courts at ${jurisdiction} shall have exclusive jurisdiction.

11. ENTIRE AGREEMENT
This Agreement constitutes the entire understanding between the Parties and supersedes all prior discussions or understandings, whether written or oral.`

    addTextBlock(agreementBody, 9, 5)

    // ── IN WITNESS WHEREOF (two-column signature block) ──────────────
    yPosition += 8
    if (yPosition > pageHeight - 80) {
      doc.addPage()
      yPosition = 18
    }

    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('IN WITNESS WHEREOF', 15, yPosition)
    yPosition += 6
    doc.setFont('helvetica', 'normal')
    doc.text('The Parties have executed this Agreement on the date first written above.', 15, yPosition)
    yPosition += 14

    const leftX  = 15
    const rightX = pageWidth / 2 + 5

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.text('For the Company',  leftX,  yPosition)
    doc.text('For the Partner',  rightX, yPosition)
    yPosition += 7

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)

    doc.text('Name: _______________________',              leftX,  yPosition)
    doc.text(`Name: ${signatureName || fullName}`,          rightX, yPosition)
    yPosition += 6

    doc.text('Designation: __________________',            leftX,  yPosition)
    yPosition += 6

    doc.text('Signature: ____________________',            leftX,  yPosition)

    if (signatureDataUrl) {
      const format = signatureDataUrl.startsWith('data:image/jpeg') ? 'JPEG' : 'PNG'
      doc.addImage(signatureDataUrl, format, rightX, yPosition - 2, 70, 25)
      yPosition += 28
    } else {
      doc.text('Signature: ____________________',          rightX, yPosition)
      yPosition += 6
    }

    doc.text('Date: ________________________',             leftX,  yPosition)
    doc.text(`Date: ${effectiveDateDisplay}`,             rightX, yPosition)

    // ─── Convert to buffer ────────────────────────────────────────────
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'))

    // ─── Early return if env is incomplete ────────────────────────────
    if (missingEnv.length > 0) {
      const base64 = `data:application/pdf;base64,${pdfBuffer.toString('base64')}`
      return NextResponse.json({
        success: true,
        uploaded: false,
        downloadBase64: base64,
        uploadWarning: `Drive upload skipped (missing env: ${missingEnv.join(', ')})`,
        message: 'Agreement generated locally',
      })
    }

    // ─── Google Drive auth ────────────────────────────────────────────
    // FIX: Prefer OAuth (personal Drive). Service accounts need Shared Drives.
    let driveAuth: any
    if (hasOAuth) {
      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_OAUTH_CLIENT_ID,
        process.env.GOOGLE_OAUTH_CLIENT_SECRET,
        process.env.GOOGLE_OAUTH_REDIRECT_URI
      )
      oauth2Client.setCredentials({
        refresh_token: process.env.GOOGLE_OAUTH_REFRESH_TOKEN,
      })
      await oauth2Client.refreshToken(process.env.GOOGLE_OAUTH_REFRESH_TOKEN!)
      driveAuth = oauth2Client
    } else if (hasServiceAccount) {
      const auth = new google.auth.GoogleAuth({
        credentials: {
          type: process.env.GOOGLE_TYPE as 'service_account',
          project_id: process.env.GOOGLE_PROJECT_ID,
          private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
          private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          client_email: process.env.GOOGLE_CLIENT_EMAIL,
          client_id: process.env.GOOGLE_CLIENT_ID,
          auth_uri: process.env.GOOGLE_AUTH_URI,
          token_uri: process.env.GOOGLE_TOKEN_URI,
          auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_X509_CERT_URL,
          client_x509_cert_url: process.env.GOOGLE_CLIENT_X509_CERT_URL,
        },
        // FIX: scope was missing — Drive rejects calls without it
        scopes: ['https://www.googleapis.com/auth/drive.file'],
      })
      driveAuth = await auth.getClient()
    }

    // ─── Upload to Drive ──────────────────────────────────────────────
    const drive = google.drive({ version: 'v3', auth: driveAuth })

    const safeName = `Affiliate_Partner_Agreement_${fullName.replace(/\s+/g, '_')}_${Date.now()}.pdf`

    const fileMetadata: { name: string; parents?: string[] } = { name: safeName }
    if (process.env.GOOGLE_DRIVE_FOLDER_ID) {
      fileMetadata.parents = [process.env.GOOGLE_DRIVE_FOLDER_ID]
    }

    const bufferStream = new PassThrough()
    bufferStream.end(pdfBuffer)

    // FIX: only add driveId / supportsAllDrives when the env var exists.
    // Passing driveId=undefined breaks non-shared-drive setups.
    const createParams: any = {
      requestBody: fileMetadata,
      media: { mimeType: 'application/pdf', body: bufferStream },
      fields: 'id, webViewLink, name',
    }
    if (process.env.GOOGLE_DRIVE_SHARED_DRIVE_ID) {
      createParams.supportsAllDrives = true
      createParams.driveId           = process.env.GOOGLE_DRIVE_SHARED_DRIVE_ID
    }

    try {
      const file = await drive.files.create(createParams)

      return NextResponse.json({
        success: true,
        uploaded: true,
        fileId:       file.data.id,
        fileName:     file.data.name,
        downloadLink: file.data.webViewLink,
        message: 'Agreement generated and uploaded successfully',
      })
    } catch (uploadError) {
      // FIX: log to terminal so you can actually see the error while developing
      console.error('[Drive upload failed]', uploadError)

      const base64 = `data:application/pdf;base64,${pdfBuffer.toString('base64')}`
      return NextResponse.json({
        success: true,
        uploaded: false,
        downloadBase64: base64,
        uploadWarning: uploadError instanceof Error ? uploadError.message : 'Drive upload failed',
        message: 'Agreement generated locally',
      })
    }
  } catch (error) {
    console.error('[Agreement API fatal]', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate and upload agreement',
      },
      { status: 500 }
    )
  }
}
