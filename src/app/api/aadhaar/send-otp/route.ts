import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET() {
  return NextResponse.json({ ok: true, route: 'aadhaar/send-otp' })
}

export async function POST(request: NextRequest) {
  try {
    const { aadhaarNumber } = await request.json()

    if (!aadhaarNumber || !/^\d{12}$/.test(aadhaarNumber)) {
      return NextResponse.json({ success: false, error: 'invalid_aadhaar' }, { status: 400 })
    }

    const clientId = process.env.CASHFREE_CLIENT_ID
    const clientSecret = process.env.CASHFREE_CLIENT_SECRET

    if (!clientId || !clientSecret) {
      return NextResponse.json({ success: false, error: 'missing_cashfree_env' }, { status: 500 })
    }

    // Correct Cashfree endpoint for sending OTP
    const url = 'https://api.cashfree.com/verification/offline-aadhaar/otp'

    console.log('Sending OTP request to:', url)
    console.log('Aadhaar Number:', aadhaarNumber)

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': clientId,
        'x-client-secret': clientSecret,
      },
      body: JSON.stringify({
        aadhaar_number: aadhaarNumber,
      }),
    })

    const data = await response.json()
    console.log('Cashfree Response Status:', response.status)
    console.log('Cashfree Response Data:', data)

    if (!response.ok) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'cashfree_error', 
          details: data,
          message: data.message || 'Failed to send OTP'
        }, 
        { status: response.status }
      )
    }

    // Extract ref_id from Cashfree response
    const referenceId = data.ref_id

    if (!referenceId) {
      console.error('No ref_id in response:', data)
      return NextResponse.json(
        { 
          success: false, 
          error: 'missing_ref_id', 
          details: data 
        }, 
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      referenceId, 
      status: data.status,
      message: data.message,
      data 
    })
  } catch (error) {
    console.error('Send OTP Error:', error)
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