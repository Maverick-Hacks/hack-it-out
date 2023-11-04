import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import Image from 'next/image'
import Logo from '../public/logo.png'

export default function NavBar({ lang }: { lang: string }) {
  return (
    <div className="flex h-12 w-full items-center justify-between p-8">
      <Link href="/" className="flex gap-4">
        <Image src={Logo} height={600} width={600} className="h-[60px] w-[60px]" alt="Logo" />
        <div className="flex items-center">
          <h2 className="text-2xl font-semibold max-sm:hidden">Healthify</h2>
        </div>
      </Link>
      <div className="flex cursor-pointer font-medium text-blue-600 hover:underline dark:text-blue-500">
        {lang == 'en' && <Link href="/hi">हिंदी</Link>}
        {lang == 'hi' && <Link href="/en">English</Link>}
        {lang == 'ta' && <Link href="/en">English</Link>}
        <ChevronRight />
      </div>
    </div>
  )
}
