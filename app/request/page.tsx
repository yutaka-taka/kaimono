'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'

export default function RequestPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState('1')
  const [image, setImage] = useState<string | null>(null)
  const [userName, setUserName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'warn' } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const user = localStorage.getItem('currentUser')
    if (!user) {
      router.replace('/')
      return
    }
    setUserName(user)
  }, [router])

  const showToast = (msg: string, type: 'success' | 'error' | 'warn' = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image()
      const url = URL.createObjectURL(file)

      img.onload = () => {
        const TARGET_BYTES = 1024 * 1024 // 1MB
        let width = img.naturalWidth
        let height = img.naturalHeight

        // 最大解像度を1200pxに制限
        if (width > 1200 || height > 1200) {
          const ratio = Math.min(1200 / width, 1200 / height)
          width = Math.floor(width * ratio)
          height = Math.floor(height * ratio)
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(img, 0, 0, width, height)

        // 品質を下げながら1MB以下にする
        let quality = 0.85
        let result = canvas.toDataURL('image/jpeg', quality)

        while (result.length * 0.75 > TARGET_BYTES && quality > 0.1) {
          quality = Math.max(0.1, quality - 0.1)
          result = canvas.toDataURL('image/jpeg', quality)
        }

        URL.revokeObjectURL(url)
        resolve(result)
      }

      img.src = url
    })
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const compressed = await compressImage(file)
      setImage(compressed)
    } catch {
      showToast('画像の処理に失敗しました', 'error')
    }
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 3)
    setQuantity(val === '' ? '' : val)
  }

  const handleSubmit = async () => {
    if (!name.trim()) {
      showToast('商品名を入力してください', 'warn')
      return
    }
    const qty = parseInt(quantity)
    if (!qty || qty < 1) {
      showToast('数量を入力してください', 'warn')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          quantity: qty,
          registrar: userName,
          image: image ?? null,
        }),
      })

      if (!res.ok) throw new Error()

      setName('')
      setQuantity('1')
      setImage(null)
      showToast('登録しました！', 'success')
    } catch {
      showToast('登録に失敗しました', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const toastColor = {
    success: 'bg-green-100 border-green-300 text-green-700',
    error: 'bg-red-100 border-red-300 text-red-600',
    warn: 'bg-yellow-100 border-yellow-300 text-yellow-700',
  }

  return (
    <div className="h-screen flex flex-col bg-green-50">
      {/* ヘッダー */}
      <div className="bg-orange-400 text-white px-4 py-4 shadow-md flex-shrink-0">
        <h1 className="text-xl font-bold text-center">✉️ 買い物リクエスト</h1>
      </div>

      {/* フォーム本体（スクロール可） */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-6 py-6 space-y-6 min-h-0">
        {/* 商品名 */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-2">
            商品名 <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            lang="ja"
            inputMode="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例）牛乳、りんご…"
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-700 text-base focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent transition-all"
          />
        </div>

        {/* 数量 */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-2">
            数量 <span className="text-red-400">*</span>
          </label>
          <input
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
            value={quantity}
            onChange={handleQuantityChange}
            min="1"
            max="999"
            className="w-28 bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-700 text-base focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent transition-all"
          />
          <p className="text-xs text-gray-400 mt-1">※ 3桁以内の数字</p>
        </div>

        {/* 画像アップロード */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-2">
            画像（任意）
          </label>

          {/* hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="image-input"
          />

          <label
            htmlFor="image-input"
            className="flex items-center justify-center gap-3 w-full bg-white border-2 border-dashed border-gray-200 rounded-xl py-5 text-gray-500 cursor-pointer hover:border-orange-300 hover:text-orange-500 active:scale-95 transition-all"
          >
            <span className="text-3xl">📷</span>
            <span className="text-sm font-medium">
              {image ? '画像を変更する（上書き）' : '写真を撮る / ファイルを選ぶ'}
            </span>
          </label>

          {image && (
            <div className="mt-3 flex items-start gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image}
                alt="プレビュー"
                className="w-20 h-20 object-cover rounded-xl border border-gray-200 shadow-sm"
              />
              <button
                onClick={() => setImage(null)}
                className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 active:scale-95 transition-all mt-1"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* トースト通知（フォーム内） */}
        {toast && (
          <div
            className={`rounded-xl border px-4 py-3 text-center text-sm font-medium ${toastColor[toast.type]}`}
          >
            {toast.msg}
          </div>
        )}
      </div>

      {/* 下部ボタン */}
      <div className="bg-white border-t border-gray-100 shadow-up px-6 py-4 space-y-3 flex-shrink-0">
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full bg-green-500 text-white rounded-2xl py-4 font-bold text-lg hover:bg-green-600 active:scale-95 transition-all shadow-md disabled:opacity-50"
        >
          {submitting ? '登録中…' : '登録する'}
        </button>
        <button
          onClick={() => router.push('/home')}
          className="w-full text-gray-400 py-2 text-center text-base hover:text-gray-600 transition-all"
        >
          戻る
        </button>
      </div>
    </div>
  )
}
