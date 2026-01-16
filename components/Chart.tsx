'use client'

import { useEffect, useRef } from 'react'
import * as vegaEmbed from 'vega-embed'

interface ChartProps {
  spec: Record<string, any>
  ratio?: '16x9' | '4x3' | 'auto'
}

export default function Chart({ spec, ratio = 'auto' }: ChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<any>(null) // Store vega-embed view instance

  useEffect(() => {
    // CRITICAL: Always render something, even if spec is invalid
    // The component must never unmount - only update the visualization
    if (!chartRef.current) return

    // Clean up previous view instance before creating new one
    // This prevents flicker by ensuring only one instance exists
    if (viewRef.current) {
      try {
        viewRef.current.finalize()
      } catch (err) {
        // Ignore cleanup errors (view might already be finalized)
      }
      viewRef.current = null
      
      // Clear the container content
      if (chartRef.current) {
        chartRef.current.innerHTML = ''
      }
    }

    // Ensure spec is always a valid object (fallback to empty spec)
    const validSpec = spec && typeof spec === 'object' ? spec : {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      width: 'container',
      height: 400,
      data: { values: [] },
      mark: 'bar'
    }

    const aspectRatios: Record<string, number> = {
      '16x9': 16 / 9,
      '4x3': 4 / 3,
      'auto': 0
    }

    const aspectRatio = aspectRatios[ratio] || 0

    // Create new vega-embed view instance
    vegaEmbed.default(chartRef.current, validSpec, {
      actions: false,
      renderer: 'svg',
      ...(aspectRatio > 0 && { aspectRatio })
    })
      .then(result => {
        // Store the view instance for cleanup
        viewRef.current = result.view
      })
      .catch(console.error)

    // Cleanup function: finalize view when component unmounts or spec changes
    return () => {
      if (viewRef.current) {
        try {
          viewRef.current.finalize()
        } catch (err) {
          // Ignore cleanup errors
        }
        viewRef.current = null
      }
    }
  }, [spec, ratio])

  // CRITICAL: Component never unmounts - always render the container
  // This prevents React from destroying and recreating the component
  return <div ref={chartRef} className="w-full" />
}
