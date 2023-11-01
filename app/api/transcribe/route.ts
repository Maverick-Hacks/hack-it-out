import { NextResponse } from 'next/server'
import axios from 'axios'

export async function POST(request: Request) {
  const formData = await request.formData()

  formData.append('model', 'whisper-1')

  const apiKEY = formData.get('api_key') || process.env.OPENAI_API_KEY

  const lang = formData.get('language')

  if (!apiKEY) {
    return NextResponse.json(
      {
        message: 'You need to set your API Key as env varibale or with the input.',
      },
      { status: 401, statusText: 'Unauthorized' }
    )
  }

  if (!lang) {
    return NextResponse.json(
      {
        message: 'You need to provide a language.',
      },
      { status: 400 } // Use 400 Bad Request for missing language
    )
  }

  try {
    const { data } = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, {
      headers: {
        Authorization: `Bearer ${apiKEY}`,
      },
    })

    let translation
    formData.delete('language')
    if (lang) {
      const { data } = await axios.post('https://api.openai.com/v1/audio/translations', formData, {
        headers: {
          Authorization: `Bearer ${apiKEY}`,
        },
      })
      translation = data
    } else {
      translation
    }

    return NextResponse.json({ data, translation })
  } catch (error: any) {
    console.log(error.response.data.error.message)
    return NextResponse.json({ message: 'Error' })
  }
}
