/**
 * Chart Templates for Datum Editor
 * FOCUS: Time Series Line (Publication-Grade Implementation)
 * 
 * This file implements a COMPLETE, OWID-quality time series chart system.
 * Other templates remain as stubs for future implementation.
 */

export type ChartTemplateId =
  | 'time-series-line'
  | 'time-series-area'
  | 'category-bar'
  | 'dot-plot'
  | 'ranked-bar'
  | 'scatter'
  | 'stacked-bar'
  | 'stacked-area'
  | 'slope-chart'
  | 'histogram'
  | 'turkey-map'
  | 'simple-table'

export type ColorMode = 'monochrome' | 'single-color' | 'multi-color'
export type LabelSize = 'small' | 'medium' | 'large'
export type NumberFormat = 'comma' | 'dot'
export type LogoSize = 'small' | 'medium'
export type BarLabelPlacement = 'off' | 'auto' | 'above' | 'below' | 'end' | 'left' | 'right'
export type BarLabelSource = 'none' | 'value' | 'series' | 'category' | 'value+series'

export interface EditorialOptions {
  // Chart titles
  title?: string
  subtitle?: string
  topNote?: string
  bottomNote?: string
  
  // Axis labels
  xAxisLabel?: string
  yAxisLabel?: string
  
  // Formatting
  unit?: string
  numberFormat?: NumberFormat
  
  // Visual options
  colorMode?: ColorMode
  showLabels?: boolean
  labelSize?: LabelSize
  showLegend?: boolean
  barLabelPlacement?: BarLabelPlacement
  barLabelSource?: BarLabelSource
  barYAxisMode?: 'auto' | 'custom'
  lineEndLabels?: boolean
  dotPlotOrientation?: 'horizontal' | 'vertical'
  stackedAreaOrientation?: 'horizontal' | 'vertical'
  slopeChartOrientation?: 'horizontal' | 'vertical'
  slopeChartShowValueLabels?: boolean
  histogramBinCount?: number
  
  // Footer branding (optional)
  showDatumLogo?: boolean
  datumLogoSize?: LogoSize
  
  // Accessibility
  accessibilityDescription?: string
}

export interface ChartTemplate {
  id: ChartTemplateId
  name: string
  description: string
  requiredFields: Array<{
    key: string
    label: string
    description?: string
    allowMultiple?: boolean
  }>
  supportsLegend?: boolean
  supportsMultiSeries?: boolean
}

// ONLY TIME SERIES LINE IS FULLY IMPLEMENTED
export const CHART_TEMPLATES: Record<ChartTemplateId, ChartTemplate> = {
  'time-series-line': {
    id: 'time-series-line',
    name: 'Zaman Serisi (Çizgi + Nokta)',
    description: 'Aylar veya yıllar içindeki değişimi göstermek için',
    requiredFields: [
      { 
        key: 'time', 
        label: 'Zaman sütunu', 
        description: 'Tarih veya yıl bilgisi içeren sütun' 
      },
      { 
        key: 'value', 
        label: 'Değer sütunları', 
        description: 'Karşılaştırılacak sayısal değerler (birden fazla seçilebilir)', 
        allowMultiple: true 
      }
    ],
    supportsLegend: true,
    supportsMultiSeries: true
  },
  // OTHER TEMPLATES (STUBS - NOT IMPLEMENTED)
  'time-series-area': {
    id: 'time-series-area',
    name: 'Zaman Serisi (Alan)',
    description: '[Henüz implement edilmedi]',
    requiredFields: [],
    supportsLegend: false,
    supportsMultiSeries: false
  },
  'category-bar': {
    id: 'category-bar',
    name: 'Kategori Karşılaştırma (Dikey Bar)',
    description: '[Henüz implement edilmedi]',
    requiredFields: [],
    supportsLegend: false,
    supportsMultiSeries: false
  },
  'dot-plot': {
    id: 'dot-plot',
    name: 'Nokta Grafiği (Dot Plot)',
    description: 'Tek bir zaman noktasında birden fazla varlığı karşılaştırmak için',
    requiredFields: [
      { 
        key: 'time', 
        label: 'Kategori sütunu', 
        description: 'Varlık adı içeren sütun (ör. Ülke, Kurum)' 
      },
      { 
        key: 'value', 
        label: 'Değer sütunu', 
        description: 'Ölçüm sütunu (ilk seçilen sütun kullanılır)' 
      }
    ],
    supportsLegend: false,
    supportsMultiSeries: false
  },
  'ranked-bar': {
    id: 'ranked-bar',
    name: 'Sıralı Karşılaştırma (En Yüksek / En Düşük)',
    description: '[Henüz implement edilmedi]',
    requiredFields: [],
    supportsLegend: false,
    supportsMultiSeries: false
  },
  'scatter': {
    id: 'scatter',
    name: 'Dağılım Grafiği (Nokta)',
    description: '[Henüz implement edilmedi]',
    requiredFields: [],
    supportsLegend: false,
    supportsMultiSeries: false
  },
  'stacked-bar': {
    id: 'stacked-bar',
    name: 'Yığılmış Bar (Oran Dağılımı)',
    description: '[Henüz implement edilmedi]',
    requiredFields: [],
    supportsLegend: false,
    supportsMultiSeries: false
  },
  'stacked-area': {
    id: 'stacked-area',
    name: 'Yığılmış Alan Grafiği (Stacked Area)',
    description: 'Zaman içinde serilerin kümülatif katkısını göstermek için',
    requiredFields: [
      { 
        key: 'time', 
        label: 'Zaman sütunu', 
        description: 'Tarih veya yıl bilgisi içeren sütun' 
      },
      { 
        key: 'value', 
        label: 'Değer sütunları', 
        description: 'Karşılaştırılacak sayısal değerler (birden fazla seçilebilir)', 
        allowMultiple: true 
      }
    ],
    supportsLegend: true,
    supportsMultiSeries: true
  },
  'slope-chart': {
    id: 'slope-chart',
    name: 'Eğim Grafiği (Slope Chart)',
    description: 'İki zaman noktası arasındaki değişimi karşılaştırmak için',
    requiredFields: [
      { 
        key: 'time', 
        label: 'Zaman sütunu', 
        description: 'Tarih veya yıl bilgisi içeren sütun (tam olarak 2 değer)' 
      },
      { 
        key: 'value', 
        label: 'Değer sütunları', 
        description: 'Karşılaştırılacak sayısal değerler (birden fazla seçilebilir)', 
        allowMultiple: true 
      }
    ],
    supportsLegend: true,
    supportsMultiSeries: true
  },
  'histogram': {
    id: 'histogram',
    name: 'Histogram',
    description: 'Tek bir sayısal değişkenin dağılımını göstermek için',
    requiredFields: [
      { 
        key: 'value', 
        label: 'Değer sütunu', 
        description: 'Dağılımı gösterilecek sayısal değer' 
      }
    ],
    supportsLegend: false,
    supportsMultiSeries: false
  },
  'turkey-map': {
    id: 'turkey-map',
    name: 'Türkiye Haritası (İl Bazlı)',
    description: '[Henüz implement edilmedi]',
    requiredFields: [],
    supportsLegend: false,
    supportsMultiSeries: false
  },
  'simple-table': {
    id: 'simple-table',
    name: 'Editoryal Tablo',
    description: '[Henüz implement edilmedi]',
    requiredFields: [],
    supportsLegend: false,
    supportsMultiSeries: false
  }
}

/**
 * OWID-Quality Color Palettes
 * Based on perceptual research and accessibility standards
 */
const COLOR_PALETTES = {
  // Monochrome (single color, different shades)
  monochrome: [
    '#000000', '#2d2d2d', '#5a5a5a', '#878787', '#b4b4b4', '#e1e1e1'
  ],
  
  // Single color (blues - excellent for time series)
  singleColor: [
    '#08519c', '#3182bd', '#6baed6', '#9ecae1', '#c6dbef', '#deebf7'
  ],
  
  // Multi-color (categorical, maximum distinction)
  multiColor: [
    '#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33',
    '#a65628', '#f781bf', '#999999', '#66c2a5', '#fc8d62', '#8da0cb'
  ]
}

/**
 * Get accessible color palette based on mode
 */
function getColorPalette(mode: ColorMode = 'multi-color'): string[] {
  switch (mode) {
    case 'monochrome':
      return COLOR_PALETTES.monochrome
    case 'single-color':
      return COLOR_PALETTES.singleColor
    case 'multi-color':
      return COLOR_PALETTES.multiColor
    default:
      return COLOR_PALETTES.multiColor
  }
}

/**
 * Format number based on selected format
 */
function getNumberFormat(format: NumberFormat = 'comma'): string {
  switch (format) {
    case 'dot':
      return ',.0f'  // 1.234 (with thousand separator)
    case 'comma':
      return ',.0f'  // 1,234 (with thousand separator)
    default:
      return ',.0f'
  }
}

/**
 * Get label font size
 */
function getLabelSize(size: LabelSize = 'medium'): number {
  switch (size) {
    case 'small':
      return 10
    case 'medium':
      return 12
    case 'large':
      return 14
    default:
      return 12
  }
}

/**
 * Transform wide-format data to long-format for multi-series
 * This is the OWID pattern: one row per (time, series, value) combination
 */
function transformToLongFormat(
  data: Array<Record<string, any>>,
  timeField: string,
  valueFields: string[]
): Array<{ time: any; value: any; series: string }> {
  const longData: Array<{ time: any; value: any; series: string }> = []
  
  data.forEach(row => {
    const timeValue = row[timeField]
    
    valueFields.forEach(valueField => {
      const value = row[valueField]
      
      // Only add if value exists (handle missing data gracefully)
      if (value !== null && value !== undefined && value !== '') {
        longData.push({
          time: timeValue,
          value: typeof value === 'number' ? value : parseFloat(value),
          series: valueField
        })
      }
    })
  })
  
  return longData
}

/**
 * Parse time value to Date (handles various formats)
 * CRITICAL: Always returns Date for proper temporal encoding
 */
function parseTimeValue(value: any): Date {
  // If it's already a Date, return it
  if (value instanceof Date) return value
  
  // If it's a number (year), convert to January 1st of that year
  if (typeof value === 'number') {
    return new Date(value, 0, 1)
  }
  
  // Try parsing as date string
  if (typeof value === 'string') {
    const trimmed = value.trim()
    
    // Check if it's just a year (e.g. "2020")
    if (/^\d{4}$/.test(trimmed)) {
      const year = parseInt(trimmed)
      return new Date(year, 0, 1)
    }
    
    // Try parsing as full date
    const parsed = new Date(trimmed)
    if (!isNaN(parsed.getTime())) {
      return parsed
    }
  }
  
  // Fallback: return current date (should not happen with valid data)
  return new Date()
}

/**
 * Generate PUBLICATION-GRADE Vega-Lite spec for Time Series Line
 * Based on OWID quality standards
 */
