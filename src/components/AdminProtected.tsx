// src/components/AdminProtected.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase'

export default function AdminProtected({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsAuthenticated(true)
      } else {
        router.push('/admin/login')
      }
    })

    return () => unsubscribe()
  }, [router])

  if (!isAuthenticated) {
    return <div>جاري التحميل...</div>
  }

  return <>{children}</>
}