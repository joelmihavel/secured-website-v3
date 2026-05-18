import { NextRequest, NextResponse } from 'next/server'
import { handleSubmitApplicationRequest } from '@tastemakers-api/submit-application'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const { status, body: responseBody } = await handleSubmitApplicationRequest(
    body,
    process.env as Record<string, string | undefined>,
  )
  return NextResponse.json(responseBody, { status })
}