export function generateTimeSeriesLineSpec(
  data: Array<Record<string, any>>,
  timeColumn: string,
  valueColumns: string[],
  options: EditorialOptions = {}
): Record<string, any> {
  // CRITICAL SAFEGUARD: Prevent time column from appearing as a series
  // Filter out time column from value columns (defensive programming)
  const safeValueColumns = valueColumns.filter(col => col !== timeColumn)
  
  // Fail-safe: If no valid value columns remain, throw error
  if (safeValueColumns.length === 0) {
    throw new Error('Zaman sütunu grafik değerleri arasında yer alamaz.')
  }
  
  // Transform data based on series count (use SAFE value columns)
  const isMultiSeries = safeValueColumns.length > 1
  const colorPalette = getColorPalette(options.colorMode || 'multi-color')
  const labelSize = getLabelSize(options.labelSize)
  const numberFormat = getNumberFormat(options.numberFormat)
  const yAxisTitle = options.yAxisLabel || safeValueColumns[0] || 'Değer'
  const canRenderLineLabels = options.lineEndLabels === true && safeValueColumns.length <= 6
  
  // Process time values
  const processedData = data.map(row => ({
    ...row,
    [timeColumn]: parseTimeValue(row[timeColumn])
  }))
  
  if (isMultiSeries) {
    // MULTI-SERIES: Transform to long format (using SAFE value columns)
    const longData = transformToLongFormat(processedData, timeColumn, safeValueColumns)
    
    return {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      width: 'container',
      height: 400,
      padding: { left: 10, right: 10, top: 30, bottom: 10 },
      background: 'white',
      
      // Title configuration (OWID style)
      ...(options.title && {
        title: {
          text: options.title,
          subtitle: options.subtitle,
          anchor: 'start',
          fontSize: 18,
          fontWeight: 600,
          subtitleFontSize: 14,
          subtitleColor: '#666',
          offset: 20
        }
      }),
      
      data: { values: longData },
      
      // Layer: Line + Points + Optional Logo
      layer: [
        // Line layer
        {
          mark: {
            type: 'line',
            strokeWidth: 2,
            tooltip: true,
            point: false  // Points come from separate layer
          },
          encoding: {
            x: {
              field: 'time',
              type: 'temporal',
              title: options.xAxisLabel || timeColumn,
              axis: {
                labelAngle: 0,
                labelFontSize: labelSize,
                titleFontSize: labelSize + 2,
                grid: false,
                tickCount: 8,
                labelOverlap: true,
                format: '%Y'  // Always use year format for temporal data
              },
              scale: {
                nice: true
              }
            },
            y: {
              field: 'value',
              type: 'quantitative',
              title: yAxisTitle,
              axis: {
                labelFontSize: labelSize,
                titleFontSize: labelSize + 2,
                grid: true,
                gridOpacity: 0.3,
                format: numberFormat,
                tickCount: 6
              },
              scale: {
                zero: false,  // OWID: Don't force zero unless data requires it
                nice: true
              }
            },
            color: {
              field: 'series',
              type: 'nominal',
              title: null,
              scale: {
                range: colorPalette
              },
              legend: options.showLegend !== false ? {
                orient: 'top',
                direction: 'horizontal',
                titleFontSize: labelSize,
                labelFontSize: labelSize,
                symbolSize: 100,
                symbolStrokeWidth: 2,
                offset: 10
              } : null
            },
            strokeWidth: { value: 2 }
          }
        },
        // Points layer (for exact values)
        {
          mark: {
            type: 'point',
            filled: true,
            size: 60,
            tooltip: true
          },
          encoding: {
            x: { field: 'time', type: 'temporal' },
            y: { field: 'value', type: 'quantitative' },
            color: {
              field: 'series',
              type: 'nominal',
              scale: { range: colorPalette },
              legend: null  // Only show legend once
            },
            tooltip: [
              { field: 'series', type: 'nominal', title: 'Seri' },
              { field: 'time', type: 'temporal', title: 'Zaman', format: typeof longData[0]?.time === 'number' ? 'd' : '%Y-%m-%d' },
              { field: 'value', type: 'quantitative', title: 'Değer', format: numberFormat }
            ]
          }
        },
        ...(canRenderLineLabels ? [{
          transform: [
            { joinaggregate: [{ op: 'max', field: 'time', as: 'maxTime' }], groupby: ['series'] },
            { filter: 'datum.time === datum.maxTime' }
          ],
          mark: {
            type: 'text',
            align: 'left',
            baseline: 'middle',
            dx: 8,
            dy: -6,
            fontSize: labelSize,
            fontWeight: 600
          },
          encoding: {
            x: { field: 'time', type: 'temporal' },
            y: { field: 'value', type: 'quantitative' },
            text: { field: 'value', type: 'quantitative', format: numberFormat },
            color: {
              field: 'series',
              type: 'nominal',
              scale: { range: colorPalette },
              legend: null
            },
            opacity: {
              condition: { test: 'datum.value != null', value: 1 },
              value: 0
            }
          }
        }] : []),
        // Datum logo (optional, bottom-right)
        ...(options.showDatumLogo ? [{
          data: { values: [{}] },
          mark: {
            type: 'text',
            align: 'right',
            baseline: 'bottom',
            dx: -10,
            dy: -10,
            fontSize: options.datumLogoSize === 'medium' ? 14 : 11,
            color: '#999',
            font: 'sans-serif',
            fontWeight: 600
          },
          encoding: {
            x: { value: 'width' },
            y: { value: 'height' },
            text: { value: 'Datum' }
          }
        }] : [])
      ],
      
      // Config (OWID quality defaults)
      config: {
        view: {
          stroke: 'transparent'
        },
        axis: {
          domainColor: '#333',
          domainWidth: 1,
          tickColor: '#333',
          tickWidth: 1,
          labelColor: '#333',
          titleColor: '#333'
        },
        legend: {
          strokeColor: '#ccc',
          padding: 10,
          cornerRadius: 4
        }
      }
    }
  } else {
    // SINGLE SERIES: Simpler spec (using SAFE value columns)
    const singleValueColumn = safeValueColumns[0]
    const singleSeriesData = processedData.map(row => ({
      time: row[timeColumn],
      value: typeof row[singleValueColumn] === 'number' ? row[singleValueColumn] : parseFloat(row[singleValueColumn])
    })).filter(row => row.value !== null && !isNaN(row.value))
    
    const singleColor = colorPalette[0]
    
    const yAxisTitleSingle = options.yAxisLabel || singleValueColumn || 'Değer'
    const canRenderSingleLineLabel = options.lineEndLabels === true

    return {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      width: 'container',
      height: 400,
      padding: { left: 10, right: 10, top: 30, bottom: 10 },
      background: 'white',
      
      // Title configuration
      ...(options.title && {
        title: {
          text: options.title,
          subtitle: options.subtitle,
          anchor: 'start',
          fontSize: 18,
          fontWeight: 600,
          subtitleFontSize: 14,
          subtitleColor: '#666',
          offset: 20
        }
      }),
      
      data: { values: singleSeriesData },
      
      layer: [
        {
          mark: {
            type: 'line',
            strokeWidth: 2,
            color: singleColor,
            tooltip: true
          },
          encoding: {
            x: {
              field: 'time',
              type: 'temporal',
              title: options.xAxisLabel || timeColumn,
              axis: {
                labelAngle: 0,
                labelFontSize: labelSize,
                titleFontSize: labelSize + 2,
                grid: false,
                tickCount: 8,
                labelOverlap: true,
                format: '%Y'  // Always use year format for temporal data
              },
              scale: {
                nice: true
              }
            },
            y: {
              field: 'value',
              type: 'quantitative',
              title: yAxisTitleSingle,
              axis: {
                labelFontSize: labelSize,
                titleFontSize: labelSize + 2,
                grid: true,
                gridOpacity: 0.3,
                format: numberFormat,
                tickCount: 6
              },
              scale: {
                zero: false,
                nice: true
              }
            }
          }
        },
        {
          mark: {
            type: 'point',
            filled: true,
            size: 60,
            color: singleColor,
            tooltip: true
          },
          encoding: {
            x: { field: 'time', type: 'temporal' },
            y: { field: 'value', type: 'quantitative' },
            tooltip: [
              { field: 'time', type: 'temporal', title: 'Zaman', format: '%Y' },
              { field: 'value', type: 'quantitative', title: 'Değer', format: numberFormat }
            ]
          }
        },
        ...(canRenderSingleLineLabel ? [{
          transform: [
            { joinaggregate: [{ op: 'max', field: 'time', as: 'maxTime' }] },
            { filter: 'datum.time === datum.maxTime' }
          ],
          mark: {
            type: 'text',
            align: 'left',
            baseline: 'middle',
            dx: 8,
            dy: -6,
            fontSize: labelSize,
            fontWeight: 600,
            color: singleColor
          },
          encoding: {
            x: { field: 'time', type: 'temporal' },
            y: { field: 'value', type: 'quantitative' },
            text: { field: 'value', type: 'quantitative', format: numberFormat },
            opacity: {
              condition: { test: 'datum.value != null', value: 1 },
              value: 0
            }
          }
        }] : []),
        // Datum logo (optional, bottom-right)
        ...(options.showDatumLogo ? [{
          data: { values: [{}] },
          mark: {
            type: 'text',
            align: 'right',
            baseline: 'bottom',
            dx: -10,
            dy: -10,
            fontSize: options.datumLogoSize === 'medium' ? 14 : 11,
            color: '#999',
            font: 'sans-serif',
            fontWeight: 600
          },
          encoding: {
            x: { value: 'width' },
            y: { value: 'height' },
            text: { value: 'Datum' }
          }
        }] : [])
      ],
      
      config: {
        view: {
          stroke: 'transparent'
        },
        axis: {
          domainColor: '#333',
          domainWidth: 1,
          tickColor: '#333',
          tickWidth: 1,
          labelColor: '#333',
          titleColor: '#333'
        }
      }
    }
  }
}

/**
 * Generate PUBLICATION-GRADE Vega-Lite spec for Stacked Area Chart V1
 * Time-based chart showing cumulative contribution of series over time
 * 
 * V1 Scope:
 * - Simple cumulative stacking from common baseline
 * - No percent/normalized mode
 * - No unstacked toggle
 * - No smoothing or interpolation options
 * - No in-area value labels (legend is primary identification)
 */
