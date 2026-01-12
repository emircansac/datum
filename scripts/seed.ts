import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const sampleVisualizations = [
  {
    title: 'Türkiye Nüfus Artışı (2010-2023)',
    slug: 'turkiye-nufus-artisi',
    summary: 'Türkiye\'nin nüfusu son 13 yılda yaklaşık 10 milyon kişi arttı.',
    tags: ['demografi', 'nüfus'],
    sources: ['TÜİK - Nüfus Sayımları'],
    status: 'published',
    chart_spec: {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      data: {
        values: [
          { year: 2010, population: 73.7 },
          { year: 2015, population: 78.7 },
          { year: 2020, population: 83.6 },
          { year: 2023, population: 85.8 }
        ]
      },
      mark: 'line',
      encoding: {
        x: { field: 'year', type: 'ordinal' },
        y: { field: 'population', type: 'quantitative', title: 'Nüfus (Milyon)' }
      }
    },
    embed_version: 1
  },
  {
    title: 'Türkiye\'nin En Kalabalık 10 Şehri',
    slug: 'turkiye-en-kalabalik-sehirler',
    summary: 'İstanbul, Türkiye\'nin toplam nüfusunun yaklaşık %18\'ini barındırıyor.',
    tags: ['demografi', 'şehirler'],
    sources: ['TÜİK - ADNKS Sonuçları'],
    status: 'published',
    chart_spec: {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      data: {
        values: [
          { city: 'İstanbul', population: 15.8 },
          { city: 'Ankara', population: 5.8 },
          { city: 'İzmir', population: 4.5 },
          { city: 'Bursa', population: 3.2 },
          { city: 'Antalya', population: 2.7 }
        ]
      },
      mark: 'bar',
      encoding: {
        x: { field: 'city', type: 'nominal', title: 'Şehir' },
        y: { field: 'population', type: 'quantitative', title: 'Nüfus (Milyon)' }
      }
    },
    embed_version: 1
  },
  {
    title: 'Türkiye Ekonomi Büyüme Oranları',
    slug: 'turkiye-ekonomi-buyume',
    summary: '2023 yılında ekonomi %4.5 büyüdü, önceki yıla göre yavaşlama görüldü.',
    tags: ['ekonomi'],
    sources: ['TÜİK - GSYİH Verileri'],
    status: 'published',
    chart_spec: {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      data: {
        values: [
          { year: 2019, growth: 0.9 },
          { year: 2020, growth: 1.8 },
          { year: 2021, growth: 11.4 },
          { year: 2022, growth: 5.5 },
          { year: 2023, growth: 4.5 }
        ]
      },
      mark: 'bar',
      encoding: {
        x: { field: 'year', type: 'ordinal', title: 'Yıl' },
        y: { field: 'growth', type: 'quantitative', title: 'Büyüme (%)' }
      }
    },
    embed_version: 1
  },
  {
    title: 'Türkiye\'de İnternet Kullanım Oranları',
    slug: 'turkiye-internet-kullanim',
    summary: 'Türkiye\'de nüfusun %85\'i düzenli internet kullanıcısı.',
    tags: ['teknoloji', 'dijitalleşme'],
    sources: ['TÜİK - Bilişim Teknolojileri Kullanım Araştırması'],
    status: 'published',
    chart_spec: {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      data: {
        values: [
          { age: '16-24', rate: 96.5 },
          { age: '25-34', rate: 94.2 },
          { age: '35-44', rate: 88.7 },
          { age: '45-54', rate: 75.3 },
          { age: '55-64', rate: 58.1 }
        ]
      },
      mark: 'bar',
      encoding: {
        x: { field: 'age', type: 'nominal', title: 'Yaş Grubu' },
        y: { field: 'rate', type: 'quantitative', title: 'Kullanım Oranı (%)' }
      }
    },
    embed_version: 1
  },
  {
    title: 'Türkiye\'de Eğitim Seviyesi Dağılımı',
    slug: 'turkiye-egitim-seviyesi',
    summary: 'Türkiye\'de nüfusun %35\'i lise ve üzeri eğitim seviyesine sahip.',
    tags: ['eğitim', 'demografi'],
    sources: ['TÜİK - Eğitim İstatistikleri'],
    status: 'published',
    chart_spec: {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      data: {
        values: [
          { level: 'İlkokul', rate: 18.5 },
          { level: 'Ortaokul', rate: 15.3 },
          { level: 'Lise', rate: 22.4 },
          { level: 'Yükseköğretim', rate: 34.8 }
        ]
      },
      mark: 'bar',
      encoding: {
        x: { field: 'level', type: 'nominal', title: 'Eğitim Seviyesi' },
        y: { field: 'rate', type: 'quantitative', title: 'Oran (%)' }
      }
    },
    embed_version: 1
  },
  {
    title: 'Türkiye İhracat ve İthalat Trendi',
    slug: 'turkiye-ihracat-ithalat',
    summary: '2023 yılında ihracat 255 milyar dolar, ithalat 361 milyar dolar olarak gerçekleşti.',
    tags: ['ekonomi', 'dış ticaret'],
    sources: ['TÜİK - Dış Ticaret İstatistikleri'],
    status: 'published',
    chart_spec: {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      data: {
        values: [
          { year: 2020, type: 'İhracat', value: 169.5 },
          { year: 2021, type: 'İhracat', value: 225.4 },
          { year: 2022, type: 'İhracat', value: 254.2 },
          { year: 2023, type: 'İhracat', value: 255.8 },
          { year: 2020, type: 'İthalat', value: 219.5 },
          { year: 2021, type: 'İthalat', value: 271.4 },
          { year: 2022, type: 'İthalat', value: 363.7 },
          { year: 2023, type: 'İthalat', value: 361.2 }
        ]
      },
      mark: 'line',
      encoding: {
        x: { field: 'year', type: 'ordinal', title: 'Yıl' },
        y: { field: 'value', type: 'quantitative', title: 'Milyar Dolar' },
        color: { field: 'type', type: 'nominal' }
      }
    },
    embed_version: 1
  },
  {
    title: 'Türkiye İşsizlik Oranları',
    slug: 'turkiye-issizlik-oranlari',
    summary: '2023 yılında işsizlik oranı %10.1 olarak gerçekleşti.',
    tags: ['ekonomi', 'işgücü'],
    sources: ['TÜİK - İşgücü İstatistikleri'],
    status: 'published',
    chart_spec: {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      data: {
        values: [
          { year: 2019, rate: 13.7 },
          { year: 2020, rate: 13.1 },
          { year: 2021, rate: 12.0 },
          { year: 2022, rate: 10.4 },
          { year: 2023, rate: 10.1 }
        ]
      },
      mark: 'line',
      encoding: {
        x: { field: 'year', type: 'ordinal', title: 'Yıl' },
        y: { field: 'rate', type: 'quantitative', title: 'İşsizlik Oranı (%)' }
      }
    },
    embed_version: 1
  },
  {
    title: 'Türkiye\'de Cinsiyet Dağılımı',
    slug: 'turkiye-cinsiyet-dagilimi',
    summary: 'Türkiye nüfusunun %50.1\'i erkek, %49.9\'u kadın.',
    tags: ['demografi'],
    sources: ['TÜİK - Nüfus İstatistikleri'],
    status: 'published',
    chart_spec: {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      data: {
        values: [
          { gender: 'Erkek', percentage: 50.1 },
          { gender: 'Kadın', percentage: 49.9 }
        ]
      },
      mark: 'bar',
      encoding: {
        x: { field: 'gender', type: 'nominal', title: 'Cinsiyet' },
        y: { field: 'percentage', type: 'quantitative', title: 'Oran (%)' }
      }
    },
    embed_version: 1
  },
  {
    title: 'Türkiye\'de Sosyal Medya Kullanımı',
    slug: 'turkiye-sosyal-medya-kullanim',
    summary: 'Türkiye\'de internet kullanıcılarının %92\'si sosyal medya kullanıyor.',
    tags: ['teknoloji', 'dijitalleşme'],
    sources: ['TÜİK - Bilişim Teknolojileri Kullanım Araştırması'],
    status: 'published',
    chart_spec: {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      data: {
        values: [
          { platform: 'Facebook', users: 45.2 },
          { platform: 'Instagram', users: 58.7 },
          { platform: 'Twitter', users: 32.1 },
          { platform: 'LinkedIn', users: 18.5 }
        ]
      },
      mark: 'bar',
      encoding: {
        x: { field: 'platform', type: 'nominal', title: 'Platform' },
        y: { field: 'users', type: 'quantitative', title: 'Kullanıcı Oranı (%)' }
      }
    },
    embed_version: 1
  },
  {
    title: 'Türkiye\'de Yaş Gruplarına Göre Nüfus',
    slug: 'turkiye-yas-gruplari',
    summary: 'Türkiye nüfusunun %23.4\'ü 0-14 yaş aralığında.',
    tags: ['demografi'],
    sources: ['TÜİK - Nüfus İstatistikleri'],
    status: 'published',
    chart_spec: {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      data: {
        values: [
          { age: '0-14', percentage: 23.4 },
          { age: '15-64', percentage: 67.8 },
          { age: '65+', percentage: 8.8 }
        ]
      },
      mark: 'bar',
      encoding: {
        x: { field: 'age', type: 'nominal', title: 'Yaş Grubu' },
        y: { field: 'percentage', type: 'quantitative', title: 'Oran (%)' }
      }
    },
    embed_version: 1
  },
  {
    title: 'Türkiye\'de Enflasyon Trendi',
    slug: 'turkiye-enflasyon-trendi',
    summary: '2023 yılında TÜFE yıllık enflasyon %64.27 olarak gerçekleşti.',
    tags: ['ekonomi'],
    sources: ['TÜİK - Tüketici Fiyat Endeksi'],
    status: 'published',
    chart_spec: {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      data: {
        values: [
          { year: 2019, inflation: 11.84 },
          { year: 2020, inflation: 14.60 },
          { year: 2021, inflation: 36.08 },
          { year: 2022, inflation: 64.27 },
          { year: 2023, inflation: 64.27 }
        ]
      },
      mark: 'line',
      encoding: {
        x: { field: 'year', type: 'ordinal', title: 'Yıl' },
        y: { field: 'inflation', type: 'quantitative', title: 'Enflasyon (%)' }
      }
    },
    embed_version: 1
  },
  {
    title: 'Türkiye\'de Şehirleşme Oranı',
    slug: 'turkiye-sehirlesme-orani',
    summary: 'Türkiye nüfusunun %93.2\'si şehirlerde yaşıyor.',
    tags: ['demografi', 'şehirler'],
    sources: ['TÜİK - Nüfus İstatistikleri'],
    status: 'published',
    chart_spec: {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      data: {
        values: [
          { type: 'Şehir', percentage: 93.2 },
          { type: 'Kırsal', percentage: 6.8 }
        ]
      },
      mark: 'bar',
      encoding: {
        x: { field: 'type', type: 'nominal', title: 'Yerleşim' },
        y: { field: 'percentage', type: 'quantitative', title: 'Oran (%)' }
      }
    },
    embed_version: 1
  },
  {
    title: 'Türkiye\'de Mobil İnternet Kullanımı',
    slug: 'turkiye-mobil-internet',
    summary: 'İnternet kullanıcılarının %98\'i mobil cihazlardan internete erişiyor.',
    tags: ['teknoloji', 'mobil'],
    sources: ['TÜİK - Bilişim Teknolojileri Kullanım Araştırması'],
    status: 'published',
    chart_spec: {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      data: {
        values: [
          { device: 'Mobil', percentage: 98.2 },
          { device: 'Masaüstü', percentage: 45.3 },
          { device: 'Tablet', percentage: 32.1 }
        ]
      },
      mark: 'bar',
      encoding: {
        x: { field: 'device', type: 'nominal', title: 'Cihaz' },
        y: { field: 'percentage', type: 'quantitative', title: 'Kullanım Oranı (%)' }
      }
    },
    embed_version: 1
  }
]

