import TranscriptionForm from '@/components/transcription-form'
import { Locale } from '@/i18n-config'
import { getDictionary } from '@/lib/dictionaries'
import { Dictionary } from '@/types/dictionary'

export default async function Home({ params }: { params: { lang: Locale } }) {
  const dict: Dictionary = await getDictionary(params.lang)

  return (
    <main className="p-4">
      <TranscriptionForm form={dict.transcribe.form} />
    </main>
  )
}
