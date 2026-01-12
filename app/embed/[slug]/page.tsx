import { notFound } from 'next/navigation'
import { getVisualizationBySlug } from '@/lib/supabase/queries'
import Chart from '@/components/Chart'
import { createSupabaseClient } from '@/lib/supabase/client'

interface PageProps {
  params: {
    slug: string
  }
  searchParams: {
    v?: string
    ratio?: '16x9' | '4x3' | 'auto'
  }
}

export default async function EmbedPage({ params, searchParams }: PageProps) {
  const visualization = await getVisualizationBySlug(params.slug)
  if (!visualization) notFound()

  const version = searchParams.v ? parseInt(searchParams.v) : visualization.embed_version
  if (version !== visualization.embed_version) {
    // In future, fetch historical version from DB
    // For now, use current version
  }

  const ratio = searchParams.ratio || 'auto'

  const supabase = createSupabaseClient()
  let chartData = null

  if (visualization.dataset_file) {
    const { data } = await supabase.storage
      .from('datasets')
      .download(visualization.dataset_file)
    if (data) {
      const text = await data.text()
      chartData = JSON.parse(text)
    }
  }

  const chartSpec = {
    ...visualization.chart_spec,
    data: chartData || visualization.chart_spec.data
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto">
        <Chart spec={chartSpec} ratio={ratio} />
      </div>
    </div>
  )
}
