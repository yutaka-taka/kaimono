'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const USER_EMOJI: Record<string, string> = {
  ママ: '👩',
  パパ: '👨',
  お姫様: '👸',
}

export default function HomePage() {
  const router = useRouter()
  const [userName, setUserName] = useState('')

  useEffect(() => {
    const user = localStorage.getItem('currentUser')
    if (!user) {
      router.replace('/')
      return
    }
    setUserName(user)
  }, [router])

  if (!userName) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex flex-col">
      {/* ヘッダー */}
      <div className="bg-green-500 text-white px-6 py-4 shadow-md">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{USER_EMOJI[userName] ?? '👤'}</span>
          <span className="text-lg font-semibold">{userName} こんにちは！</span>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-5">
        <button
          onClick={() => router.push('/list')}
          className="w-full max-w-sm bg-white rounded-2xl shadow-md p-8 flex flex-col items-center gap-3 hover:shadow-xl hover:bg-green-50 active:scale-95 transition-all duration-150"
        >
          <span className="text-6xl">🛒</span>
          <span className="text-2xl font-bold text-green-700">買い物リスト</span>
          <span className="text-sm text-gray-400">リストを確認・削除する</span>
        </button>

        <button
          onClick={() => router.push('/request')}
          className="w-full max-w-sm bg-white rounded-2xl shadow-md p-8 flex flex-col items-center gap-3 hover:shadow-xl hover:bg-orange-50 active:scale-95 transition-all duration-150"
        >
          <span className="text-6xl">✉️</span>
          <span className="text-2xl font-bold text-orange-500">リクエスト</span>
          <span className="text-sm text-gray-400">買ってほしいものを登録する</span>
        </button>
      </div>

      {/* フッター：戻るボタン */}
      <div className="bg-white border-t border-gray-100 shadow-up px-6 py-4 text-center">
        <button
          onClick={() => router.push('/')}
          className="text-gray-400 text-base py-2 px-6 rounded-xl hover:text-gray-600 hover:bg-gray-50 transition-all"
        >
          戻る
        </button>
      </div>
    </div>
  )
}
