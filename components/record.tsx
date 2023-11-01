'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import Webcam from 'react-webcam'

import { CheckCircledIcon, LockClosedIcon } from '@radix-ui/react-icons'
import { ChevronRightIcon, Loader2 } from 'lucide-react'
import { fileConvert } from '@/lib/file-convert'
import { RecordProps } from '@/types/dictionary'

export default function RecordComponent(props: RecordProps) {
  const webcamRef = useRef<Webcam | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)

  const [loading, setLoading] = useState(true)
  const [capturing, setCapturing] = useState(false)
  const [seconds, setSeconds] = useState(150)
  const [videoEnded, setVideoEnded] = useState(false)
  const [recordingPermission, setRecordingPermission] = useState(true)
  const [cameraLoaded, setCameraLoaded] = useState(false)
  const [isSubmitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState('Processing')
  const [isSuccess, setIsSuccess] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [generatedFeedback, setGeneratedFeedback] = useState('')

  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([])
  const handleDataAvailable = useCallback(
    ({ data }: BlobEvent) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data))
      }
    },
    [setRecordedChunks]
  )

  useEffect(() => {
    if (videoEnded) {
      const element = document.getElementById('startTimer')

      if (element) {
        element.style.display = 'flex'
      }

      setCapturing(true)

      mediaRecorderRef.current = new MediaRecorder(webcamRef?.current?.stream as MediaStream)
      mediaRecorderRef.current.addEventListener('dataavailable', handleDataAvailable)
      mediaRecorderRef.current.start()
    }
  }, [videoEnded, webcamRef, setCapturing, mediaRecorderRef, handleDataAvailable])

  const handleStartCaptureClick = useCallback(() => {
    const startTimer = document.getElementById('startTimer')
    if (startTimer) {
      startTimer.style.display = 'none'
    }

    setVideoEnded(true)
  }, [])

  const handleStopCaptureClick = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
    }
    setCapturing(false)
  }, [])

  useEffect(() => {
    let timer: any = null
    if (capturing) {
      timer = setInterval(() => {
        setSeconds((seconds) => seconds - 1)
      }, 1000)
      if (seconds === 0) {
        handleStopCaptureClick()
        setCapturing(false)
        setSeconds(0)
      }
    }
    return () => {
      clearInterval(timer)
    }
  }, [capturing, seconds, handleStopCaptureClick])

  const handleDownload = async () => {
    if (recordedChunks.length) {
      setSubmitting(true)
      setStatus('Processing')

      const file = new Blob(recordedChunks, {
        type: `video/webm`,
      })

      const output = await fileConvert(file)

      const formData = new FormData()
      formData.append('file', output, output.name)
      formData.append('model', 'whisper-1')

      setStatus('Transcribing')

      const upload = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      })
      const results = await upload.json()

      if (upload.ok) {
        setIsSuccess(true)
        setSubmitting(false)

        if (results.error) {
          setTranscript(results?.error ?? '')
        } else {
          setTranscript(results.data.text)
        }

        await Promise.allSettled([new Promise((resolve) => setTimeout(resolve, 800))]).then(() => {
          setCompleted(true)
        })

        if (results?.data?.text.length > 0) {
          const response = await fetch('/api/feedback', {
            method: 'POST',
            body: JSON.stringify({
              question: results.data.text,
            }),
          })

          if (!response.ok) {
            throw new Error(response.statusText)
          }

          // This data is a ReadableStream
          const data = response.body
          if (!data) {
            return
          }

          const reader = data.getReader()
          const decoder = new TextDecoder()
          let done = false

          while (!done) {
            const { value, done: doneReading } = await reader.read()
            done = doneReading
            const chunkValue = decoder.decode(value)

            setGeneratedFeedback((prev: any) => prev + chunkValue)
          }
        }
      } else {
        console.error('Upload failed.')
      }

      setTimeout(function () {
        setRecordedChunks([])
      }, 1500)
    }
  }

  function restartVideo() {
    setRecordedChunks([])
    setVideoEnded(false)
    setCapturing(false)
    setSeconds(150)
  }

  const videoConstraints = { width: 1280, height: 720, facingMode: 'user' }

  const handleUserMedia = () => {
    setTimeout(() => {
      setLoading(false)
      setCameraLoaded(true)
    }, 1000)
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#FCFCFC] px-4 pb-8 pt-2 md:px-8 md:py-2">
      {completed ? (
        <div className="mx-auto mt-[10vh] flex w-full max-w-[1080px] flex-col overflow-y-auto pb-8 md:pb-12">
          <div className="relative flex w-full max-w-[1080px] flex-col items-center justify-center overflow-hidden rounded-lg bg-[#1D2B3A] shadow-md ring-1 ring-gray-900/5 md:aspect-[16/9]">
            <video className="h-full w-full rounded-lg" controls crossOrigin="anonymous" autoPlay>
              <source
                src={URL.createObjectURL(new Blob(recordedChunks, { type: 'video/mp4' }))}
                type="video/mp4"
              />
            </video>
          </div>
          <div className="mt-2 flex flex-col items-center space-y-1 md:mt-4 md:flex-row md:justify-between md:space-y-0">
            <div className="flex flex-row items-center space-x-1">
              <LockClosedIcon />
              <p className="text-[14px] font-normal leading-[20px] text-[#1a2b3b]">
                {props.data.privacySave}
              </p>
            </div>
          </div>
          <div className="mt-8 flex flex-col">
            <div>
              <h2 className="mb-2 text-left text-xl font-semibold text-[#1D2B3A]">
                {props.data.transcript}
              </h2>
              <p className="prose prose-sm max-w-none">
                {transcript.length > 0
                  ? transcript
                  : "Don't think you said anything. Want to try again?"}
              </p>
            </div>
            <div className="mt-8">
              <h2 className="mb-2 text-left text-xl font-semibold text-[#1D2B3A]">
                {props.data.feedback}
              </h2>
              <div className="mt-4 flex min-h-[100px] gap-2.5 rounded-lg border border-[#EEEEEE] bg-[#FAFAFA] p-4 text-sm leading-6 text-gray-900">
                <p className="prose prose-sm max-w-none">{generatedFeedback}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-[10vh] flex h-full w-full flex-col items-center">
          {recordingPermission ? (
            <div className="mx-auto flex w-full max-w-[1080px] flex-col justify-center">
              <h2 className="mb-2 text-left text-2xl font-semibold text-[#1D2B3A]">
                {props.data.heading}
              </h2>
              <span className="mb-4 text-[14px] font-normal leading-[20px] text-[#1a2b3b]">
                {props.data.sub}
              </span>
              <div className="relative aspect-[16/9] w-full max-w-[1080px] overflow-hidden rounded-lg bg-[#1D2B3A] shadow-md ring-1 ring-gray-900/5">
                {!cameraLoaded && (
                  <div className="absolute left-1/2 top-1/2 z-20 flex items-center text-white">
                    <Loader2 className="animate-spin" />
                  </div>
                )}
                <div className="relative z-10 h-full w-full rounded-lg">
                  <div className="absolute left-5 top-5 z-20 lg:left-10 lg:top-10">
                    <span className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-0.5 text-sm font-medium text-gray-800">
                      {new Date(seconds * 1000).toISOString().slice(14, 19)}
                    </span>
                  </div>
                  <Webcam
                    mirrored
                    audio
                    muted
                    ref={webcamRef}
                    videoConstraints={videoConstraints}
                    onUserMedia={handleUserMedia}
                    onUserMediaError={(error) => {
                      setRecordingPermission(false)
                    }}
                    className="absolute z-10 h-auto min-h-[100%] w-auto min-w-[100%] object-cover"
                  />
                </div>
                {loading && (
                  <div className="absolute flex h-full w-full items-center justify-center">
                    <div className="relative h-[112px] w-[112px] rounded-lg object-cover text-[2rem]">
                      <div className="flex h-[112px] w-[112px] items-center justify-center rounded-[0.5rem] bg-[#4171d8] !text-white">
                        {props.data.loading}...
                      </div>
                    </div>
                  </div>
                )}

                {cameraLoaded && (
                  <div className="absolute bottom-0 left-0 z-50 flex h-[82px] w-full items-center justify-center">
                    {recordedChunks.length > 0 ? (
                      <>
                        {isSuccess ? (
                          <button
                            className="cursor-disabled group group inline-flex min-w-[140px] items-center justify-center rounded-full bg-green-500 px-4 py-2 text-[13px] text-sm font-semibold text-white duration-150 hover:bg-green-600 hover:text-slate-100 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 active:scale-100 active:bg-green-800 active:text-green-100"
                            style={{
                              boxShadow:
                                '0px 1px 4px rgba(27, 71, 13, 0.17), inset 0px 0px 0px 1px #5fc767, inset 0px 0px 0px 2px rgba(255, 255, 255, 0.1)',
                            }}
                          >
                            <CheckCircledIcon className="mx-auto h-5 w-5" />
                          </button>
                        ) : (
                          <div className="flex flex-row gap-2">
                            {!isSubmitting && (
                              <button
                                onClick={() => restartVideo()}
                                className="hover:[linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)), #0D2247] group flex scale-100 items-center justify-center gap-x-2 rounded-full bg-white px-4 py-2 text-[13px] font-semibold text-[#1E2B3A] no-underline  transition-all duration-75 active:scale-95"
                              >
                                {props.data.restart}
                              </button>
                            )}
                            <button
                              onClick={() => {
                                handleDownload()
                              }}
                              disabled={isSubmitting}
                              className="hover:[linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)), #0D2247] group flex min-w-[140px] scale-100 items-center justify-center rounded-full bg-[#1E2B3A] px-4 py-2 text-[13px] font-semibold text-white no-underline  transition-all duration-75 active:scale-95  disabled:cursor-not-allowed"
                              style={{
                                boxShadow:
                                  '0px 1px 4px rgba(13, 34, 71, 0.17), inset 0px 0px 0px 1px #061530, inset 0px 0px 0px 2px rgba(255, 255, 255, 0.1)',
                              }}
                            >
                              <span>
                                {isSubmitting ? (
                                  <div className="flex items-center justify-center gap-x-2">
                                    <Loader2 className="mx-auto h-5 w-5 animate-spin text-slate-50" />
                                    <span>{status}</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-center gap-x-2">
                                    <span>{props.data.process_transcript}</span>
                                    <ChevronRightIcon className="h-5 w-5" />
                                  </div>
                                )}
                              </span>
                            </button>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="absolute bottom-[6px] left-5 right-5 md:bottom-5">
                        <div className="flex flex-col items-center justify-center gap-2 lg:mt-4">
                          {capturing ? (
                            <div
                              id="stopTimer"
                              onClick={handleStopCaptureClick}
                              className="flex h-10 w-10 scale-100 cursor-pointer flex-col items-center justify-center rounded-full bg-transparent text-white ring-4  ring-white duration-75 hover:shadow-xl active:scale-95"
                            >
                              <div className="h-5 w-5 cursor-pointer rounded bg-red-500"></div>
                            </div>
                          ) : (
                            <button
                              id="startTimer"
                              onClick={handleStartCaptureClick}
                              className="flex h-8 w-8 scale-100 flex-col items-center justify-center rounded-full bg-red-500 text-white ring-4 ring-white ring-offset-2 ring-offset-gray-500 duration-75 hover:shadow-xl active:scale-95 sm:h-8 sm:w-8"
                            ></button>
                          )}
                          <div className="w-12"></div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <div
                  className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 transform text-center text-5xl font-semibold text-white"
                  id="countdown"
                ></div>
              </div>
              <div className="mt-4 flex flex-row items-center space-x-1">
                <LockClosedIcon />
                <p className="text-[14px] font-normal leading-[20px] text-[#1a2b3b]">
                  {props.data.privacy}
                </p>
              </div>
            </div>
          ) : (
            <div className="mx-auto flex w-full max-w-[1080px] flex-col justify-center">
              <div className="relative flex w-full max-w-[1080px] flex-col items-center justify-center overflow-hidden rounded-lg bg-[#1D2B3A] shadow-md ring-1 ring-gray-900/5 md:aspect-[16/9]">
                <p className="max-w-3xl text-center text-lg font-medium text-white">
                  {props.data.camera_denied}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