export function generateStackedAreaSpec(
  data: Array<Record<string, any>>,
  timeColumn: string,
  valueColumns: string[],
  options: EditorialOptions = {}
): Record<string, any> {
  // CRITICAL SAFEGUARD: Prevent time column from appearing as a series
  const safeValueColumns = valueColumns.filter(col => col !== timeColumn)
  
  // Fail-safe: If no valid value columns remain, throw error
  if (safeValueColumns.length === 0) {
    throw new Error('Zaman sütunu grafik değerleri arasında yer alamaz.')
  }

  // Transform data to long format (reuse existing pattern)
  const isMultiSeries = safeValueColumns.length > 1
  const colorPalette = getColorPalette(options.colorMode || 'multi-color')
  const labelSize = getLabelSize(options.labelSize)
  const numberFormat = getNumberFormat(options.numberFormat)
  
  // CRITICAL: Never use series names as axis titles
  // Fallback to 'Değer' or unit, never a series/column name
  const yAxisTitle = options.yAxisLabel || options.unit || 'Değer'
  const xAxisTitle = options.xAxisLabel || timeColumn
  
  // Axis orientation support (reuse dot plot pattern)
  const orientation = options.stackedAreaOrientation || 'horizontal'
  const isVertical = orientation === 'vertical'

  // Process time values (reuse existing parseTimeValue logic)
  const processedData = data.map(row => ({
    ...row,
    [timeColumn]: parseTimeValue(row[timeColumn])
  }))

  if (isMultiSeries) {
    // MULTI-SERIES: Transform to long format
    const longData = transformToLongFormat(processedData, timeColumn, safeValueColumns)
    
    return {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      width: 'container',
      height: 400,
      padding: { left: 10, right: 10, top: 30, bottom: 10 },
      background: 'white',
      
      // Title configuration (reuse from line chart)
      ...(options.title && {
        title: {
          text: options.title,
          subtitle: options.subtitle,
          anchor: 'start',
          fontSize: 18,
          fontWeight: 600,
          subtitleFontSize: 14,
          subtitleColor: '#666',
          offset: 20
        }
      }),
      
      data: { values: longData },
      
      layer: [
        // Area layer (stacked)
        {
          mark: {
            type: 'area',
            tooltip: true,
            opacity: 0.7, // Sensible default fill opacity
            strokeWidth: 1,
            stroke: 'white' // Subtle stroke for area separation
          },
          encoding: {
            ...(isVertical ? {
              // Vertical orientation: X = Value, Y = Time
              x: {
                field: 'value',
                type: 'quantitative',
                title: yAxisTitle,
                stack: 'zero',
                axis: {
                  labelFontSize: labelSize,
                  titleFontSize: labelSize + 2,
                  grid: true,
                  gridOpacity: 0.3,
                  format: numberFormat,
                  tickCount: 6
                },
                scale: {
                  zero: true,
                  nice: true
                }
              },
              y: {
                field: 'time',
                type: 'temporal',
                title: xAxisTitle,
                axis: {
                  labelAngle: 0,
                  labelFontSize: labelSize,
                  titleFontSize: labelSize + 2,
                  grid: false,
                  tickCount: 8,
                  labelOverlap: true,
                  format: '%Y'
                },
                scale: {
                  nice: true
                }
              }
            } : {
              // Horizontal orientation (default): X = Time, Y = Value
              x: {
                field: 'time',
                type: 'temporal',
                title: xAxisTitle,
                axis: {
                  labelAngle: 0,
                  labelFontSize: labelSize,
                  titleFontSize: labelSize + 2,
                  grid: false,
                  tickCount: 8,
                  labelOverlap: true,
                  format: '%Y'  // Always use year format for temporal data
                },
                scale: {
                  nice: true
                }
              },
              y: {
                field: 'value',
                type: 'quantitative',
                title: yAxisTitle,
                stack: 'zero', // CRITICAL: Cumulative stacking from baseline
                axis: {
                  labelFontSize: labelSize,
                  titleFontSize: labelSize + 2,
                  grid: true,
                  gridOpacity: 0.3,
                  format: numberFormat,
                  tickCount: 6
                },
                scale: {
                  zero: true, // Stacked areas must start at zero
                  nice: true
                }
              }
            }),
            color: {
              field: 'series',
              type: 'nominal',
              title: null,
              scale: {
                range: colorPalette
              },
              legend: options.showLegend !== false ? {
                orient: 'top',
                direction: 'horizontal',
                titleFontSize: labelSize,
                labelFontSize: labelSize,
                symbolSize: 100,
                symbolStrokeWidth: 2,
                offset: 10
              } : null
            },
            order: {
              field: 'series',
              type: 'nominal',
              sort: 'ascending' // Maintain series order as defined by editor
            },
            tooltip: [
              { field: 'series', type: 'nominal', title: 'Seri' },
              { field: 'time', type: 'temporal', title: 'Zaman', format: '%Y' },
              { field: 'value', type: 'quantitative', title: 'Değer', format: numberFormat }
            ]
          }
        },
        // Labels layer (V1 - limited support, infrastructure exists)
        ...(options.barLabelSource === 'value' ? [{
          transform: [
            { joinaggregate: [{ op: 'max', field: 'time', as: 'maxTime' }], groupby: ['series'] },
            { filter: 'datum.time === datum.maxTime' }
          ],
          mark: {
            type: 'text',
            align: isVertical ? 'left' : 'left',
            baseline: 'middle',
            dx: isVertical ? 8 : 8,
            dy: isVertical ? 0 : -6,
            fontSize: labelSize,
            fontWeight: 600,
            color: '#333',
            clip: false
          },
          encoding: {
            ...(isVertical ? {
              x: { field: 'value', type: 'quantitative' },
              y: { field: 'time', type: 'temporal' }
            } : {
              x: { field: 'time', type: 'temporal' },
              y: { field: 'value', type: 'quantitative' }
            }),
            text: { field: 'value', type: 'quantitative', format: numberFormat },
            color: {
              field: 'series',
              type: 'nominal',
              scale: { range: colorPalette },
              legend: null
            },
            opacity: {
              condition: { test: 'datum.value != null', value: 1 },
              value: 0
            }
          }
        }] : []),
        // Datum logo (optional, bottom-right)
        ...(options.showDatumLogo ? [{
          data: { values: [{}] },
          mark: {
            type: 'text',
            align: 'right',
            baseline: 'bottom',
            dx: -10,
            dy: -10,
            fontSize: options.datumLogoSize === 'medium' ? 14 : 11,
            color: '#999',
            font: 'sans-serif',
            fontWeight: 600
          },
          encoding: {
            x: { value: 'width' },
            y: { value: 'height' },
            text: { value: 'Datum' }
          }
        }] : [])
      ],
      
      // Config (reuse from line chart)
      config: {
        view: {
          stroke: 'transparent'
        },
        axis: {
          domainColor: '#333',
          domainWidth: 1,
          tickColor: '#333',
          tickWidth: 1,
          labelColor: '#333',
          titleColor: '#333'
        },
        legend: {
          strokeColor: '#ccc',
          padding: 10,
          cornerRadius: 4
        }
      }
    }
  } else {
    // SINGLE SERIES: Simpler spec (still stacked, but only one series)
    const singleValueColumn = safeValueColumns[0]
    const singleSeriesData = processedData.map(row => ({
      time: row[timeColumn],
      value: typeof row[singleValueColumn] === 'number' ? row[singleValueColumn] : parseFloat(row[singleValueColumn])
    })).filter(row => row.value !== null && !isNaN(row.value))
    
    const singleColor = colorPalette[0]
    // CRITICAL: Never use series names as axis titles
    const yAxisTitleSingle = options.yAxisLabel || options.unit || 'Değer'
    const xAxisTitleSingle = options.xAxisLabel || timeColumn
    
    // Axis orientation support (reuse dot plot pattern)
    const orientation = options.stackedAreaOrientation || 'horizontal'
    const isVertical = orientation === 'vertical'

    return {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      width: 'container',
      height: 400,
      padding: { left: 10, right: 10, top: 30, bottom: 10 },
      background: 'white',
      
      // Title configuration
      ...(options.title && {
        title: {
          text: options.title,
          subtitle: options.subtitle,
          anchor: 'start',
          fontSize: 18,
          fontWeight: 600,
          subtitleFontSize: 14,
          subtitleColor: '#666',
          offset: 20
        }
      }),
      
      data: { values: singleSeriesData },
      
      layer: [
        // Area layer
        {
          mark: {
            type: 'area',
            tooltip: true,
            opacity: 0.7,
            color: singleColor,
            strokeWidth: 1,
            stroke: 'white'
          },
          encoding: {
            ...(isVertical ? {
              // Vertical orientation: X = Value, Y = Time
              x: {
                field: 'value',
                type: 'quantitative',
                title: yAxisTitleSingle,
                axis: {
                  labelFontSize: labelSize,
                  titleFontSize: labelSize + 2,
                  grid: true,
                  gridOpacity: 0.3,
                  format: numberFormat,
                  tickCount: 6
                },
                scale: {
                  zero: true,
                  nice: true
                }
              },
              y: {
                field: 'time',
                type: 'temporal',
                title: xAxisTitleSingle,
                axis: {
                  labelAngle: 0,
                  labelFontSize: labelSize,
                  titleFontSize: labelSize + 2,
                  grid: false,
                  tickCount: 8,
                  labelOverlap: true,
                  format: '%Y'
                },
                scale: {
                  nice: true
                }
              }
            } : {
              // Horizontal orientation (default): X = Time, Y = Value
              x: {
                field: 'time',
                type: 'temporal',
                title: xAxisTitleSingle,
                axis: {
                  labelAngle: 0,
                  labelFontSize: labelSize,
                  titleFontSize: labelSize + 2,
                  grid: false,
                  tickCount: 8,
                  labelOverlap: true,
                  format: '%Y'
                },
                scale: {
                  nice: true
                }
              },
              y: {
                field: 'value',
                type: 'quantitative',
                title: yAxisTitleSingle,
                axis: {
                  labelFontSize: labelSize,
                  titleFontSize: labelSize + 2,
                  grid: true,
                  gridOpacity: 0.3,
                  format: numberFormat,
                  tickCount: 6
                },
                scale: {
                  zero: true,
                  nice: true
                }
              }
            }),
            tooltip: [
              { field: 'time', type: 'temporal', title: 'Zaman', format: '%Y' },
              { field: 'value', type: 'quantitative', title: 'Değer', format: numberFormat }
            ]
          }
        },
        // Labels layer (V1 - limited support, infrastructure exists)
        ...(options.barLabelSource === 'value' ? [{
          transform: [
            { joinaggregate: [{ op: 'max', field: 'time', as: 'maxTime' }] },
            { filter: 'datum.time === datum.maxTime' }
          ],
          mark: {
            type: 'text',
            align: isVertical ? 'left' : 'left',
            baseline: 'middle',
            dx: isVertical ? 8 : 8,
            dy: isVertical ? 0 : -6,
            fontSize: labelSize,
            fontWeight: 600,
            color: singleColor,
            clip: false
          },
          encoding: {
            ...(isVertical ? {
              x: { field: 'value', type: 'quantitative' },
              y: { field: 'time', type: 'temporal' }
            } : {
              x: { field: 'time', type: 'temporal' },
              y: { field: 'value', type: 'quantitative' }
            }),
            text: { field: 'value', type: 'quantitative', format: numberFormat },
            opacity: {
              condition: { test: 'datum.value != null', value: 1 },
              value: 0
            }
          }
        }] : []),
        // Datum logo (optional, bottom-right)
        ...(options.showDatumLogo ? [{
          data: { values: [{}] },
          mark: {
            type: 'text',
            align: 'right',
            baseline: 'bottom',
            dx: -10,
            dy: -10,
            fontSize: options.datumLogoSize === 'medium' ? 14 : 11,
            color: '#999',
            font: 'sans-serif',
            fontWeight: 600
          },
          encoding: {
            x: { value: 'width' },
            y: { value: 'height' },
            text: { value: 'Datum' }
          }
        }] : [])
      ],
      
      config: {
        view: {
          stroke: 'transparent'
        },
        axis: {
          domainColor: '#333',
          domainWidth: 1,
          tickColor: '#333',
          tickWidth: 1,
          labelColor: '#333',
          titleColor: '#333'
        }
      }
    }
  }
}

/**
 * Generate PUBLICATION-GRADE Vega-Lite spec for Slope Chart V1
 * Compares exactly 2 time points for multiple entities
 * 
 * V1 Scope:
 * - Exactly 2 time points (first and last)
 * - Lines connecting two points
 * - Points visible at both ends
 * - Labels at start (left) and end (right)
 * - Series name + optional value in labels
 * - No sorting, no animation, no interpolation
 */
