'use client'

import { useState, useEffect } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface Language {
  id: string
  nameAr: string
}

interface Category {
  id: string
  languageId: string
  nameAr: string
}

interface Dhikr {
  id: string
  languageId: string
  categoryId: string
  text: string
  repetitions: number
}

export default function Dashboard() {
  const [languages, setLanguages] = useState<Language[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [dhikrs, setDhikrs] = useState<Dhikr[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const languagesSnapshot = await getDocs(collection(db, 'languages'))
        const categoriesSnapshot = await getDocs(collection(db, 'categories'))
        const dhikrsSnapshot = await getDocs(collection(db, 'dhikrs'))

        setLanguages(languagesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Language)))
        setCategories(categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category)))
        setDhikrs(dhikrsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Dhikr)))
      } catch (error) {
        console.error("Error fetching data: ", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const totalRepetitions = dhikrs.reduce((sum, dhikr) => sum + dhikr.repetitions, 0)

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-right">
        <Card>
          <CardHeader>
            <CardTitle className="font-light">إجمالي الأذكار</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-light text-left">{dhikrs.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-light">إجمالي اللغات</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-light text-left">{languages.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-light">إجمالي التصنيفات</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-light text-left">{categories.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-light">إجمالي التكرارات</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-light text-left">{totalRepetitions}</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-light mb-4 text-right">إحصائيات اللغات</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {languages.map(language => {
            const languageDhikrs = dhikrs.filter(d => d.languageId === language.id)
            const languageCategories = categories.filter(c => c.languageId === language.id)
            return (
              <Card key={language.id}>
                <CardHeader className='text-center font-light'>
                  <CardTitle className="font-light">{language.nameAr}</CardTitle>
                </CardHeader>
                <CardContent className=' flex justify-between'>
                  <p>عدد الأذكار: {languageDhikrs.length}</p>
                  <p>عدد التصنيفات: {languageCategories.length}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}