'use client'

import { useEffect, useRef } from 'react'
import * as vegaEmbed from 'vega-embed'

interface ChartProps {
  spec: Record<string, any>
  ratio?: '16x9' | '4x3' | 'auto'
}

export default function Chart({ spec, ratio = 'auto' }: ChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!chartRef.current || !spec) return

    const aspectRatios: Record<string, number> = {
      '16x9': 16 / 9,
      '4x3': 4 / 3,
      'auto': 0
    }

    const aspectRatio = aspectRatios[ratio] || 0

    vegaEmbed.default(chartRef.current, spec, {
      actions: false,
      renderer: 'svg',
      ...(aspectRatio > 0 && { aspectRatio })
    }).catch(console.error)
  }, [spec, ratio])

  return <div ref={chartRef} className="w-full" />
}