export function generateSlopeChartSpec(
  data: Array<Record<string, any>>,
  timeColumn: string,
  valueColumns: string[],
  options: EditorialOptions = {}
): Record<string, any> {
  // CRITICAL SAFEGUARD: Prevent time column from appearing as a series
  const safeValueColumns = valueColumns.filter(col => col !== timeColumn)
  
  // Fail-safe: If no valid value columns remain, throw error
  if (safeValueColumns.length === 0) {
    throw new Error('Zaman sütunu grafik değerleri arasında yer alamaz.')
  }

  // CRITICAL: Slope chart uses CATEGORICAL time points, not temporal
  // Time points come from VALUE COLUMN HEADERS (e.g., "2010", "2022")
  // These are treated as discrete categorical anchors, NOT continuous time
  
  // CRITICAL: Slope chart requires exactly 2 time points (value columns)
  if (safeValueColumns.length < 2) {
    throw new Error('Eğim grafiği için en az 2 değer sütunu (zaman noktası) gereklidir.')
  }
  
  // Use first and last value columns as the 2 categorical time anchors
  // These column names ARE the time point labels (e.g., "2010", "2022")
  const firstTimeColumn = safeValueColumns[0]
  const lastTimeColumn = safeValueColumns[safeValueColumns.length - 1]
  
  // Time point labels (categorical values, not dates)
  // These will be used as ordinal positions on the X-axis
  const timePointLabels = [firstTimeColumn, lastTimeColumn]
  
  // Verify they are distinct
  if (timePointLabels[0] === timePointLabels[1]) {
    throw new Error('Eğim grafiği için 2 farklı zaman noktası gereklidir.')
  }
  
  // Process data - no filtering needed since we're using column headers as time points
  const processedData = data.map(row => ({
    ...row,
    // Keep original row data - time will come from which value column we're reading
  }))
  
  // Transform data to long format (reuse existing pattern)
  const isMultiSeries = safeValueColumns.length > 1
  const colorPalette = getColorPalette(options.colorMode || 'multi-color')
  const labelSize = getLabelSize(options.labelSize)
  const numberFormat = getNumberFormat(options.numberFormat)
  
  // CRITICAL: Never use series names as axis titles
  const yAxisTitle = options.yAxisLabel || options.unit || 'Değer'
  
  // CRITICAL: For slope charts, X-axis title must describe the time comparison
  // Format: "2010 → 2022" or use editor override if provided
  // NEVER use entity column name (timeColumn) as X-axis title
  const timeComparisonTitle = timePointLabels.length === 2 
    ? `${timePointLabels[0]} → ${timePointLabels[1]}`
    : timePointLabels.join(' → ')
  const xAxisTitle = options.xAxisLabel || timeComparisonTitle
  
  // Axis orientation support (reuse dot plot pattern)
  const orientation = options.slopeChartOrientation || 'horizontal'
  const isVertical = orientation === 'vertical'
  
  // Label configuration
  const showValueLabels = options.slopeChartShowValueLabels === true

  if (isMultiSeries) {
    // CRITICAL: Slope chart uses actual VALUES on Y-axis, not ranks
    // Per-column sorting is for visual understanding, NOT for positioning
    // Y-axis MUST be quantitative with real numeric values
    
    // Transform to long format - entities positioned at their actual values
    const timePointColumns = [firstTimeColumn, lastTimeColumn]
    
    const longData: Array<{
      time: string;
      value: number; // CRITICAL: Actual numeric value for Y-axis positioning
      series: string;
      timePoint: string;
    }> = []
    
    processedData.forEach(row => {
      const entityName = row[timeColumn] // This is actually the entity name, not time
      
      // Only process the first and last time point columns
      timePointColumns.forEach((valueCol, idx) => {
        const value = row[valueCol]
        if (value !== null && value !== undefined && value !== '') {
          // CRITICAL: Use the column name (time point label) as a categorical value
          // Y-axis uses actual numeric value, not rank
          const timeLabel = valueCol // Use column name as categorical label
          longData.push({
            time: timeLabel, // Categorical label (e.g., "2010", "2022")
            value: typeof value === 'number' ? value : parseFloat(value), // Actual value for Y-axis
            series: String(entityName), // Entity name becomes the series
            timePoint: idx === 0 ? 'start' : 'end'
          })
        }
      })
    })
    
    // No serialization needed - time is already a string (categorical label)
    const longDataSerialized = longData
    
    return {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      width: 'container',
      height: 400,
      // CRITICAL: Increased side padding to visually emphasize two-column structure
      // This makes the left/right separation more prominent
      padding: { left: 100, right: 100, top: 30, bottom: 10 },
      background: 'white',
      
      // Title configuration (reuse from line chart)
      ...(options.title && {
        title: {
          text: options.title,
          subtitle: options.subtitle,
          anchor: 'start',
          fontSize: 18,
          fontWeight: 600,
          subtitleFontSize: 14,
          subtitleColor: '#666',
          offset: 20
        }
      }),
      
      data: { values: longDataSerialized },
      
      layer: [
        // CRITICAL: Vertical reference lines at the two time points
        // This creates visual separation and emphasizes the two-column structure
        // For ordinal axes, we create rules that span the full height/width
        {
          data: { values: timePointLabels.map(label => ({ time: label })) },
          mark: {
            type: 'rule',
            strokeWidth: 1,
            stroke: '#d0d0d0',
            strokeDash: [3, 3],
            opacity: 0.5
          },
          encoding: {
            ...(isVertical ? {
              y: { field: 'time', type: 'ordinal', scale: { domain: timePointLabels } }
            } : {
              x: { field: 'time', type: 'ordinal', scale: { domain: timePointLabels } }
            })
          }
        },
        // Lines layer (connecting the two points)
        {
          mark: {
            type: 'line',
            strokeWidth: 2,
            tooltip: true
          },
          encoding: {
            ...(isVertical ? {
              // Vertical orientation: X = Value, Y = Time
              // CRITICAL: X-axis uses actual VALUES, not ranks
              x: {
                field: 'value',
                type: 'quantitative',
                title: yAxisTitle,
                axis: {
                  labelFontSize: labelSize,
                  titleFontSize: labelSize + 2,
                  grid: true,
                  gridOpacity: 0.3,
                  format: numberFormat,
                  tickCount: 6
                },
                scale: {
                  zero: false,
                  nice: true
                }
              },
              y: {
                field: 'time',
                type: 'ordinal', // Categorical, not temporal
                title: xAxisTitle,
                axis: {
                  labelAngle: 0,
                  labelFontSize: labelSize,
                  titleFontSize: labelSize + 2,
                  grid: true, // Enable grid to create visual separation at the two time points
                  gridOpacity: 0.4,
                  gridDash: [2, 2],
                  labelOverlap: false
                },
                scale: {
                  domain: timePointLabels, // Exactly 2 categorical labels (e.g., ["2010", "2022"])
                  padding: 0.4 // Increased padding to emphasize two-column structure
                }
              }
            } : {
              // Horizontal orientation (default): X = Time (categorical), Y = Value
              // CRITICAL: X-axis is ORDINAL (categorical), NOT temporal
              // Y-axis is QUANTITATIVE with actual VALUES, not ranks
              // Exactly 2 discrete positions: start (left) and end (right)
              x: {
                field: 'time',
                type: 'ordinal', // Categorical, not temporal
                title: xAxisTitle,
                axis: {
                  labelAngle: 0,
                  labelFontSize: labelSize,
                  titleFontSize: labelSize + 2,
                  grid: true, // Enable grid to create visual separation at the two time points
                  gridOpacity: 0.4,
                  gridDash: [2, 2],
                  labelOverlap: false
                },
                scale: {
                  domain: timePointLabels, // Exactly 2 categorical labels (e.g., ["2010", "2022"])
                  padding: 0.4 // Increased padding to emphasize two-column structure
                }
              },
              y: {
                field: 'value', // CRITICAL: Use actual value, not rank
                type: 'quantitative',
                title: yAxisTitle,
                axis: {
                  labelFontSize: labelSize,
                  titleFontSize: labelSize + 2,
                  grid: true,
                  gridOpacity: 0.3,
                  format: numberFormat,
                  tickCount: 6
                },
                scale: {
                  zero: false,
                  nice: true
                }
              }
            }),
            color: {
              field: 'series',
              type: 'nominal',
              title: null,
              scale: {
                range: colorPalette
              },
              legend: options.showLegend !== false ? {
                orient: 'top',
                direction: 'horizontal',
                titleFontSize: labelSize,
                labelFontSize: labelSize,
                symbolSize: 100,
                symbolStrokeWidth: 2,
                offset: 10
              } : null
            },
            order: {
              field: 'series',
              type: 'nominal',
              sort: 'ascending' // Maintain series order as defined by editor
            },
            tooltip: [
              { field: 'series', type: 'nominal', title: 'Seri' },
              { field: 'time', type: 'ordinal', title: 'Zaman' },
              { field: 'value', type: 'quantitative', title: 'Değer', format: numberFormat }
            ]
          }
        },
        // Points layer (at both ends)
        {
          mark: {
            type: 'point',
            filled: true,
            size: 80,
            tooltip: true
          },
          encoding: {
            ...(isVertical ? {
              x: { field: 'value', type: 'quantitative' },
              y: { field: 'time', type: 'ordinal', scale: { domain: timePointLabels } }
            } : {
              x: { field: 'time', type: 'ordinal', scale: { domain: timePointLabels } },
              y: { field: 'value', type: 'quantitative' }
            }),
            color: {
              field: 'series',
              type: 'nominal',
              scale: { range: colorPalette },
              legend: null // Only show legend once
            },
            tooltip: [
              { field: 'series', type: 'nominal', title: 'Seri' },
              { field: 'time', type: 'ordinal', title: 'Zaman' },
              { field: 'value', type: 'quantitative', title: 'Değer', format: numberFormat }
            ]
          }
        },
        // Labels at start point (left/first time point)
        // CRITICAL: Position labels OUTSIDE the left column
        {
          transform: [
            { filter: "datum.timePoint === 'start'" },
            {
              calculate: showValueLabels 
                ? `datum.series + " (" + format(datum.value, "${numberFormat}") + ")"`
                : 'datum.series',
              as: 'labelText'
            }
          ],
          mark: {
            type: 'text',
            align: isVertical ? 'right' : 'right', // Right-align for left column (outside)
            baseline: 'middle',
            dx: isVertical ? -12 : -12, // Position OUTSIDE the left column
            fontSize: labelSize,
            fontWeight: 600,
            color: '#333',
            clip: false
          },
          encoding: {
            ...(isVertical ? {
              x: { field: 'value', type: 'quantitative' },
              y: { field: 'time', type: 'ordinal', scale: { domain: timePointLabels } }
            } : {
              x: { field: 'time', type: 'ordinal', scale: { domain: timePointLabels } },
              y: { field: 'value', type: 'quantitative' }
            }),
            text: {
              field: 'labelText',
              type: 'nominal'
            },
            color: {
              field: 'series',
              type: 'nominal',
              scale: { range: colorPalette },
              legend: null
            }
          }
        },
        // Labels at end point (right/last time point)
        // CRITICAL: Position labels OUTSIDE the right column
        {
          transform: [
            { filter: "datum.timePoint === 'end'" },
            {
              calculate: showValueLabels 
                ? `datum.series + " (" + format(datum.value, "${numberFormat}") + ")"`
                : 'datum.series',
              as: 'labelText'
            }
          ],
          mark: {
            type: 'text',
            align: isVertical ? 'left' : 'left', // Left-align for right column (outside)
            baseline: 'middle',
            dx: isVertical ? 12 : 12, // Position OUTSIDE the right column
            fontSize: labelSize,
            fontWeight: 600,
            color: '#333',
            clip: false
          },
          encoding: {
            ...(isVertical ? {
              x: { field: 'value', type: 'quantitative' },
              y: { field: 'time', type: 'ordinal', scale: { domain: timePointLabels } }
            } : {
              x: { field: 'time', type: 'ordinal', scale: { domain: timePointLabels } },
              y: { field: 'value', type: 'quantitative' }
            }),
            text: {
              field: 'labelText',
              type: 'nominal'
            },
            color: {
              field: 'series',
              type: 'nominal',
              scale: { range: colorPalette },
              legend: null
            }
          }
        },
        // Datum logo (optional, bottom-right)
        ...(options.showDatumLogo ? [{
          data: { values: [{}] },
          mark: {
            type: 'text',
            align: 'right',
            baseline: 'bottom',
            dx: -10,
            dy: -10,
            fontSize: options.datumLogoSize === 'medium' ? 14 : 11,
            color: '#999',
            font: 'sans-serif',
            fontWeight: 600
          },
          encoding: {
            x: { value: 'width' },
            y: { value: 'height' },
            text: { value: 'Datum' }
          }
        }] : [])
      ],
      
      // Config (reuse from line chart)
      config: {
        view: {
          stroke: 'transparent'
        },
        axis: {
          domainColor: '#333',
          domainWidth: 1,
          tickColor: '#333',
          tickWidth: 1,
          labelColor: '#333',
          titleColor: '#333'
        },
        legend: {
          strokeColor: '#ccc',
          padding: 10,
          cornerRadius: 4
        }
      }
    }
  } else {
    // SINGLE SERIES: Simpler spec
    // For single series, we still need 2 value columns (time points)
    const firstValueColumn = safeValueColumns[0]
    const lastValueColumn = safeValueColumns[safeValueColumns.length - 1]
    
    // Create data with both time points
    const singleSeriesData = processedData.flatMap(row => {
      const startValue = typeof row[firstValueColumn] === 'number' 
        ? row[firstValueColumn] 
        : parseFloat(row[firstValueColumn])
      const endValue = typeof row[lastValueColumn] === 'number' 
        ? row[lastValueColumn] 
        : parseFloat(row[lastValueColumn])
      
      const result = []
      if (startValue !== null && !isNaN(startValue)) {
        result.push({
          time: firstTimeColumn, // Use column name as categorical label
          value: startValue,
          timePoint: 'start'
        })
      }
      if (endValue !== null && !isNaN(endValue)) {
        result.push({
          time: lastTimeColumn, // Use column name as categorical label
          value: endValue,
          timePoint: 'end'
        })
      }
      return result
    })
    
    // No serialization needed - time is already a string (categorical label)
    const singleSeriesDataSerialized = singleSeriesData
    
    const singleColor = colorPalette[0]
    const yAxisTitleSingle = options.yAxisLabel || options.unit || 'Değer'
    
    // CRITICAL: For slope charts, X-axis title must describe the time comparison
    // Format: "2010 → 2022" or use editor override if provided
    // NEVER use entity column name (timeColumn) as X-axis title
    const timeComparisonTitleSingle = timePointLabels.length === 2 
      ? `${timePointLabels[0]} → ${timePointLabels[1]}`
      : timePointLabels.join(' → ')
    const xAxisTitleSingle = options.xAxisLabel || timeComparisonTitleSingle

    return {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      width: 'container',
      height: 400,
      // CRITICAL: Increased side padding to visually emphasize two-column structure
      // This makes the left/right separation more prominent
      padding: { left: 100, right: 100, top: 30, bottom: 10 },
      background: 'white',
      
      // Title configuration
      ...(options.title && {
        title: {
          text: options.title,
          subtitle: options.subtitle,
          anchor: 'start',
          fontSize: 18,
          fontWeight: 600,
          subtitleFontSize: 14,
          subtitleColor: '#666',
          offset: 20
        }
      }),
      
      data: { values: singleSeriesDataSerialized },
      
      layer: [
        // Line layer
        {
          mark: {
            type: 'line',
            strokeWidth: 2,
            color: singleColor,
            tooltip: true
          },
          encoding: {
            ...(isVertical ? {
              x: { field: 'value', type: 'quantitative', title: yAxisTitleSingle, axis: { labelFontSize: labelSize, titleFontSize: labelSize + 2, grid: true, gridOpacity: 0.3, format: numberFormat, tickCount: 6 }, scale: { zero: false, nice: true } },
              y: { field: 'time', type: 'ordinal', title: xAxisTitleSingle, axis: { labelAngle: 0, labelFontSize: labelSize, titleFontSize: labelSize + 2, grid: false, labelOverlap: false }, scale: { domain: timePointLabels, padding: 0.4 } }
            } : {
              x: { field: 'time', type: 'ordinal', title: xAxisTitleSingle, axis: { labelAngle: 0, labelFontSize: labelSize, titleFontSize: labelSize + 2, grid: false, labelOverlap: false }, scale: { domain: timePointLabels, padding: 0.4 } },
              y: { field: 'value', type: 'quantitative', title: yAxisTitleSingle, axis: { labelFontSize: labelSize, titleFontSize: labelSize + 2, grid: true, gridOpacity: 0.3, format: numberFormat, tickCount: 6 }, scale: { zero: false, nice: true } }
            }),
            tooltip: [
              { field: 'time', type: 'ordinal', title: 'Zaman' },
              { field: 'value', type: 'quantitative', title: 'Değer', format: numberFormat }
            ]
          }
        },
        // Points layer
        {
          mark: {
            type: 'point',
            filled: true,
            size: 80,
            color: singleColor,
            tooltip: true
          },
          encoding: {
            ...(isVertical ? {
              x: { field: 'value', type: 'quantitative' },
              y: { field: 'time', type: 'temporal' }
            } : {
              x: { field: 'time', type: 'temporal' },
              y: { field: 'value', type: 'quantitative' }
            }),
            tooltip: [
              { field: 'time', type: 'temporal', title: 'Zaman', format: '%Y' },
              { field: 'value', type: 'quantitative', title: 'Değer', format: numberFormat }
            ]
          }
        },
        // Labels at start point
        {
          transform: [
            { filter: "datum.timePoint === 'start'" },
            {
              calculate: showValueLabels 
                ? `format(datum.value, "${numberFormat}")`
                : '""',
              as: 'labelText'
            }
          ],
          mark: {
            type: 'text',
            align: isVertical ? 'right' : 'right',
            baseline: 'middle',
            dx: isVertical ? -8 : -8,
            fontSize: labelSize,
            fontWeight: 600,
            color: singleColor,
            clip: false
          },
          encoding: {
            ...(isVertical ? {
              x: { field: 'value', type: 'quantitative' },
              y: { field: 'time', type: 'temporal' }
            } : {
              x: { field: 'time', type: 'temporal' },
              y: { field: 'value', type: 'quantitative' }
            }),
            text: { field: 'labelText', type: 'nominal' }
          }
        },
        // Labels at end point
        {
          transform: [
            { filter: "datum.timePoint === 'end'" },
            {
              calculate: showValueLabels 
                ? `format(datum.value, "${numberFormat}")`
                : '""',
              as: 'labelText'
            }
          ],
          mark: {
            type: 'text',
            align: isVertical ? 'left' : 'left',
            baseline: 'middle',
            dx: isVertical ? 8 : 8,
            fontSize: labelSize,
            fontWeight: 600,
            color: singleColor,
            clip: false
          },
          encoding: {
            ...(isVertical ? {
              x: { field: 'value', type: 'quantitative' },
              y: { field: 'time', type: 'temporal' }
            } : {
              x: { field: 'time', type: 'temporal' },
              y: { field: 'value', type: 'quantitative' }
            }),
            text: { field: 'labelText', type: 'nominal' }
          }
        },
        // Datum logo (optional, bottom-right)
        ...(options.showDatumLogo ? [{
          data: { values: [{}] },
          mark: {
            type: 'text',
            align: 'right',
            baseline: 'bottom',
            dx: -10,
            dy: -10,
            fontSize: options.datumLogoSize === 'medium' ? 14 : 11,
            color: '#999',
            font: 'sans-serif',
            fontWeight: 600
          },
          encoding: {
            x: { value: 'width' },
            y: { value: 'height' },
            text: { value: 'Datum' }
          }
        }] : [])
      ],
      
      config: {
        view: {
          stroke: 'transparent'
        },
        axis: {
          domainColor: '#333',
          domainWidth: 1,
          tickColor: '#333',
          tickWidth: 1,
          labelColor: '#333',
          titleColor: '#333'
        }
      }
    }
  }
}

