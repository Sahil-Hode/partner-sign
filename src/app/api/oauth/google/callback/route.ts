import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  if (error) {
    return NextResponse.json({ success: false, error }, { status: 400 })
  }

  if (!code) {
    return NextResponse.json({ success: false, error: 'Missing code' }, { status: 400 })
  }

  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET
  const redirectUri = process.env.GOOGLE_OAUTH_REDIRECT_URI

  if (!clientId || !clientSecret || !redirectUri) {
    return NextResponse.json(
      { success: false, error: 'Missing GOOGLE_OAUTH_CLIENT_ID/SECRET/REDIRECT_URI' },
      { status: 500 }
    )
  }

  try {
    const tokenParams = new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    })

    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: tokenParams.toString(),
    })

    const tokenJson = await tokenResponse.json()

    if (!tokenResponse.ok) {
      return NextResponse.json(
        { success: false, error: tokenJson.error || 'token_exchange_failed', details: tokenJson },
        { status: 400 }
      )
    }

    const refreshToken = tokenJson.refresh_token
    if (!refreshToken) {
      return NextResponse.json(
        {
          success: false,
          error: 'refresh_token_missing',
          details: tokenJson,
        },
        { status: 400 }
      )
    }

    const envPath = path.join(process.cwd(), '.env.local')
    let envContent = ''
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8')
      if (envContent.includes('GOOGLE_OAUTH_REFRESH_TOKEN=')) {
        envContent = envContent.replace(
          /GOOGLE_OAUTH_REFRESH_TOKEN=.*/g,
          `GOOGLE_OAUTH_REFRESH_TOKEN=${refreshToken}`
        )
      } else {
        envContent = `${envContent.trim()}\nGOOGLE_OAUTH_REFRESH_TOKEN=${refreshToken}\n`
      }
    } else {
      envContent = `GOOGLE_OAUTH_REFRESH_TOKEN=${refreshToken}\n`
    }

    fs.writeFileSync(envPath, envContent)

    return NextResponse.json(
      {
        success: true,
        message: 'Refresh token saved to .env.local. Restart the dev server to apply.',
      },
      { status: 200 }
    )
  } catch (exchangeError) {
    return NextResponse.json(
      { success: false, error: exchangeError instanceof Error ? exchangeError.message : 'token_exchange_failed' },
      { status: 500 }
    )
  }
}
