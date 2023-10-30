import { NextResponse } from 'next/server'
import axios from 'axios'

export async function POST(request: Request) {
  const formData = await request.formData()

  formData.append('model', 'whisper-1')
  // formData.append('language', 'ta')
  console.log(formData)
  const apiKEY = formData.get('api_key') || process.env.OPENAI_API_KEY

  if (!apiKEY) {
    return NextResponse.json(
      {
        message: 'You need to set your API Key as env varibale or with the input.',
      },
      { status: 401, statusText: 'Unauthorized' }
    )
  }

  try {
    const { data } = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, {
      headers: {
        Authorization: `Bearer ${apiKEY}`,
      },
    })
    return NextResponse.json({ data })
  } catch (error: any) {
    console.log(error.response.data.error.message)
    return NextResponse.json({ message: 'Error' })
  }
}
