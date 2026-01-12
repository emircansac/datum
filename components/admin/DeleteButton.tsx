'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseClient } from '@/lib/supabase/client'

interface DeleteButtonProps {
  id: string
  type: 'visualization' | 'collection'
  title: string
  onDelete?: () => void
}

export default function DeleteButton({ id, type, title, onDelete }: DeleteButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`"${title}" ${type === 'visualization' ? 'görselleştirmesini' : 'koleksiyonunu'} silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`)) {
      return
    }

    setLoading(true)
    try {
      const supabase = createSupabaseClient()
      const table = type === 'visualization' ? 'visualizations' : 'collections'
      const { error } = await supabase.from(table).delete().eq('id', id)

      if (error) {
        alert(`Silme hatası: ${error.message}`)
        setLoading(false)
        return
      }

      if (onDelete) {
        onDelete()
      } else {
        router.push(`/admin/${type === 'visualization' ? 'viz' : 'collections'}`)
        router.refresh()
      }
    } catch (err: any) {
      alert(`Hata: ${err.message}`)
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-xs text-red-600 hover:text-red-800 hover:underline disabled:opacity-50"
    >
      {loading ? 'Siliniyor...' : 'Sil'}
    </button>
  )
}
