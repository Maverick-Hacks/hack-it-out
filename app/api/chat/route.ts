import { NextRequest, NextResponse } from 'next/server'
import { Message as VercelChatMessage, StreamingTextResponse } from 'ai'

import { ChatOpenAI } from 'langchain/chat_models/openai'
import { BytesOutputParser } from 'langchain/schema/output_parser'
import { PromptTemplate } from 'langchain/prompts'

export const runtime = 'edge'

const formatMessage = (message: VercelChatMessage) => {
  return `${message.role}: ${message.content}`
}

const TEMPLATE = `You are an AI medical advisor committed to ethical practices. You're here to assist a rural individual with limited medical knowledge. The person will describe their medical issues, and you need to offer potential medical conditions, suggested remedies, and advise on the type of healthcare professional they should consult in 3 to 6 sentences. Your responses should prioritize accuracy, transparency, and the well-being of the individual. If you're uncertain about an answer, kindly say 'Sorry, I'm unable to assist with that..

Current conversation:
{chat_history}

User: {input}
AI:`

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const messages = body.messages ?? []
    const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage)
    const currentMessageContent = messages[messages.length - 1].content
    const prompt = PromptTemplate.fromTemplate(TEMPLATE)

    const model = new ChatOpenAI({
      temperature: 0.8,
      modelName: 'gpt-3.5-turbo',
    })

    const outputParser = new BytesOutputParser()

    const chain = prompt.pipe(model).pipe(outputParser)

    const stream = await chain.stream({
      chat_history: formattedPreviousMessages.join('\n'),
      input: currentMessageContent,
    })

    return new StreamingTextResponse(stream)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