/**
 * Evaluate chart density for adaptive label rendering
 * Returns: 'low' | 'medium' | 'high' | 'extreme'
 */
function evaluateBarChartDensity(
  categoryCount: number,
  seriesCount: number,
  estimatedWidth: number = 800 // Default container width
): 'low' | 'medium' | 'high' | 'extreme' {
  const totalBars = categoryCount * seriesCount
  const barsPer100px = totalBars / (estimatedWidth / 100)
  
  // Density thresholds (editorial standards)
  if (totalBars <= 12 && barsPer100px <= 2) {
    return 'low'
  } else if (totalBars <= 30 && barsPer100px <= 4) {
    return 'medium'
  } else if (totalBars <= 60 && barsPer100px <= 8) {
    return 'high'
  } else {
    return 'extreme'
  }
}

/**
 * Generate Grouped Bar Chart (Category Comparison)
 * Wide-format input, folded into long format with Vega-Lite transform
 */
export function generateCategoryBarSpec(
  data: Array<Record<string, any>>,
  categoryColumn: string,
  valueColumns: string[],
  options: EditorialOptions = {},
  groupByColumn?: string
): Record<string, any> {
  const categoryCount = new Set(data.map(row => row[categoryColumn]).filter(Boolean)).size
  if (categoryCount < 3) {
    throw new Error('Kategori sütununda en az 3 farklı değer olmalıdır.')
  }

  const colorPalette = getColorPalette(options.colorMode || 'multi-color')
  const labelSize = getLabelSize(options.labelSize)
  const numberFormat = getNumberFormat(options.numberFormat)
  const valueField = valueColumns[0]
  const labelSource = options.barLabelSource || 'none'
  const labelPlacement = options.barLabelPlacement || 'off'
  // Y-axis title: Default to "Değer", allow custom override
  // NEVER use category column or groupBy column name as Y-axis title
  const yAxisTitle =
    options.barYAxisMode === 'custom' && options.yAxisLabel?.trim()
      ? options.yAxisLabel.trim()
      : 'Değer'
  const groupValues = groupByColumn
    ? Array.from(new Set(data.map(row => row[groupByColumn]).filter(Boolean)))
    : []
  const seriesCount = groupByColumn ? groupValues.length : valueColumns.length
  const totalBars = categoryCount * seriesCount
  
  // OWID-style label system: Labels always render when enabled, layout adapts
  const shouldShowLabels = labelSource !== 'none' && labelPlacement !== 'off'
  
  // Adaptive font sizing based on density (never block labels)
  // More aggressive reduction for dense charts to prevent overlap
  const barsPerGroup = seriesCount
  let adaptiveFontSize = labelSize
  let useRotatedLabels = false
  
  if (totalBars > 30) {
    adaptiveFontSize = Math.max(8, labelSize - 3)
    useRotatedLabels = true // Rotate labels for very dense charts
  } else if (totalBars > 20) {
    adaptiveFontSize = Math.max(9, labelSize - 2)
    useRotatedLabels = true // Rotate labels for dense charts
  } else if (totalBars > 15) {
    adaptiveFontSize = Math.max(10, labelSize - 1)
  } else if (totalBars > 10) {
    adaptiveFontSize = Math.max(11, labelSize - 0.5)
  }
  
  // Labels always render when enabled (OWID principle: labels don't disappear)
  const canRenderBarLabels = shouldShowLabels
  const sortedGroupValues = groupValues.slice().sort((a, b) => {
    const aNum = Number(a)
    const bNum = Number(b)
    if (!isNaN(aNum) && !isNaN(bNum)) return aNum - bNum
    return String(a).localeCompare(String(b))
  })
  const lastGroupValue = sortedGroupValues[sortedGroupValues.length - 1]

  return {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    width: 'container',
    height: 420,
    padding: {
      left: 10,
      right: 10,
      top: 30,
      bottom: 10
    },
    background: 'white',
    ...(options.title && {
      title: {
        text: options.title,
        subtitle: options.subtitle,
        anchor: 'start',
        fontSize: 18,
        fontWeight: 600,
        subtitleFontSize: 14,
        subtitleColor: '#666',
        offset: 20
      }
    }),
    data: { values: data },
    ...(groupByColumn
      ? {
          transform: [
            {
              calculate: `datum["${groupByColumn}"] == "${lastGroupValue}" ? datum["${valueField}"] : null`,
              as: 'sortValue'
            },
            {
              joinaggregate: [{ op: 'max', field: 'sortValue', as: 'sortValue' }],
              groupby: [categoryColumn]
            }
          ]
        }
      : {
          transform: [
            { fold: valueColumns, as: ['series', 'value'] },
            {
              calculate: `datum.series === "${valueColumns[valueColumns.length - 1]}" ? datum.value : null`,
              as: 'sortValue'
            },
            {
              joinaggregate: [{ op: 'max', field: 'sortValue', as: 'sortValue' }],
              groupby: [categoryColumn]
            }
          ]
        }),
    layer: [
      {
        mark: { type: 'bar', tooltip: true },
        encoding: {
          x: {
            field: categoryColumn,
            type: 'nominal',
            title: options.xAxisLabel || categoryColumn,
            sort: { field: 'sortValue', order: 'descending' },
            axis: {
              labelAngle: 0,
              labelFontSize: labelSize,
              titleFontSize: labelSize + 2
            }
          },
          y: {
            field: groupByColumn ? valueField : 'value',
            type: 'quantitative',
            title: yAxisTitle,
            axis: {
              labelFontSize: labelSize,
              titleFontSize: labelSize + 2,
              grid: true,
              gridOpacity: 0.3,
              format: numberFormat,
              tickCount: 6
            },
            scale: { zero: true, nice: true }
          },
          xOffset: { field: groupByColumn ? groupByColumn : 'series' },
          color: {
            field: groupByColumn ? groupByColumn : 'series',
            type: 'nominal',
            title: null,
            scale: { range: colorPalette },
            legend: options.showLegend !== false ? {
              orient: 'top',
              direction: 'horizontal',
              titleFontSize: labelSize,
              labelFontSize: labelSize,
              symbolSize: 100,
              symbolStrokeWidth: 0,
              offset: 10
            } : null
          }
        }
      },
      ...(canRenderBarLabels ? (() => {
        // SEMANTIC LABEL MODEL: Labels are annotations, not bar decorations
        // Labels are derived from selected source and positioned relative to semantic groups
        
        const labelMode = labelSource
        
        if (labelMode === 'value') {
          // VALUE LABELS: Attached to individual bar values
          // These are the only labels that follow bar geometry
          const baseTransform = groupByColumn
            ? {
                transform: [
                  {
                    joinaggregate: [{ op: 'max', field: valueField, as: 'maxValue' }]
                  },
                  {
                    calculate: `datum["${valueField}"] / datum.maxValue`,
                    as: 'barHeightRatio'
                  }
                ]
              }
            : {
                transform: [
                  { fold: valueColumns, as: ['series', 'value'] },
                  {
                    joinaggregate: [{ op: 'max', field: 'value', as: 'maxValue' }]
                  },
                  {
                    calculate: 'datum.value / datum.maxValue',
                    as: 'barHeightRatio'
                  }
                ]
              }
          
          return [
            // Value labels above bars (tall bars)
            {
              ...baseTransform,
              mark: {
                type: 'text',
                align: 'center',
                baseline: useRotatedLabels ? 'middle' : 'bottom',
                dy: useRotatedLabels ? 0 : -4,
                angle: useRotatedLabels ? -45 : 0,
                fontSize: adaptiveFontSize,
                fontWeight: 600,
                color: '#333',
                clip: false,
                limit: useRotatedLabels ? 40 : undefined
              },
              encoding: {
                x: { field: categoryColumn, type: 'nominal', sort: { field: 'sortValue', order: 'descending' } },
                xOffset: { field: groupByColumn ? groupByColumn : 'series' },
                y: { field: groupByColumn ? valueField : 'value', type: 'quantitative' },
                text: {
                  field: groupByColumn ? valueField : 'value',
                  type: 'quantitative',
                  format: numberFormat
                },
                opacity: {
                  condition: {
                    test: groupByColumn
                      ? `datum["${valueField}"] != null && datum.maxValue > 0 && datum.barHeightRatio >= 0.05`
                      : 'datum.value != null && datum.maxValue > 0 && datum.barHeightRatio >= 0.05',
                    value: 1
                  },
                  value: 0
                }
              }
            },
            // Value labels inside bars (small bars)
            {
              ...baseTransform,
              mark: {
                type: 'text',
                align: 'center',
                baseline: 'middle',
                fontSize: adaptiveFontSize,
                fontWeight: 600,
                color: '#ffffff',
                clip: false
              },
              encoding: {
                x: { field: categoryColumn, type: 'nominal', sort: { field: 'sortValue', order: 'descending' } },
                xOffset: { field: groupByColumn ? groupByColumn : 'series' },
                y: { field: groupByColumn ? valueField : 'value', type: 'quantitative' },
                text: {
                  field: groupByColumn ? valueField : 'value',
                  type: 'quantitative',
                  format: numberFormat
                },
                opacity: {
                  condition: {
                    test: groupByColumn
                      ? `datum["${valueField}"] != null && datum.maxValue > 0 && datum.barHeightRatio > 0 && datum.barHeightRatio < 0.05`
                      : 'datum.value != null && datum.maxValue > 0 && datum.barHeightRatio > 0 && datum.barHeightRatio < 0.05',
                    value: 1
                  },
                  value: 0
                }
              }
            }
          ]
        } else if (labelMode === 'series') {
          // SERIES/DIMENSION LABELS: One label per series, positioned at each bar
          // These are semantic annotations showing which series each bar belongs to
          const baseTransform = groupByColumn
            ? {
                transform: [
                  {
                    joinaggregate: [{ op: 'max', field: valueField, as: 'maxValue' }]
                  },
                  {
                    calculate: `datum["${valueField}"] / datum.maxValue`,
                    as: 'barHeightRatio'
                  }
                ]
              }
            : {
                transform: [
                  { fold: valueColumns, as: ['series', 'value'] },
                  {
                    joinaggregate: [{ op: 'max', field: 'value', as: 'maxValue' }]
                  },
                  {
                    calculate: 'datum.value / datum.maxValue',
                    as: 'barHeightRatio'
                  }
                ]
              }
          
          return [
            {
              ...baseTransform,
              mark: {
                type: 'text',
                align: 'center',
                baseline: useRotatedLabels ? 'middle' : 'bottom',
                dy: useRotatedLabels ? 0 : -4,
                angle: useRotatedLabels ? -45 : 0,
                fontSize: adaptiveFontSize,
                fontWeight: 600,
                color: '#333',
                clip: false,
                limit: useRotatedLabels ? 40 : undefined
              },
              encoding: {
                x: { field: categoryColumn, type: 'nominal', sort: { field: 'sortValue', order: 'descending' } },
                xOffset: { field: groupByColumn ? groupByColumn : 'series' },
                y: { field: groupByColumn ? valueField : 'value', type: 'quantitative' },
                text: {
                  field: groupByColumn ? groupByColumn : 'series',
                  type: 'nominal'
                },
                opacity: {
                  condition: {
                    test: groupByColumn
                      ? `datum["${valueField}"] != null && datum.maxValue > 0 && datum.barHeightRatio >= 0.05`
                      : 'datum.value != null && datum.maxValue > 0 && datum.barHeightRatio >= 0.05',
                    value: 1
                  },
                  value: 0
                }
              }
            },
            {
              ...baseTransform,
              mark: {
                type: 'text',
                align: 'center',
                baseline: 'middle',
                fontSize: adaptiveFontSize,
                fontWeight: 600,
                color: '#ffffff',
                clip: false
              },
              encoding: {
                x: { field: categoryColumn, type: 'nominal', sort: { field: 'sortValue', order: 'descending' } },
                xOffset: { field: groupByColumn ? groupByColumn : 'series' },
                y: { field: groupByColumn ? valueField : 'value', type: 'quantitative' },
                text: {
                  field: groupByColumn ? groupByColumn : 'series',
                  type: 'nominal'
                },
                opacity: {
                  condition: {
                    test: groupByColumn
                      ? `datum["${valueField}"] != null && datum.maxValue > 0 && datum.barHeightRatio > 0 && datum.barHeightRatio < 0.05`
                      : 'datum.value != null && datum.maxValue > 0 && datum.barHeightRatio > 0 && datum.barHeightRatio < 0.05',
                    value: 1
                  },
                  value: 0
                }
              }
            }
          ]
        } else if (labelMode === 'category') {
          // CATEGORY LABELS: One label per category, positioned below X-axis
          // These are semantic annotations showing category names (e.g., country names)
          // Positioned relative to the category group, not individual bars
          const uniqueCategories = Array.from(new Set(data.map(row => row[categoryColumn]).filter(Boolean)))
          
          // Calculate sort order based on last group value (same as bars)
          const categorySortData = uniqueCategories.map((cat: any) => {
            const categoryRows = data.filter(row => row[categoryColumn] === cat)
            let sortValue = 0
            if (groupByColumn && categoryRows.length > 0) {
              const lastGroupValue = sortedGroupValues[sortedGroupValues.length - 1]
              const lastRow = categoryRows.find(row => row[groupByColumn] === lastGroupValue)
              sortValue = lastRow ? (lastRow[valueField] || 0) : 0
            } else if (categoryRows.length > 0 && valueColumns.length > 0) {
              const lastValueCol = valueColumns[valueColumns.length - 1]
              const lastRow = categoryRows[0]
              sortValue = lastRow[lastValueCol] || 0
            }
            return {
              categoryValue: cat,
              labelText: String(cat),
              sortValue
            }
          })
          
          return [{
            data: { values: categorySortData },
            mark: {
              type: 'text',
              align: 'center',
              baseline: 'top',
              dy: 5,
              angle: -90,
              fontSize: adaptiveFontSize,
              fontWeight: 600,
              color: '#333',
              clip: false
            },
            encoding: {
              x: {
                field: 'categoryValue',
                type: 'nominal',
                sort: { field: 'sortValue', order: 'descending' },
                axis: null
              },
              y: { value: 0, type: 'quantitative' },
              text: { field: 'labelText', type: 'nominal' }
            }
          }]
        } else if (labelMode === 'value+series') {
          // COMBINED: Value labels with series annotation
          // Use value label logic but include series name
          const baseTransform = groupByColumn
            ? {
                transform: [
                  {
                    calculate: `format(datum["${valueField}"], "${numberFormat}") + " (" + datum["${groupByColumn}"] + ")"`,
                    as: 'labelText'
                  },
                  {
                    joinaggregate: [{ op: 'max', field: valueField, as: 'maxValue' }]
                  },
                  {
                    calculate: `datum["${valueField}"] / datum.maxValue`,
                    as: 'barHeightRatio'
                  }
                ]
              }
            : {
                transform: [
                  { fold: valueColumns, as: ['series', 'value'] },
                  {
                    calculate: `format(datum.value, "${numberFormat}") + " (" + datum.series + ")"`,
                    as: 'labelText'
                  },
                  {
                    joinaggregate: [{ op: 'max', field: 'value', as: 'maxValue' }]
                  },
                  {
                    calculate: 'datum.value / datum.maxValue',
                    as: 'barHeightRatio'
                  }
                ]
              }
          
          return [
            {
              ...baseTransform,
              mark: {
                type: 'text',
                align: 'center',
                baseline: useRotatedLabels ? 'middle' : 'bottom',
                dy: useRotatedLabels ? 0 : -4,
                angle: useRotatedLabels ? -45 : 0,
                fontSize: adaptiveFontSize,
                fontWeight: 600,
                color: '#333',
                clip: false,
                limit: useRotatedLabels ? 50 : undefined
              },
              encoding: {
                x: { field: categoryColumn, type: 'nominal', sort: { field: 'sortValue', order: 'descending' } },
                xOffset: { field: groupByColumn ? groupByColumn : 'series' },
                y: { field: groupByColumn ? valueField : 'value', type: 'quantitative' },
                text: { field: 'labelText', type: 'nominal' },
                opacity: {
                  condition: {
                    test: groupByColumn
                      ? `datum["${valueField}"] != null && datum.maxValue > 0 && datum.barHeightRatio >= 0.05`
                      : 'datum.value != null && datum.maxValue > 0 && datum.barHeightRatio >= 0.05',
                    value: 1
                  },
                  value: 0
                }
              }
            },
            {
              ...baseTransform,
              mark: {
                type: 'text',
                align: 'center',
                baseline: 'middle',
                fontSize: adaptiveFontSize,
                fontWeight: 600,
                color: '#ffffff',
                clip: false
              },
              encoding: {
                x: { field: categoryColumn, type: 'nominal', sort: { field: 'sortValue', order: 'descending' } },
                xOffset: { field: groupByColumn ? groupByColumn : 'series' },
                y: { field: groupByColumn ? valueField : 'value', type: 'quantitative' },
                text: { field: 'labelText', type: 'nominal' },
                opacity: {
                  condition: {
                    test: groupByColumn
                      ? `datum["${valueField}"] != null && datum.maxValue > 0 && datum.barHeightRatio > 0 && datum.barHeightRatio < 0.05`
                      : 'datum.value != null && datum.maxValue > 0 && datum.barHeightRatio > 0 && datum.barHeightRatio < 0.05',
                    value: 1
                  },
                  value: 0
                }
              }
            }
          ]
        } else {
          // No labels
          return []
        }
      })() : []),
      ...(options.showDatumLogo ? [{
        data: { values: [{}] },
        mark: {
          type: 'text',
          align: 'right',
          baseline: 'bottom',
          dx: -10,
          dy: -10,
          fontSize: options.datumLogoSize === 'medium' ? 14 : 11,
          color: '#999',
          font: 'sans-serif',
          fontWeight: 600
        },
        encoding: {
          x: { value: 'width' },
          y: { value: 'height' },
          text: { value: 'Datum' }
        }
      }] : [])
    ],
    config: {
      view: { stroke: 'transparent', clip: false },
      axis: {
        domainColor: '#333',
        domainWidth: 1,
        tickColor: '#333',
        tickWidth: 1,
        labelColor: '#333',
        titleColor: '#333'
      },
      legend: {
        strokeColor: '#ccc',
        padding: 10,
        cornerRadius: 4
      }
    }
  }
}

