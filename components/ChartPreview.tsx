'use client'

import Chart from './Chart'

interface ChartPreviewProps {
  spec: Record<string, any>
}

export default function ChartPreview({ spec }: ChartPreviewProps) {
  return (
    <div className="w-full h-full">
      <Chart spec={spec} />
    </div>
  )
}