const sampleCollections = [
  {
    title: 'Demografi',
    slug: 'demografi',
    description: 'Türkiye\'nin nüfus yapısı, büyüme trendleri ve demografik dönüşümler.',
    visualization_ids: [] // Will be filled after visualizations are created
  },
  {
    title: 'Ekonomi',
    slug: 'ekonomi',
    description: 'Ekonomik göstergeler, büyüme oranları ve makroekonomik trendler.',
    visualization_ids: []
  },
  {
    title: 'Teknoloji ve Dijitalleşme',
    slug: 'teknoloji',
    description: 'İnternet kullanımı, dijital dönüşüm ve teknoloji adaptasyonu.',
    visualization_ids: []
  },
  {
    title: 'Türkiye İstatistikleri',
    slug: 'turkiye-istatistikleri',
    description: 'Türkiye genelinde çeşitli konularda temel istatistikler ve göstergeler.',
    visualization_ids: []
  }
]

async function seed() {
  console.log('Seeding database...')

  // Insert visualizations
  const vizIds: string[] = []
  for (const viz of sampleVisualizations) {
    const { data, error } = await supabase
      .from('visualizations')
      .insert({
        ...viz,
        last_updated: new Date().toISOString()
      })
      .select('id')
      .single()

    if (error) {
      console.error('Error inserting visualization:', viz.title, error)
    } else {
      vizIds.push(data.id)
      console.log('Inserted:', viz.title)
    }
  }

  // Update collections with visualization IDs
  sampleCollections[0].visualization_ids = [vizIds[0], vizIds[1], vizIds[4], vizIds[7], vizIds[9], vizIds[10]] // Demografi
  sampleCollections[1].visualization_ids = [vizIds[2], vizIds[5], vizIds[6], vizIds[11]] // Ekonomi
  sampleCollections[2].visualization_ids = [vizIds[3], vizIds[8], vizIds[12]] // Teknoloji
  sampleCollections[3].visualization_ids = [vizIds[0], vizIds[2], vizIds[5], vizIds[6], vizIds[9], vizIds[11]] // Türkiye İstatistikleri

  // Insert collections
  for (const col of sampleCollections) {
    const { error } = await supabase
      .from('collections')
      .insert(col)

    if (error) {
      console.error('Error inserting collection:', col.title, error)
    } else {
      console.log('Inserted:', col.title)
    }
  }

  // Get collection IDs after insertion
  const { data: insertedCollections } = await supabase
    .from('collections')
    .select('id, slug')
    .in('slug', sampleCollections.map(c => c.slug))

  const collectionMap: Record<string, string> = {}
  insertedCollections?.forEach(col => {
    collectionMap[col.slug] = col.id
  })

  // Update visualization collection_ids
  await supabase
    .from('visualizations')
    .update({ collection_ids: [collectionMap['demografi']] })
    .in('id', [vizIds[0], vizIds[1], vizIds[4], vizIds[7], vizIds[9], vizIds[10]])

  await supabase
    .from('visualizations')
    .update({ collection_ids: [collectionMap['ekonomi']] })
    .in('id', [vizIds[2], vizIds[5], vizIds[6], vizIds[11]])

  await supabase
    .from('visualizations')
    .update({ collection_ids: [collectionMap['teknoloji']] })
    .in('id', [vizIds[3], vizIds[8], vizIds[12]])

  console.log('Seeding complete!')
}

seed().catch(console.error)