/**
 * Generate Dot Plot (Horizontal Dot Chart)
 * Editorial chart for comparing entities at a single point in time
 * Supports multiple value columns (entities) like bar and line charts
 */
export function generateDotPlotSpec(
  data: Array<Record<string, any>>,
  categoryColumn: string,
  valueColumns: string[],
  options: EditorialOptions = {},
  dimensionColumn?: string
): Record<string, any> {
  // CRITICAL: Filter out category column from value columns
  // Category column must NEVER appear as a series
  const safeValueColumns = valueColumns.filter(col => col !== categoryColumn)
  
  // Fail-safe: If no valid value columns remain, throw error
  if (safeValueColumns.length === 0) {
    throw new Error('En az bir değer sütunu seçilmelidir.')
  }

  const categoryCount = new Set(data.map(row => row[categoryColumn]).filter(Boolean)).size
  if (categoryCount < 2) {
    throw new Error('Nokta grafiği için en az 2 kategori gereklidir.')
  }

  // Filter data if dimension column is selected (single point in time)
  let filteredData = data
  if (dimensionColumn) {
    // Get unique dimension values and use the first one (editor will select)
    const uniqueDimensions = Array.from(new Set(data.map(row => row[dimensionColumn]).filter(Boolean)))
    if (uniqueDimensions.length > 0) {
      filteredData = data.filter(row => row[dimensionColumn] === uniqueDimensions[0])
    }
  }

  const colorPalette = getColorPalette(options.colorMode || 'multi-color')
  const labelSize = getLabelSize(options.labelSize)
  const numberFormat = getNumberFormat(options.numberFormat)
  
  // Label configuration
  const labelSource = options.barLabelSource || 'none'
  const showLabels = labelSource !== 'none'
  // For dot plot, placement can be 'left' or 'right'
  // Handle both string values and the BarLabelPlacement type
  const rawPlacement = options.barLabelPlacement as any
  const labelPlacement = (rawPlacement === 'left' || rawPlacement === 'right') 
    ? rawPlacement 
    : 'right'
  const isLabelLeft = labelPlacement === 'left'
  
  // Axis orientation: Default to horizontal (backward-compatible)
  const orientation = options.dotPlotOrientation || 'horizontal'
  const isVertical = orientation === 'vertical'
  
  // Calculate row height based on number of categories and series
  const seriesCount = safeValueColumns.length
  const rowHeight = Math.max(30, Math.min(50, 400 / categoryCount))
  const chartHeight = categoryCount * rowHeight + 100

  // Check if multi-series (like bar and line charts)
  const isMultiSeries = safeValueColumns.length > 1
  
  // Axis title overrides: Support both X and Y axis overrides
  // When vertical, axes are swapped, so we need to handle overrides correctly
  const xAxisOverride = options.xAxisLabel?.trim()
  const yAxisOverride = options.yAxisLabel?.trim()
  
  // Default axis titles (when no override)
  const defaultCategoryTitle = categoryColumn
  const defaultValueTitle = 'Değer' // Never use entity names as axis titles
  
  // Determine actual axis titles based on orientation and overrides
  // Horizontal: X = Value, Y = Category
  // Vertical: X = Category, Y = Value
  const valueAxisTitle = isVertical 
    ? (yAxisOverride || defaultValueTitle)
    : (xAxisOverride || defaultValueTitle)
  const categoryAxisTitle = isVertical
    ? (xAxisOverride || defaultCategoryTitle)
    : (yAxisOverride || defaultCategoryTitle)

  if (isMultiSeries) {
    // MULTI-SERIES: Transform to long format (like bar and line charts)
    const longData = transformToLongFormat(filteredData, categoryColumn, safeValueColumns)
    
    // Calculate sort values: use first series value for each category
    const firstSeries = safeValueColumns[0]
    const categorySortMap = new Map<string, number>()
    filteredData.forEach(row => {
      const cat = row[categoryColumn]
      if (cat && !categorySortMap.has(cat)) {
        const val = typeof row[firstSeries] === 'number' ? row[firstSeries] : parseFloat(row[firstSeries]) || 0
        categorySortMap.set(cat, val)
      }
    })
    
    // Add sort value to each row
    const longDataWithSort = longData.map(row => ({
      ...row,
      sortValue: categorySortMap.get(row.time) || 0
    }))

    return {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      width: 'container',
      height: chartHeight,
      padding: { left: 10, right: 10, top: 30, bottom: 10 },
      background: 'white',
      ...(options.title && {
        title: {
          text: options.title,
          subtitle: options.subtitle,
          anchor: 'start',
          fontSize: 18,
          fontWeight: 600,
          subtitleFontSize: 14,
          subtitleColor: '#666',
          offset: 20
        }
      }),
      data: { values: longDataWithSort },
      layer: [
        // Dots layer
        {
          mark: {
            type: 'point',
            filled: true,
            size: 80,
            tooltip: true
          },
          encoding: {
            ...(isVertical ? {
              // Vertical: X = Category, Y = Value
              x: {
                field: 'time', // category column (renamed in transform)
                type: 'nominal',
                title: categoryAxisTitle,
                sort: { field: 'sortValue', order: 'descending' },
                axis: {
                  labelFontSize: labelSize,
                  titleFontSize: labelSize + 2,
                  labelAngle: 0
                }
              },
              y: {
                field: 'value',
                type: 'quantitative',
                title: valueAxisTitle,
                axis: {
                  labelFontSize: labelSize,
                  titleFontSize: labelSize + 2,
                  grid: true,
                  gridOpacity: 0.3,
                  format: numberFormat,
                  tickCount: 6
                },
                scale: { zero: false, nice: true }
              }
            } : {
              // Horizontal (default): X = Value, Y = Category
              y: {
                field: 'time', // category column (renamed in transform)
                type: 'nominal',
                title: categoryAxisTitle,
                sort: { field: 'sortValue', order: 'descending' },
                axis: {
                  labelFontSize: labelSize,
                  titleFontSize: labelSize + 2,
                  labelAngle: 0
                }
              },
              x: {
                field: 'value',
                type: 'quantitative',
                title: valueAxisTitle,
                axis: {
                  labelFontSize: labelSize,
                  titleFontSize: labelSize + 2,
                  grid: true,
                  gridOpacity: 0.3,
                  format: numberFormat,
                  tickCount: 6
                },
                scale: { zero: false, nice: true }
              }
            }),
            color: {
              field: 'series',
              type: 'nominal',
              title: null,
              scale: { range: colorPalette },
              legend: options.showLegend !== false ? {
                orient: 'top',
                direction: 'horizontal',
                titleFontSize: labelSize,
                labelFontSize: labelSize,
                symbolSize: 100,
                symbolStrokeWidth: 2,
                offset: 10
              } : null
            },
            tooltip: [
              { field: 'series', type: 'nominal', title: 'Seri' },
              { field: 'time', type: 'nominal', title: 'Kategori' },
              { field: 'value', type: 'quantitative', title: 'Değer', format: numberFormat }
            ]
          }
        },
        // Labels layer (if enabled)
        ...(showLabels ? [{
          mark: {
            type: 'text',
            align: isLabelLeft ? 'right' : 'left',
            baseline: 'middle',
            dx: isLabelLeft ? -8 : 8,
            fontSize: labelSize,
            fontWeight: 600,
            color: '#333',
            clip: false
          },
          encoding: {
            ...(isVertical ? {
              // Vertical: X = Category, Y = Value
              x: {
                field: 'time',
                type: 'nominal',
                sort: { field: 'sortValue', order: 'descending' }
              },
              y: { field: 'value', type: 'quantitative' }
            } : {
              // Horizontal (default): X = Value, Y = Category
              y: {
                field: 'time',
                type: 'nominal',
                sort: { field: 'sortValue', order: 'descending' }
              },
              x: { field: 'value', type: 'quantitative' }
            }),
            text: labelSource === 'value'
              ? {
                  field: 'value',
                  type: 'quantitative',
                  format: numberFormat
                }
              : labelSource === 'category'
              ? { field: 'time', type: 'nominal' }
              : { field: 'series', type: 'nominal' },
            color: {
              field: 'series',
              type: 'nominal',
              scale: { range: colorPalette },
              legend: null
            }
          }
        }] : [])
      ],
      config: {
        view: { stroke: 'transparent' },
        axis: {
          domainColor: '#333',
          domainWidth: 1,
          tickColor: '#333',
          tickWidth: 1,
          labelColor: '#333',
          titleColor: '#333'
        },
        legend: {
          strokeColor: '#ccc',
          padding: 10,
          cornerRadius: 4
        }
      }
    }
  } else {
    // SINGLE SERIES: Simpler spec (like single-series line chart)
    const singleValueColumn = safeValueColumns[0]
    const singleColor = colorPalette[0]
    
    // Prepare data: one row per category with value
    const dotData = filteredData.map(row => ({
      category: row[categoryColumn],
      value: typeof row[singleValueColumn] === 'number' ? row[singleValueColumn] : parseFloat(row[singleValueColumn]) || 0
    })).filter(row => row.category && !isNaN(row.value))

    // Sort by value (descending) for better comparison
    dotData.sort((a, b) => b.value - a.value)

    return {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      width: 'container',
      height: chartHeight,
      padding: { left: 10, right: 10, top: 30, bottom: 10 },
      background: 'white',
      ...(options.title && {
        title: {
          text: options.title,
          subtitle: options.subtitle,
          anchor: 'start',
          fontSize: 18,
          fontWeight: 600,
          subtitleFontSize: 14,
          subtitleColor: '#666',
          offset: 20
        }
      }),
      data: { values: dotData },
      layer: [
        // Dots layer
        {
          mark: {
            type: 'point',
            filled: true,
            size: 80,
            color: singleColor,
            tooltip: true
          },
          encoding: {
            ...(isVertical ? {
              // Vertical: X = Category, Y = Value
              x: {
                field: 'category',
                type: 'nominal',
                title: categoryAxisTitle,
                sort: { field: 'value', order: 'descending' },
                axis: {
                  labelFontSize: labelSize,
                  titleFontSize: labelSize + 2,
                  labelAngle: 0
                }
              },
              y: {
                field: 'value',
                type: 'quantitative',
                title: valueAxisTitle,
                axis: {
                  labelFontSize: labelSize,
                  titleFontSize: labelSize + 2,
                  grid: true,
                  gridOpacity: 0.3,
                  format: numberFormat,
                  tickCount: 6
                },
                scale: { zero: false, nice: true }
              }
            } : {
              // Horizontal (default): X = Value, Y = Category
              y: {
                field: 'category',
                type: 'nominal',
                title: categoryAxisTitle,
                sort: { field: 'value', order: 'descending' },
                axis: {
                  labelFontSize: labelSize,
                  titleFontSize: labelSize + 2,
                  labelAngle: 0
                }
              },
              x: {
                field: 'value',
                type: 'quantitative',
                title: valueAxisTitle,
                axis: {
                  labelFontSize: labelSize,
                  titleFontSize: labelSize + 2,
                  grid: true,
                  gridOpacity: 0.3,
                  format: numberFormat,
                  tickCount: 6
                },
                scale: { zero: false, nice: true }
              }
            }),
            tooltip: [
              { field: 'category', type: 'nominal', title: 'Kategori' },
              { field: 'value', type: 'quantitative', title: 'Değer', format: numberFormat }
            ]
          }
        },
        // Labels layer (if enabled)
        ...(showLabels ? [{
          mark: {
            type: 'text',
            align: isLabelLeft ? 'right' : 'left',
            baseline: 'middle',
            dx: isLabelLeft ? -8 : 8,
            fontSize: labelSize,
            fontWeight: 600,
            color: '#333',
            clip: false
          },
          encoding: {
            ...(isVertical ? {
              // Vertical: X = Category, Y = Value
              x: {
                field: 'category',
                type: 'nominal',
                sort: { field: 'value', order: 'descending' }
              },
              y: { field: 'value', type: 'quantitative' }
            } : {
              // Horizontal (default): X = Value, Y = Category
              y: {
                field: 'category',
                type: 'nominal',
                sort: { field: 'value', order: 'descending' }
              },
              x: { field: 'value', type: 'quantitative' }
            }),
            text: labelSource === 'value'
              ? {
                  field: 'value',
                  type: 'quantitative',
                  format: numberFormat
                }
              : { field: 'category', type: 'nominal' }
          }
        }] : [])
      ],
      config: {
      view: { stroke: 'transparent' },
      axis: {
        domainColor: '#333',
        domainWidth: 1,
        tickColor: '#333',
        tickWidth: 1,
        labelColor: '#333',
        titleColor: '#333'
      }
    }
    }
  }
}

