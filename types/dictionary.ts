export type Dictionary = {
  transcribe: TranscriptionFormProps
  record: RecordProps
}

export type TranscriptionFormProps = {
  form: {
    file: {
      content: string
      sub: string
    }
    prompt: {
      content: string
      sub: string
    }
  }
}

export type RecordProps = {
  data: {
    heading: string
    transcript: string
    feedback: string
    sub: string
    privacy: string
    privacySave: string
    loading: string
    restart: string
    process_transcript: string
    camera_denied: string
    chat_title: string
    chat_placeholder: string
  }
}
