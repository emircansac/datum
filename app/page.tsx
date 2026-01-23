import Link from 'next/link'
import {
  BarChart,
  Users,
  BookOpen,
  Settings,
  Globe,
  HeartPulse,
  Scale,
  Landmark,
  Search,
} from 'lucide-react'

const trendingVisualizations = [
  {
    id: 'viz-001',
    title: 'TÜFE Enflasyon Oranı - 2024',
    category: 'Ekonomi',
    date: 'Ocak 2024',
    source: 'TÜİK',
    chartType: 'bar',
  },
  {
    id: 'viz-002',
    title: 'Seçim Katılım Oranı - İl Bazlı',
    category: 'Politika',
    date: 'Mart 2024',
    source: 'YSK',
    chartType: 'line',
  },
  {
    id: 'viz-003',
    title: 'Yükseköğretim Mezun Sayısı',
    category: 'Eğitim',
    date: '2023',
    source: 'YÖK',
    chartType: 'bar',
  },
  {
    id: 'viz-004',
    title: 'Deprem Yardımı Dağılımı',
    category: 'Toplum',
    date: 'Şubat 2023',
    source: 'AFAD',
    chartType: 'pie',
  },
  {
    id: 'viz-005',
    title: 'Teknoloji İhracatı (2022–2024)',
    category: 'Teknoloji',
    date: '2024',
    source: 'TÜBİTAK',
    chartType: 'line',
  },
  {
    id: 'viz-006',
    title: 'Sağlık Harcamalarının Artışı',
    category: 'Sağlık',
    date: '2023',
    source: 'TÜİK',
    chartType: 'bar',
  },
]

const categories = [
  { name: 'Ekonomi', slug: 'ekonomi', icon: BarChart },
  { name: 'Demografi', slug: 'demografi', icon: Users },
  { name: 'Eğitim', slug: 'egitim', icon: BookOpen },
  { name: 'Teknoloji', slug: 'teknoloji', icon: Settings },
  { name: 'Çevre', slug: 'cevre', icon: Globe },
  { name: 'Sağlık', slug: 'saglik', icon: HeartPulse },
  { name: 'Politika', slug: 'politika', icon: Scale },
  { name: 'Toplum', slug: 'toplum', icon: Landmark },
]

const chartPlaceholders: Record<string, JSX.Element> = {
  bar: (
    <svg viewBox="0 0 160 96" className="w-full h-full" aria-hidden="true">
      <rect x="18" y="50" width="18" height="28" rx="2" fill="#BFD7F5" />
      <rect x="46" y="38" width="18" height="40" rx="2" fill="#8CB4EB" />
      <rect x="74" y="26" width="18" height="52" rx="2" fill="#4D8FE3" />
      <rect x="102" y="42" width="18" height="36" rx="2" fill="#8CB4EB" />
      <rect x="130" y="34" width="18" height="44" rx="2" fill="#BFD7F5" />
    </svg>
  ),
  line: (
    <svg viewBox="0 0 160 96" className="w-full h-full" aria-hidden="true">
      <polyline
        points="16,64 48,46 80,54 112,30 144,38"
        fill="none"
        stroke="#4D8FE3"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="64" r="4" fill="#4D8FE3" />
      <circle cx="48" cy="46" r="4" fill="#4D8FE3" />
      <circle cx="80" cy="54" r="4" fill="#4D8FE3" />
      <circle cx="112" cy="30" r="4" fill="#4D8FE3" />
      <circle cx="144" cy="38" r="4" fill="#4D8FE3" />
    </svg>
  ),
  pie: (
    <svg viewBox="0 0 160 96" className="w-full h-full" aria-hidden="true">
      <circle cx="80" cy="48" r="30" fill="#BFD7F5" />
      <path d="M80 48 L80 18 A30 30 0 0 1 106 62 Z" fill="#4D8FE3" />
      <path d="M80 48 L106 62 A30 30 0 0 1 56 72 Z" fill="#8CB4EB" />
    </svg>
  ),
}

