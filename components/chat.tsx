'use client'

import { useChat } from 'ai/react'
import { useRef, useState, ReactElement } from 'react'
import type { FormEvent } from 'react'
import { motion } from 'framer-motion'

import { ChatMessageBubble } from '@/components/chat-bubble'
import { Loader2, Mic, SendHorizonal } from 'lucide-react'

export function ChatWindow(props: {
  endpoint: string
  emptyStateComponent: ReactElement
  feedback: string
  placeholder: string
  titleText: string
}) {
  const messageContainerRef = useRef<HTMLDivElement | null>(null)

  const { endpoint, emptyStateComponent, placeholder, titleText = 'An LLM', feedback } = props

  const [sourcesForMessages, setSourcesForMessages] = useState<Record<string, any>>({})

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading: chatEndpointIsLoading,
  } = useChat({
    api: endpoint,
    initialMessages: [{ content: feedback as string, role: 'system', id: '123' }],
    onResponse(response) {
      const sourcesHeader = response.headers.get('x-sources')
      const sources = sourcesHeader ? JSON.parse(atob(sourcesHeader)) : []
      const messageIndexHeader = response.headers.get('x-message-index')
      if (sources.length && messageIndexHeader !== null) {
        setSourcesForMessages({ ...sourcesForMessages, [messageIndexHeader]: sources })
      }
    },
    onError: (e) => {
      console.log(e.message)
    },
  })

  async function sendMessage(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (chatEndpointIsLoading) return
    if (messageContainerRef.current) {
      messageContainerRef.current.classList.add('grow')
    }
    if (!messages.length) {
      await new Promise((resolve) => setTimeout(resolve, 300))
    }

    handleSubmit(e)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ ease: 'easeOut', duration: 1 }}
      className="flex w-full flex-col"
    >
      {messages.length === 1 && emptyStateComponent}
      <div
        className={`md: flex max-h-[80vh] w-full flex-col items-center overflow-hidden rounded border-2 p-4 pb-8 md:px-8 md:pt-0 ${
          messages.length > 1 ? 'grow' : ''
        }`}
      >
        <div className="mb-1 flex w-full justify-center border-b p-2">
          <h2 className={`${messages.length > 0 ? '' : 'hidden'} text-2xl`}>{titleText}</h2>
        </div>
        {messages.length !== 1 && (
          <div
            className="mb-4 flex w-full flex-col-reverse overflow-auto pr-6 transition-[flex-grow] ease-in-out"
            ref={messageContainerRef}
          >
            {messages.length > 0
              ? [...messages].reverse().map((m, i) => {
                  const sourceKey = (messages.length - 1 - i).toString()
                  return (
                    <ChatMessageBubble
                      key={m.id}
                      message={m}
                      sources={sourcesForMessages[sourceKey]}
                    ></ChatMessageBubble>
                  )
                })
              : ''}
          </div>
        )}

        <form onSubmit={sendMessage} className="flex w-full flex-col">
          <div className="mt-4 flex w-full gap-4">
            <input
              className="w-full grow rounded border p-4"
              value={input}
              placeholder={placeholder}
              onChange={handleInputChange}
            />

            <div className="flex shrink-0 cursor-not-allowed items-center justify-center rounded bg-[#1E2B3A] px-4">
              <span>
                <Mic className="h-6 w-6 text-white" />
              </span>
            </div>
            <button type="submit" className="shrink-0 rounded bg-[#1E2B3A] px-4">
              <div
                role="status"
                className={`${chatEndpointIsLoading ? '' : 'hidden'} flex justify-center`}
              >
                <Loader2 className="h-6 w-6 animate-spin fill-sky-800 text-white dark:text-white" />
                <span className="sr-only">Loading...</span>
              </div>
              <span className={chatEndpointIsLoading ? 'hidden' : ''}>
                <SendHorizonal className="h-5 w-5 text-white" />
              </span>
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  )
}
