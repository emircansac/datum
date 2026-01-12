'use client'

import { useState } from 'react'

interface EmbedCodeProps {
  slug: string
  version: number
  siteUrl: string
}

export default function EmbedCode({ slug, version, siteUrl }: EmbedCodeProps) {
  const [copied, setCopied] = useState(false)
  const embedCode = `<iframe src="${siteUrl}/embed/${slug}?v=${version}" width="100%" height="400" frameborder="0" allowfullscreen></iframe>`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mt-8 p-6 bg-gray-50 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold">Gömme Kodu</h3>
        <button
          onClick={copyToClipboard}
          className="px-4 py-2 text-sm bg-black text-white rounded hover:bg-gray-800 transition-colors"
        >
          {copied ? 'Kopyalandı!' : 'Kopyala'}
        </button>
      </div>
      <pre className="text-xs bg-white p-4 rounded border border-gray-200 overflow-x-auto">
        <code>{embedCode}</code>
      </pre>
    </div>
  )
}
