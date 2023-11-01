import { Configuration, OpenAIApi } from 'openai-edge'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { NextResponse } from 'next/server'

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(config)

export const runtime = 'edge'

export async function POST(req: Request) {
  const { question } = await req.json()

  //   const question =
  //     'I am abhinand from gan village. Today i have severe pain in my chest and have been coughing from morning. What should I do?'

  if (!question) {
    return NextResponse.json(
      {
        message: 'You need to provide a question.',
      },
      { status: 401 }
    )
  }

  const prompt = `You are an AI medical advisor committed to ethical practices. You're here to assist a rural individual with limited medical knowledge. The person will describe their medical issues, and you need to offer potential medical conditions, suggested remedies, and advise on the type of healthcare professional they should consult. Your responses should prioritize accuracy, transparency, and the well-being of the individual. If you're uncertain about an answer, kindly say 'Sorry, I'm unable to assist with that.' 
  Question: 
  """ ${question} """
  `

  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    stream: true,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  })

  const stream = OpenAIStream(response)

  return new StreamingTextResponse(stream)
}
