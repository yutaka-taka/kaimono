'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'

interface ShoppingItem {
  id: number
  name: string
  quantity: number
  registrar: string
  image: string | null
  createdAt: string
}

export default function ListPage() {
  const router = useRouter()
  const [items, setItems] = useState<ShoppingItem[]>([])
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [imageModal, setImageModal] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const fetchItems = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/items')
      const data = await res.json()
      setItems(data)
    } catch {
      showToast('データの取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const toggleSelect = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const handleBulkSelect = () => {
    if (selected.size === items.length && items.length > 0) {
      setSelected(new Set())
    } else {
      setSelected(new Set(items.map((i) => i.id)))
    }
  }

  const handleDeleteClick = () => {
    if (selected.size === 0) {
      showToast('何も選択されていません')
      return
    }
    setShowDeleteConfirm(true)
  }

  const handleDeleteConfirm = async () => {
    setDeleting(true)
    try {
      await Promise.all(
        Array.from(selected).map((id) =>
          fetch(`/api/items/${id}`, { method: 'DELETE' })
        )
      )
      setSelected(new Set())
      setShowDeleteConfirm(false)
      await fetchItems()
    } catch {
      showToast('削除に失敗しました')
    } finally {
      setDeleting(false)
    }
  }

  const isAllSelected = items.length > 0 && selected.size === items.length

  return (
    <div className="h-screen flex flex-col bg-green-50">
      {/* ヘッダー */}
      <div className="bg-green-500 text-white px-4 py-4 shadow-md flex-shrink-0">
        <h1 className="text-xl font-bold text-center">🛒 買い物リスト</h1>
      </div>

      {/* テーブルヘッダー（固定） */}
      <div className="bg-green-100 border-b-2 border-green-200 flex-shrink-0">
        <div className="flex items-center">
          <div className="w-10 px-2 py-3 text-center text-sm font-bold text-green-700">
            ✓
          </div>
          <div className="flex-1 px-2 py-3 text-sm font-bold text-green-700">
            商品名
          </div>
          <div className="w-10 px-1 py-3 text-center text-sm font-bold text-green-700">
            数
          </div>
          <div className="w-16 px-1 py-3 text-center text-sm font-bold text-green-700">
            登録
          </div>
          <div className="w-10 px-1 py-3 text-center text-sm font-bold text-green-700">
            📷
          </div>
        </div>
      </div>

      {/* テーブルボディ（スクロール可能） */}
      <div className="flex-1 overflow-y-auto scrollbar-hide min-h-0">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400">
            <span className="text-4xl animate-pulse">🛒</span>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-2">
            <span className="text-4xl">📭</span>
            <span className="text-base">登録データはありません</span>
          </div>
        ) : (
          <>
            {items.map((item) => (
              <div
                key={item.id}
                className={`flex items-center border-b border-gray-100 transition-colors ${
                  selected.has(item.id) ? 'bg-green-50' : 'bg-white'
                }`}
              >
                <div className="w-10 px-2 py-3 flex items-center justify-center flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={selected.has(item.id)}
                    onChange={() => toggleSelect(item.id)}
                    className="w-5 h-5 accent-green-500 cursor-pointer"
                  />
                </div>
                <div className="flex-1 px-2 py-3 text-sm text-gray-700 break-words min-w-0">
                  {item.name}
                </div>
                <div className="w-10 px-1 py-3 text-center text-sm text-gray-600 flex-shrink-0">
                  {item.quantity}
                </div>
                <div className="w-16 px-1 py-3 text-center text-xs text-gray-500 flex-shrink-0 truncate">
                  {item.registrar}
                </div>
                <div className="w-10 px-1 py-3 text-center flex-shrink-0">
                  {item.image ? (
                    <button
                      onClick={() => setImageModal(item.image)}
                      className="text-blue-400 text-lg hover:text-blue-600 active:scale-95 transition-all"
                    >
                      📷
                    </button>
                  ) : null}
                </div>
              </div>
            ))}
            {/* 続きあり表示：常に末尾に配置（スクロールで見えなくなる） */}
            <div className="text-center py-3 text-xs text-gray-400 bg-green-50">
              ▲ 上にスクロールして確認
            </div>
          </>
        )}
      </div>

      {/* トースト通知 */}
      {toast && (
        <div className="flex-shrink-0 mx-4 mb-1">
          <div className="bg-yellow-100 border border-yellow-300 rounded-xl px-4 py-2 text-center text-yellow-700 text-sm">
            {toast}
          </div>
        </div>
      )}

      {/* 下部ボタンバー（固定） */}
      <div className="bg-white border-t border-gray-200 shadow-up px-4 py-3 flex gap-2 flex-shrink-0">
        <button
          onClick={handleBulkSelect}
          className={`flex-1 rounded-xl py-3 text-sm font-semibold transition-all active:scale-95 ${
            isAllSelected
              ? 'bg-green-500 text-white'
              : 'bg-green-100 text-green-700 hover:bg-green-200'
          }`}
        >
          {isAllSelected ? '✓ 全選択中' : '一括選択'}
        </button>
        <button
          onClick={handleDeleteClick}
          className="flex-1 bg-red-100 text-red-600 rounded-xl py-3 text-sm font-semibold hover:bg-red-200 active:scale-95 transition-all"
        >
          削除
        </button>
        <button
          onClick={() => router.push('/home')}
          className="flex-1 bg-gray-100 text-gray-600 rounded-xl py-3 text-sm font-semibold hover:bg-gray-200 active:scale-95 transition-all"
        >
          戻る
        </button>
      </div>

      {/* 削除確認モーダル */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-6">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-xs">
            <p className="text-center text-gray-700 text-lg font-semibold mb-2">
              削除してよいですか？
            </p>
            <p className="text-center text-gray-400 text-sm mb-6">
              選択中 {selected.size} 件を削除します
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                autoFocus
                className="flex-1 bg-green-500 text-white rounded-xl py-3 font-bold hover:bg-green-600 active:scale-95 transition-all ring-2 ring-green-300 disabled:opacity-50"
              >
                {deleting ? '削除中...' : '✓ はい'}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="flex-1 bg-gray-100 text-gray-600 rounded-xl py-3 font-semibold hover:bg-gray-200 active:scale-95 transition-all"
              >
                いいえ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 画像モーダル */}
      {imageModal && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setImageModal(null)}
        >
          <div className="relative max-w-full max-h-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageModal}
              alt="商品画像"
              className="max-w-full max-h-screen object-contain rounded-xl"
            />
            <button
              className="absolute top-2 right-2 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm"
              onClick={() => setImageModal(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
