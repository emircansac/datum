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
  | 'ranked-bar'
  | 'scatter'
  | 'stacked-bar'
  | 'turkey-map'
  | 'simple-table'

export type ColorMode = 'monochrome' | 'single-color' | 'multi-color'
export type LabelSize = 'small' | 'medium' | 'large'
export type NumberFormat = 'comma' | 'dot'
export type LogoSize = 'small' | 'medium'

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
              title: options.yAxisLabel || 'Değer',
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
              title: options.yAxisLabel || 'Değer',
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