/**
 * Histogram Chart Generator (V1)
 * 
 * Shows the distribution of a single numeric variable.
 * - X-axis: numeric bins (ranges)
 * - Y-axis: frequency (count)
 * - Vertical bars, touching (no gaps)
 * - Automatic binning by default (10-20 bins)
 * - Optional bin count control
 */
export function generateHistogramSpec(
  data: Array<Record<string, any>>,
  valueColumn: string,
  options: EditorialOptions = {},
  categoryColumn?: string
): Record<string, any> {
  // CRITICAL FIX BUG 1: Histogram accepts EXACTLY ONE numeric column
  // Category is optional and filter-only (not used for grouping)
  // Filter out null/undefined/empty values - be lenient with numeric parsing
  const validData = data.filter(row => {
    const value = row[valueColumn]
    // Allow string numbers like "18", "19" to be parsed
    const numValue = typeof value === 'string' 
      ? parseFloat(value.replace(',', '.')) // Handle comma decimal separator
      : Number(value)
    return value !== null && value !== undefined && value !== '' && !isNaN(numValue) && isFinite(numValue)
  })

  // CRITICAL: Only warn if ZERO valid numeric values exist, don't throw
  // Allow empty histogram if needed (better than blocking the user)
  if (validData.length === 0) {
    // Don't throw - render empty histogram instead
    // This allows the editor to see the issue without blocking preview
  }

  // Get label sizes and formats
  const labelSize = getLabelSize(options.labelSize)
  const numberFormat = getNumberFormat(options.numberFormat)

  // X-axis title: Use value column name as default, allow override
  const xAxisTitle = options.xAxisLabel?.trim() || valueColumn

  // Y-axis title: Default to "Frekans", allow override
  const yAxisTitle = options.yAxisLabel?.trim() || 'Frekans'

  // Bin count: Use editor-provided value or sensible default (15 bins)
  const binCount = options.histogramBinCount && options.histogramBinCount > 0
    ? options.histogramBinCount
    : 15

  // Get default color (reuse existing color logic)
  const colorPalette = getColorPalette(options.colorMode || 'single-color')
  const defaultColor = colorPalette[0] || '#3b82f6'

  return {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    width: 'container',
    height: 400,
    padding: { left: 60, right: 20, top: 30, bottom: 40 },
    background: 'white',

    // Title configuration (reuse from line chart)
    ...(options.title && {
      title: {
        text: options.title,
        subtitle: options.subtitle,
        anchor: 'start',
        fontSize: 18,
        fontWeight: 600,
        subtitleFontSize: 14,
        subtitleColor: '#666',
        offset: 20
      }
    }),

    // CRITICAL FIX: Use layer structure to support Datum logo (same as other charts)
    layer: [
      // Main histogram bars - MUST use bin encoding on x, count on y
      // This is the ONLY correct way to create a histogram in Vega-Lite
      {
        data: { values: validData },
        mark: {
          type: 'bar',
          // CRITICAL: binSpacing: 0 ensures bars touch (no gaps)
          binSpacing: 0,
          color: defaultColor
        },
        encoding: {
          // X-axis: MUST use bin: true on the original numeric field
          // This is the histogram definition - do NOT use x2
          x: {
            field: valueColumn,
            type: 'quantitative',
            bin: { maxbins: binCount },
            title: xAxisTitle,
            axis: {
              labelAngle: 0,
              labelFontSize: labelSize,
              titleFontSize: labelSize + 2,
              grid: false,
              format: numberFormat
            }
          },

          // Y-axis: MUST use aggregate: 'count'
          // This is the histogram definition - count of records per bin
          y: {
            aggregate: 'count',
            type: 'quantitative',
            title: yAxisTitle,
            axis: {
              labelFontSize: labelSize,
              titleFontSize: labelSize + 2,
              grid: true,
              gridOpacity: 0.3,
              format: numberFormat
            },
            scale: {
              zero: true // Y-axis must start at 0 for histograms
            }
          },

          // Tooltip: Show bin range and count
          tooltip: [
            // Category field (optional, filter-only, shown in tooltip)
            ...(categoryColumn ? [{
              field: categoryColumn,
              type: 'nominal',
              title: categoryColumn
            }] : []),
            // Bin range (auto-generated by Vega-Lite)
            {
              field: valueColumn,
              type: 'quantitative',
              bin: { maxbins: binCount },
              title: xAxisTitle,
              format: numberFormat
            },
            // Count with empty title to suppress default label
            {
              aggregate: 'count',
              type: 'quantitative',
              title: '', // Empty string to hide "Count of Records"
              format: numberFormat
            }
          ]
        }
      },
      // Datum logo (optional, bottom-right) - same as other charts
      ...(options.showDatumLogo ? [{
        data: { values: [{}] },
        mark: {
          type: 'text',
          align: 'right',
          baseline: 'bottom',
          dx: -10,
          dy: -10,
          fontSize: options.datumLogoSize === 'medium' ? 14 : 11,
          color: '#999',
          font: 'sans-serif',
          fontWeight: 600
        },
        encoding: {
          x: { value: 'width' },
          y: { value: 'height' },
          text: { value: 'Datum' }
        }
      }] : [])
    ],

    config: {
      view: { stroke: 'transparent' },
      axis: {
        domainColor: '#333',
        domainWidth: 1,
        tickColor: '#333',
        tickWidth: 1,
        labelColor: '#333',
        titleColor: '#333'
      },
      // CRITICAL FIX ISSUE 2: Suppress default aggregate labels in tooltip
      // Vega-Lite adds default titles like "Count of Records" - explicitly disable
      tooltip: {
        // Suppress default aggregate titles by ensuring no title is shown
        // This prevents Vega from auto-generating "count", "Count of Records", etc.
        formatType: 'number'
      }
    }
  }
}

