import { motion } from 'framer-motion'
import { ChatWindow } from '@/components/chat'
import { LockClosedIcon } from '@radix-ui/react-icons'
import React from 'react'
import Feedback from './feedback'

export default function Results(props: {
  recordedChunks: Blob[]
  privacySave: string
  transcript_heading: string
  transcript: string
  chat_title: string
  chat_placeholder: string
  feedback_title: string
  feedback: string
}) {
  return (
    <div className="mt-[2vh] flex max-w-[720px] flex-col gap-4 pb-8 max-2xl:mx-auto md:pb-12 2xl:max-w-none 2xl:flex-row">
      <motion.div
        initial={{ opacity: 0, x: 0 }}
        animate={{ opacity: 1, x: -10 }}
        transition={{ ease: 'easeOut', duration: 1 }}
        className="flex w-full flex-col"
      >
        <div className="max:2xl:max-w-[540px] relative flex w-full max-w-[720px] flex-col items-center justify-center overflow-hidden rounded-lg bg-[#1D2B3A] shadow-md ring-1 ring-gray-900/5 md:aspect-[16/9]">
          <video className="h-full w-full rounded-lg" controls crossOrigin="anonymous" autoPlay>
            <source
              src={URL.createObjectURL(new Blob(props.recordedChunks, { type: 'video/mp4' }))}
              type="video/mp4"
            />
          </video>
        </div>
        <div className="mt-2 flex flex-col items-center space-y-1 md:mt-4 md:flex-row md:justify-between md:space-y-0">
          <div className="flex flex-row items-center space-x-1">
            <LockClosedIcon />
            <p className="text-[14px] font-normal leading-[20px] text-[#1a2b3b]">
              {props.privacySave}
            </p>
          </div>
        </div>
        <div className="mt-8 flex flex-col">
          <div>
            <h2 className="mb-2 text-left text-xl font-semibold text-[#1D2B3A]">
              {props.transcript_heading}
            </h2>
            <p className="prose prose-sm max-w-none">
              {props.transcript.length > 0
                ? props.transcript
                : "Don't think you said anything. Want to try again?"}
            </p>
          </div>
        </div>
      </motion.div>

      <ChatWindow
        endpoint="api/chat"
        titleText={'🧑‍⚕️ ' + props.chat_title}
        placeholder={props.chat_placeholder}
        feedback={props.feedback}
        emptyStateComponent={<Feedback title={props.feedback_title} feedback={props.feedback} />}
      />
    </div>
  )
}
