import { getDictionary } from '@/lib/dictionaries'
import RecordComponent from '../../components/record'
import { Dictionary } from '@/types/dictionary'
import { Locale } from '@/i18n-config'

export default async function RecordPage({ params }: { params: { lang: Locale } }) {
  const dict: Dictionary = await getDictionary(params.lang)

  return (
    <main className="mb-12 flex-1 p-4 ">
      <RecordComponent data={dict.record.data} lang={params.lang} />
    </main>
  )
}
