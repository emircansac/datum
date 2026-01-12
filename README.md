# Datum v2

Türkiye için editöryel veri görselleştirme platformu. Next.js, Supabase ve Vega-Lite ile geliştirilmiştir.

## Özellikler

- 📊 Vega-Lite ile interaktif grafikler
- 🔐 Supabase Auth ile admin paneli
- 📦 Koleksiyonlar ile görselleştirme organizasyonu
- 🔗 Versiyonlu embed desteği
- 🎨 Minimal, editöryel tasarım

## Yerel Kurulum

### 1. Bağımlılıkları Yükleyin

```bash
npm install
```

### 2. Supabase Projesi Oluşturun

1. [Supabase](https://supabase.com) hesabı oluşturun
2. Yeni proje oluşturun
3. Proje ayarlarından şunları alın:
   - Project URL
   - Anon (public) key
   - Service role key

### 3. Ortam Değişkenlerini Ayarlayın

`.env.local` dosyası oluşturun:

```bash
cp .env.example .env.local
```

`.env.local` dosyasını düzenleyin ve Supabase bilgilerinizi girin:

```
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Veritabanı Migrasyonlarını Çalıştırın

1. Supabase Dashboard → SQL Editor'e gidin
2. `supabase/migrations/001_initial_schema.sql` dosyasının içeriğini kopyalayın
3. SQL Editor'de çalıştırın

### 5. Storage Bucket'ları Oluşturun

Supabase Dashboard → Storage'a gidin ve şu bucket'ları oluşturun:
- `datasets` (private)
- `thumbs` (public)
- `social` (public)

### 6. Seed Verilerini Yükleyin

```bash
npm run seed
```

Bu komut 12 görselleştirme ve 4 koleksiyon oluşturur.

### 7. Geliştirme Sunucusunu Başlatın

```bash
npm run dev
```

Tarayıcıda [http://localhost:3000](http://localhost:3000) adresini açın.

## Admin Paneli

1. Supabase Dashboard → Authentication → Users
2. Yeni kullanıcı oluşturun
3. User Metadata'ya `role: "admin"` veya `role: "editor"` ekleyin
4. `/admin/login` sayfasından giriş yapın

## Vercel'e Deploy

### 1. GitHub'a Push Edin

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Vercel'e Bağlayın

1. [Vercel](https://vercel.com) hesabı oluşturun
2. GitHub repository'nizi import edin
3. Environment variables ekleyin:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_SITE_URL` (Vercel URL'iniz)

### 3. Deploy

Vercel otomatik olarak deploy edecektir.

## Proje Yapısı

```
datum-v2/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin paneli
│   ├── embed/             # Embed sayfaları
│   ├── koleksiyonlar/     # Koleksiyon sayfaları
│   └── viz/               # Görselleştirme sayfaları
├── components/            # React bileşenleri
├── lib/                   # Yardımcı fonksiyonlar
│   └── supabase/          # Supabase client'ları
├── supabase/
│   └── migrations/        # SQL migrasyonları
├── scripts/               # Seed ve utility scriptleri
└── types/                 # TypeScript tip tanımları
```

## Komutlar

- `npm run dev` - Geliştirme sunucusu
- `npm run build` - Production build
- `npm run start` - Production sunucu
- `npm run seed` - Veritabanını seed et
- `npm run lint` - Lint kontrolü

## Teknolojiler

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage
- **Charts**: Vega-Lite
- **Styling**: Tailwind CSS
- **Language**: TypeScript
