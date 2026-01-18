/**
 * CSV/TSV Parser Utility
 * Parses CSV or tab-separated data into structured format
 */

export interface ParseResult {
  success: boolean
  data?: Array<Record<string, any>>
  columns?: string[]
  error?: string
}

/**
 * Parse CSV or TSV data into structured format
 */
export function parseCSV(input: string): ParseResult {
  if (!input || !input.trim()) {
    return {
      success: false,
      error: 'Veri boş. Lütfen CSV veya tab-separated veri girin.'
    }
  }

  const lines = input.trim().split('\n').filter(line => line.trim())
  
  if (lines.length < 2) {
    return {
      success: false,
      error: 'En az bir başlık satırı ve bir veri satırı gerekli.'
    }
  }

  // Detect delimiter (comma or tab)
  const firstLine = lines[0]
  const hasTabs = firstLine.includes('\t')
  const delimiter = hasTabs ? '\t' : ','

  // Parse headers
  const headers = firstLine.split(delimiter).map(h => h.trim().replace(/^"|"$/g, ''))

  if (headers.length === 0 || headers.some(h => !h)) {
    return {
      success: false,
      error: 'Başlık satırı geçersiz. Her sütunun bir adı olmalı.'
    }
  }

  // Parse data rows
  const data: Array<Record<string, any>> = []
  const errors: string[] = []

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]
    const values = line.split(delimiter).map(v => v.trim().replace(/^"|"$/g, ''))

    if (values.length !== headers.length) {
      errors.push(`Satır ${i + 1}: Sütun sayısı eşleşmiyor (${values.length} sütun, ${headers.length} bekleniyor)`)
      continue
    }

    const row: Record<string, any> = {}
    headers.forEach((header, index) => {
      const value = values[index]
      // CRITICAL FIX: Handle both comma and dot as decimal separator
      // Turkish locale uses comma (8,8), English uses dot (8.8)
      // If delimiter is comma, we need to handle dot decimals correctly
      // If delimiter is tab, we need to handle both comma and dot decimals
      let numValue: number
      if (delimiter === '\t' && value.includes(',')) {
        // Tab-delimited data with comma decimal (Turkish format)
        numValue = parseFloat(value.replace(',', '.'))
      } else {
        // Comma-delimited data or dot decimal (English format)
        numValue = parseFloat(value)
      }
      row[header] = isNaN(numValue) || value === '' ? value : numValue
    })
    data.push(row)
  }

  if (data.length === 0) {
    return {
      success: false,
      error: 'Hiç veri satırı işlenemedi. Lütfen veri formatını kontrol edin.'
    }
  }

  return {
    success: true,
    data,
    columns: headers,
    ...(errors.length > 0 && { error: errors.slice(0, 3).join('; ') + (errors.length > 3 ? '...' : '') })
  }
}

/**
 * Get sample CSV/TSV format for placeholder
 */
export function getSampleCSV(): string {
  return `Yıl,Değer
2020,100
2021,120
2022,135
2023,150`
}
