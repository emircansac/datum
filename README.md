# Datum

Datum, Türkiye için tasarlanmış temiz, minimal ve editöryel bir veri görselleştirme platformudur.

## Özellikler

- **Halka Açık Website**: Grafikleri görüntüleme ve gömme
- **Koleksiyonlar**: Playlist tarzı görselleştirme grupları
- **Gömme Desteği**: Her grafik için iframe embed kodu
- **Admin Paneli**: Görselleştirmeleri ve koleksiyonları yönetme
- **Temiz Tasarım**: General Sans font ile minimal, editöryel UI

## Teknoloji Yığını

- **Next.js 14** (App Router): SEO dostu, dosya tabanlı routing
- **React 18**: UI framework
- **TypeScript**: Tip güvenliği
- **Tailwind CSS**: Utility-first CSS framework
- **Recharts**: React chart kütüphanesi
- **JSON**: Veri depolama (yerel dosyalar)

### Teknik Kararlar

1. **Next.js App Router**: SEO optimizasyonu ve statik üretim için seçildi
2. **JSON Dosyaları**: Basitlik ve bakım kolaylığı için veritabanı yerine JSON kullanıldı
3. **Recharts**: React için hafif ve esnek chart kütüphanesi
4. **Cookie-based Auth**: Admin paneli için basit cookie tabanlı kimlik doğrulama
5. **Tailwind CSS**: Hızlı geliştirme ve tutarlı tasarım için

## Kurulum

1. Bağımlılıkları yükleyin:
```bash
npm install
```

2. Ortam değişkenlerini ayarlayın:
```bash
cp .env.local.example .env.local
```

`.env.local` dosyasını düzenleyin ve `ADMIN_PASSWORD` değerini değiştirin.

3. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

4. Tarayıcıda [http://localhost:3000](http://localhost:3000) adresini açın.

## Proje Yapısı

```
datum/
├── app/                    # Next.js App Router sayfaları
│   ├── admin/             # Admin paneli sayfaları
│   ├── collections/       # Koleksiyon sayfaları
│   ├── embed/            # Embed sayfaları
│   ├── viz/              # Görselleştirme sayfaları
│   └── layout.tsx        # Ana layout
├── components/            # React bileşenleri
│   ├── Chart.tsx         # Grafik bileşeni
│   ├── Layout.tsx        # Ana layout bileşeni
│   └── EmbedCode.tsx     # Embed kodu bileşeni
├── data/                 # JSON veri dosyaları
│   ├── visualizations.json
│   └── collections.json
├── lib/                  # Yardımcı fonksiyonlar
│   ├── data.ts          # Veri erişim katmanı
│   └── auth.ts          # Kimlik doğrulama
└── types/               # TypeScript tip tanımları
```

## Sayfalar

### Halka Açık

- `/` - Ana sayfa
- `/about` - Hakkında
- `/collections` - Koleksiyon listesi
- `/collections/[slug]` - Koleksiyon detayı
- `/viz/[slug]` - Görselleştirme sayfası
- `/embed/[slug]` - Embed görünümü

### Admin

- `/admin` - Admin dashboard
- `/admin/login` - Admin girişi
- `/admin/viz` - Görselleştirme yönetimi
- `/admin/viz/[slug]` - Görselleştirme detayı
- `/admin/collections` - Koleksiyon yönetimi
- `/admin/collections/[slug]` - Koleksiyon detayı

## Veri Modeli

### Visualization (Görselleştirme)

```typescript
{
  slug: string
  title: string
  takeaway: string
  description: string
  sources: string[]
  methodology: string
  lastUpdated: string
  collections: string[]
  chartType: 'bar' | 'line' | 'pie' | 'area' | 'scatter'
  chartData: ChartDataPoint[]
}
```

### Collection (Koleksiyon)

```typescript
{
  slug: string
  title: string
  description: string
  visualizations: string[]
}
```

## Geliştirme

### Yeni Görselleştirme Ekleme

1. `data/visualizations.json` dosyasına yeni bir görselleştirme ekleyin
2. İlgili koleksiyonların `visualizations` dizisine slug'ı ekleyin

### Yeni Koleksiyon Ekleme

1. `data/collections.json` dosyasına yeni bir koleksiyon ekleyin
2. İlgili görselleştirmelerin `collections` dizisine slug'ı ekleyin

## Deployment

Bu proje Vercel, Netlify veya benzeri platformlarda ücretsiz olarak deploy edilebilir.

1. GitHub'a push edin
2. Vercel/Netlify'a bağlayın
3. Ortam değişkenlerini ayarlayın (`ADMIN_PASSWORD`, `NEXT_PUBLIC_SITE_URL`)

## Lisans

Özel proje - Tüm hakları saklıdır.
