import Link from 'next/link'
import { getVisualizations } from '@/lib/supabase/queries'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import HomeVisualizationsList from '@/components/HomeVisualizationsList'
import HomeSearchBar from '@/components/HomeSearchBar'

export default async function Home() {
  try {
    const allVisualizations = await getVisualizations({ status: 'published' }) || []
    // Limit to 6 visualizations for homepage (editorial curation)
    const featuredVisualizations = allVisualizations.slice(0, 6)
    const supabase = await createSupabaseServerClient()

    // Load chart data for each visualization (lightweight previews)
    const visualizationsWithCharts = await Promise.all(
      featuredVisualizations.map(async (viz) => {
      let chartData = null
      if (viz.dataset_file) {
        const { data } = await supabase.storage
          .from('datasets')
          .download(viz.dataset_file)
        if (data) {
          const text = await data.text()
          chartData = JSON.parse(text)
        }
      }

      const chartSpec = {
        ...viz.chart_spec,
        data: chartData || viz.chart_spec.data
      }

      return { ...viz, chartSpec }
      })
    )

    return (
    <div className="max-w-6xl mx-auto px-8 py-16">
      {/* Hero section with search */}
      <div className="mb-24 text-center">
        <div className="mb-12">
          <h2 className="text-2xl font-semibold tracking-tight">Güvenilir veriye dayalı gündemi anlayın ve anlatın.</h2>
        </div>
        <HomeSearchBar visualizations={visualizationsWithCharts} />
      </div>

      {/* Visualizations section */}
      <div className="mb-12">
        <h1 className="text-3xl font-semibold mb-8 tracking-tight">Gündemdeki veriler</h1>
        <HomeVisualizationsList 
          visualizations={visualizationsWithCharts}
        />
      </div>

      <div className="text-center mt-20">
        <Link
          href="/koleksiyonlar"
          className="text-sm text-gray-600 hover:underline"
        >
          Tüm görselleştirmeleri keşfet →
        </Link>
      </div>
    </div>
    )
  } catch (error) {
    console.error('Error loading visualizations:', error)
    return (
      <div className="max-w-6xl mx-auto px-8 py-16">
        <div className="text-center py-16">
          <p className="text-gray-600 mb-2">Görselleştirmeler yüklenirken bir hata oluştu.</p>
          <p className="text-sm text-gray-500">Lütfen sayfayı yenileyin.</p>
        </div>
      </div>
    )
  }
}
