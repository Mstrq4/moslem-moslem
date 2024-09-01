// pages/dashboard/index.tsx
'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase'
import '../../styles/globals.css'; // تأكد من إنشاء هذا الملف وإضافة أي أنماط عامة تحتاجها
import DashboardLayout from "@/components/admin/DashboardLayout";
import { Sidebar } from '@/components/admin/Sidebar';
import { Header } from '@/components/admin/Header';
import { SettingsProvider } from '../../../contexts/SettingsContext';
import { Loader2, LucideLoader2 } from 'lucide-react';
export default function DashboardPage(
  {
    children,
  }: {
    children: React.ReactNode
  }
) {

  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user)
      } else {
        router.push('/login')
      }
    })

    return () => unsubscribe()
  }, [router])

  const handleLogout = async () => {
    await auth.signOut()
    router.push('/login')
  }

  if (!user) {
    return <div className="flex justify-center items-center h-screen">
    <LucideLoader2 className="h-8 w-8 animate-spin" />
  </div>
  }


  return (
    <div className="flex h-screen w-full">
        <Sidebar />
      <main className=" w-full grid flex-col p-2 overflow-auto">
        <div className="flex-1">
        <Header />
          {children}
        </div>
      </main>
    </div>
    
  )
}