'use client'

import { useRouter } from 'next/navigation'

const USERS = [
  { name: 'ママ', emoji: '👩' },
  { name: 'パパ', emoji: '👨' },
  { name: 'お姫様', emoji: '👸' },
]

export default function LoginPage() {
  const router = useRouter()

  const handleLogin = (userName: string) => {
    localStorage.setItem('currentUser', userName)
    router.push('/home')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* タイトル */}
        <div className="text-center mb-10">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-3xl font-bold text-green-800 tracking-wide">
            買い物管理
          </h1>
          <div className="mt-5 h-px bg-green-300 mx-8" />
        </div>

        {/* サブタイトル */}
        <p className="text-center text-gray-500 mb-6 text-lg font-medium">
          誰が使う？
        </p>

        {/* ユーザー選択ボタン */}
        <div className="space-y-4">
          {USERS.map((user) => (
            <button
              key={user.name}
              onClick={() => handleLogin(user.name)}
              className="w-full bg-white rounded-2xl shadow-md px-6 py-5 flex items-center gap-5 text-xl font-semibold text-gray-700 hover:bg-green-50 hover:shadow-lg active:scale-95 transition-all duration-150"
            >
              <span className="text-4xl">{user.emoji}</span>
              <span>{user.name}</span>
              <span className="ml-auto text-gray-300 text-2xl">›</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
