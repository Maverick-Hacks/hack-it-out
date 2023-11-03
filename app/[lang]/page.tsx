import { getDictionary } from '@/lib/dictionaries'
import RecordComponent from '../../components/record'
import { Dictionary } from '@/types/dictionary'
import { Locale } from '@/i18n-config'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import Image from 'next/image'
import Logo from '../../public/logo.png'

export default async function RecordPage({ params }: { params: { lang: Locale } }) {
  const dict: Dictionary = await getDictionary(params.lang)

  return (
    <main className="flex-1 p-4">
      <div className="flex h-12 w-full items-center justify-between px-8">
        <Link href="/" className="flex gap-4">
          <Image src={Logo} height={600} width={600} className="h-[60px] w-[60px]" alt="Logo" />
          <div className="flex items-center">
            <h2 className="text-2xl font-semibold">Healthify</h2>
          </div>
        </Link>
        <div className="flex cursor-pointer font-medium text-blue-600 hover:underline dark:text-blue-500">
          {params.lang == 'en' && <Link href="/hi">हिंदी</Link>}
          {params.lang == 'hi' && <Link href="/en">English</Link>}
          <ChevronRight />
        </div>
      </div>

      <RecordComponent data={dict.record.data} lang={params.lang} />
    </main>
  )
}