export default function HomePage() {
  return (
    <main className="bg-[#FAFAFA] text-[#1A1A1A] font-sans min-h-screen">
      <section className="text-center py-16 px-4 border-b border-[#E5E7EB]">
        <h2 className="text-3xl md:text-5xl font-semibold mb-4">
          Güvenilir veriyle gündemi{' '}
          <span className="bg-[#FFE27A] px-2 py-1 rounded">
            anlayın ve anlatın
          </span>
        </h2>
        <div className="mt-6 max-w-md mx-auto relative">
          <input
            type="text"
            placeholder="Görselleştirme ara…"
            className="w-full px-4 py-3 pr-11 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#006AD4] transition"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            aria-label="Ara"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
        <div className="flex flex-wrap justify-center mt-4 gap-2 text-sm text-[#006AD4]">
          <span className="px-3 py-1 bg-white border border-[#E5E7EB] rounded-full">
            #Enflasyon
          </span>
          <span className="px-3 py-1 bg-white border border-[#E5E7EB] rounded-full">
            #Seçim2024
          </span>
          <span className="px-3 py-1 bg-white border border-[#E5E7EB] rounded-full">
            #Deprem
          </span>
          <span className="px-3 py-1 bg-white border border-[#E5E7EB] rounded-full">
            #İhracat
          </span>
        </div>
        <div className="mt-6" />
      </section>

      <section className="max-w-screen-xl mx-auto px-4 py-12">
        <h3 className="text-xl font-semibold mb-6">Gündemdeki Veriler</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingVisualizations.map((viz) => (
            <Link
              key={viz.id}
              href={`/viz/${viz.id}`}
              className="bg-white border border-[#E5E7EB] p-4 rounded-md hover:shadow-md transition"
              aria-label={`${viz.title} görselleştirmesini aç`}
            >
              <div className="w-full h-40 bg-gray-100 flex items-center justify-center">
                <div className="w-32 h-20">{chartPlaceholders[viz.chartType]}</div>
              </div>
              <div className="mt-4 text-sm text-[#006AD4]">
                {viz.category}
              </div>
              <div className="mt-1 font-medium line-clamp-2">{viz.title}</div>
              <div className="text-xs text-gray-500 mt-1">
                {viz.date} — {viz.source}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-screen-xl mx-auto px-4 py-12">
        <h3 className="text-xl font-semibold mb-6">Kategorilere Göz Atın</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/kategori/${cat.slug}`}
              className="bg-white border border-[#E5E7EB] p-4 rounded-md text-center hover:shadow-sm transition"
            >
              <cat.icon className="mx-auto mb-2 text-[#006AD4]" />
              <div className="font-medium">{cat.name}</div>
            </Link>
          ))}
        </div>
      </section>

      <footer className="bg-white border-t border-[#E5E7EB] py-12 mt-12 text-sm text-gray-600">
        <div className="max-w-screen-xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h5 className="font-semibold text-gray-800 mb-2">Platform</h5>
            <ul className="space-y-1">
              <li><Link href="/kategori/ekonomi">Veri</Link></li>
              <li><Link href="/kategori">Kategoriler</Link></li>
              <li><Link href="/fiyatlandırma">Fiyatlandırma</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-gray-800 mb-2">Şirket</h5>
            <ul className="space-y-1">
              <li><Link href="/hakkinda">Hakkında</Link></li>
              <li><Link href="/iletisim">İletişim</Link></li>
              <li><Link href="/kariyer">Kariyer</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-gray-800 mb-2">Yasal</h5>
            <ul className="space-y-1">
              <li><Link href="/gizlilik">Gizlilik</Link></li>
              <li><Link href="/kosullar">Kullanım Şartları</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-gray-800 mb-2">Dil</h5>
            <button className="underline">Türkçe | English</button>
          </div>
        </div>
      </footer>
    </main>
  )
}