/**
 * Main chart spec generator
 * Currently only Time Series Line is fully implemented
 */
export function generateChartSpec(
  templateId: ChartTemplateId,
  data: Array<Record<string, any>>,
  columnMappings: Record<string, string | string[]>,
  options: EditorialOptions = {}
): Record<string, any> {
  if (templateId === 'time-series-line') {
    const timeColumn = columnMappings['time'] as string
    const valueColumns = Array.isArray(columnMappings['value']) 
      ? columnMappings['value'] 
      : [columnMappings['value'] as string]
    
    return generateTimeSeriesLineSpec(data, timeColumn, valueColumns, options)
  }

  if (templateId === 'category-bar') {
    const categoryColumn = columnMappings['time'] as string
    const groupByColumn = columnMappings['groupBy'] as string | undefined
    const rawValueColumns = Array.isArray(columnMappings['value'])
      ? columnMappings['value']
      : [columnMappings['value'] as string]
    
    // CRITICAL: Filter out category column from value columns
    // Category column (time/Year) must NEVER appear as a series
    const valueColumns = rawValueColumns.filter(col => col !== categoryColumn)
    
    // CRITICAL: Ensure groupByColumn is not the category column
    const safeGroupByColumn = groupByColumn && groupByColumn !== categoryColumn
      ? groupByColumn
      : undefined

    return generateCategoryBarSpec(data, categoryColumn, valueColumns, options, safeGroupByColumn)
  }

  if (templateId === 'dot-plot') {
    const categoryColumn = columnMappings['time'] as string
    const dimensionColumn = columnMappings['groupBy'] as string | undefined
    const rawValueColumns = Array.isArray(columnMappings['value'])
      ? columnMappings['value']
      : [columnMappings['value'] as string]
    
    // CRITICAL: Filter out category column from value columns
    // Category column must NEVER appear as a series
    const valueColumns = rawValueColumns.filter(col => col !== categoryColumn)
    
    if (valueColumns.length === 0) {
      throw new Error('En az bir değer sütunu seçilmelidir.')
    }
    
    // CRITICAL: Ensure dimensionColumn is not the category column
    const safeDimensionColumn = dimensionColumn && dimensionColumn !== categoryColumn
      ? dimensionColumn
      : undefined

    return generateDotPlotSpec(data, categoryColumn, valueColumns, options, safeDimensionColumn)
  }

  if (templateId === 'stacked-area') {
    const timeColumn = columnMappings['time'] as string
    const valueColumns = Array.isArray(columnMappings['value']) 
      ? columnMappings['value'] 
      : [columnMappings['value'] as string]
    
    return generateStackedAreaSpec(data, timeColumn, valueColumns, options)
  }

  if (templateId === 'slope-chart') {
    const timeColumn = columnMappings['time'] as string
    const valueColumns = Array.isArray(columnMappings['value']) 
      ? columnMappings['value'] 
      : [columnMappings['value'] as string]
    
    return generateSlopeChartSpec(data, timeColumn, valueColumns, options)
  }

  if (templateId === 'histogram') {
    const rawValueColumns = Array.isArray(columnMappings['value'])
      ? columnMappings['value']
      : [columnMappings['value'] as string]
    
    // CRITICAL: Histogram uses exactly ONE numeric value column
    // Additional numeric columns are ignored (editor chooses ONE)
    const valueColumn = rawValueColumns[0]
    
    if (!valueColumn) {
      throw new Error('Histogram için en az bir sayısal değer sütunu seçilmelidir.')
    }
    
    // CRITICAL FIX BUG 1: Category column is optional for histogram (filter-only, not grouping)
    // timeColumn is treated as category if provided, but not required
    const categoryColumn = columnMappings['time'] as string | undefined
    
    return generateHistogramSpec(data, valueColumn, options, categoryColumn)
  }
  
  // Other templates not implemented yet
  return {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    width: 'container',
    height: 400,
    data: { values: [] },
    mark: 'text',
    encoding: {
      text: { value: 'Bu grafik tipi henüz implement edilmedi' }
    }
  }
}
