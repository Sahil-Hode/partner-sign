import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET() {
  return NextResponse.json({ ok: true, route: 'aadhaar/verify-otp' })
}

export async function POST(request: NextRequest) {
  try {
    const { otp, referenceId } = await request.json()

    if (!otp || !/^\d{6}$/.test(otp)) {
      return NextResponse.json({ success: false, error: 'invalid_otp' }, { status: 400 })
    }

    if (!referenceId) {
      return NextResponse.json({ success: false, error: 'missing_reference_id' }, { status: 400 })
    }

    const clientId = process.env.CASHFREE_CLIENT_ID
    const clientSecret = process.env.CASHFREE_CLIENT_SECRET

    if (!clientId || !clientSecret) {
      return NextResponse.json({ success: false, error: 'missing_cashfree_env' }, { status: 500 })
    }

    // Correct Cashfree endpoint for verifying OTP
    const url = 'https://api.cashfree.com/verification/offline-aadhaar/verify'

    console.log('Verifying OTP request to:', url)
    console.log('Reference ID:', referenceId)
    console.log('OTP:', otp)

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': clientId,
        'x-client-secret': clientSecret,
      },
      body: JSON.stringify({
        otp: otp,
        ref_id: referenceId, // Cashfree uses ref_id, not reference_id
      }),
    })

    const data = await response.json()
    console.log('Cashfree Verify Response Status:', response.status)
    console.log('Cashfree Verify Response Data:', data)

    if (!response.ok) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'cashfree_error', 
          details: data,
          message: data.message || 'Failed to verify OTP'
        }, 
        { status: response.status }
      )
    }

    // Check if verification was successful
    const verified = data.status === 'VALID' || data.status === 'SUCCESS'

    return NextResponse.json({ 
      success: true, 
      verified,
      status: data.status,
      message: data.message,
      aadhaarData: {
        name: data.full_name,
        dob: data.dob,
        gender: data.gender,
        address: data.address,
        splitAddress: data.split_address,
        careOf: data.care_of,
        mobileHash: data.mobile_hash,
        emailHash: data.email_hash,
        photo: data.photo_link,
        zipCode: data.zip,
      },
      data 
    })
  } catch (error) {
    console.error('Verify OTP Error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'server_error', 
        details: String(error) 
      }, 
      { status: 500 }
    )
  }
}