import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg'
import { v4 as uuid } from 'uuid'

const ffmpeg = createFFmpeg({
  corePath: 'https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js',
})

export const fileConvert = async (file: Blob) => {
  const unique_id = uuid()

  // This checks if ffmpeg is loaded
  if (!ffmpeg.isLoaded()) {
    await ffmpeg.load()
  }

  // This writes the file to memory, removes the video, and converts the audio to mp3
  ffmpeg.FS('writeFile', `${unique_id}.webm`, await fetchFile(file))
  await ffmpeg.run(
    '-i',
    `${unique_id}.webm`,
    '-vn',
    '-acodec',
    'libmp3lame',
    '-ac',
    '1',
    '-ar',
    '16000',
    '-f',
    'mp3',
    `${unique_id}.mp3`
  )

  // This reads the converted file from the file system
  const fileData = ffmpeg.FS('readFile', `${unique_id}.mp3`)
  // This creates a new file from the raw data
  const output = new File([fileData.buffer], `${unique_id}.mp3`, {
    type: 'audio/mp3',
  })

  return output
}
