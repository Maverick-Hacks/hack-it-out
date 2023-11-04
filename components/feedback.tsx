import React from 'react'

type FeedbackProps = {
  title: string
  feedback: string
}

export default function Feedback({ feedback, title }: FeedbackProps) {
  return (
    <div className="w-full">
      <h2 className="mb-2 text-left text-xl font-semibold text-[#1D2B3A]">{title}</h2>
      <div className="mt-4 flex min-h-[100px] gap-2.5 rounded-lg border border-[#EEEEEE] bg-[#FAFAFA] p-4 text-sm leading-6 text-gray-900">
        <p className="prose prose-sm max-w-none">{feedback}</p>
      </div>
    </div>
  )
}
