'use client'

import { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function AdminRegister() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      setError('تم إنشاء حساب المشرف بنجاح')
    } catch (error) {
      setError('حدث خطأ أثناء إنشاء الحساب')
    }
  }

  return (
    <div className="flex justify-center py-2 col-span-2">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>إنشاء حساب مشرف</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister}>
            <div className="space-y-4">
              <Input
                type="email"
                placeholder="البريد الإلكتروني"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                // إضافة خاصية autocomplete للبريد الإلكتروني
                autoComplete="email"
              />
              <Input
                type="password"
                placeholder="كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                // إضافة خاصية autocomplete لكلمة المرور
                autoComplete="current-password"
              />
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <Button type="submit" className="w-full mt-4">إنشاء الحساب</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
