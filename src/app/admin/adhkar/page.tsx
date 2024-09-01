'use client'

import { useState, useEffect, useCallback } from 'react'
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import { toast } from 'sonner'

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
  uniqueId: number
}

export default function ManageDhikr() {
  const [languages, setLanguages] = useState<Language[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [dhikrs, setDhikrs] = useState<Dhikr[]>([])
  const [selectedLanguage, setSelectedLanguage] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [newDhikr, setNewDhikr] = useState({ languageId: '', categoryId: '', text: '', repetitions: 1 })
  const [editDhikr, setEditDhikr] = useState<Dhikr | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [textareaRows, setTextareaRows] = useState(1)

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value
    setEditDhikr(prev => prev ? { ...prev, text: text } : null)
    
    // احتساب عدد الأسطر
    const lineCount = text.split('\n').length
    setTextareaRows(Math.max(1, Math.min(lineCount, 10))) // حد أقصى 10 أسطر
  }

  useEffect(() => {
    if (editDhikr?.text) {
      const lineCount = editDhikr.text.split('\n').length
      setTextareaRows(Math.max(1, Math.min(lineCount, 10)))
    }
  }, [editDhikr?.text])

  const fetchLanguages = useCallback(async () => {
    const querySnapshot = await getDocs(collection(db, 'languages'))
    setLanguages(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Language)))
  }, [])

  const fetchCategories = useCallback(async () => {
    const querySnapshot = await getDocs(collection(db, 'categories'))
    setCategories(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category)))
  }, [])

  const fetchDhikrs = useCallback(async () => {
    const querySnapshot = await getDocs(collection(db, 'dhikrs'))
    setDhikrs(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Dhikr)))
  }, [])

  useEffect(() => {
    fetchLanguages()
    fetchCategories()
    fetchDhikrs()
  }, [fetchLanguages, fetchCategories, fetchDhikrs])

  const addDhikr = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const maxUniqueId = Math.max(...dhikrs.map(d => d.uniqueId), 0)
      const newUniqueId = maxUniqueId + 1
      const docRef = await addDoc(collection(db, 'dhikrs'), {
        ...newDhikr,
        uniqueId: newUniqueId,
        repetitions: Number(newDhikr.repetitions)
      })
      console.log('تمت إضافة الذكر بنجاح مع المعرف:', docRef.id)
      setNewDhikr({ languageId: '', categoryId: '', text: '', repetitions: 1 })
      await fetchDhikrs()
      toast.success('تمت إضافة الذكر بنجاح')
    } catch (error) {
      console.error('خطأ في إضافة الذكر:', error)
      toast.error('حدث خطأ أثناء إضافة الذكر')
    }
    setIsLoading(false)
  }, [newDhikr, dhikrs, fetchDhikrs])

  const updateDhikr = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editDhikr) return
    setIsLoading(true)
    try {
      await updateDoc(doc(db, 'dhikrs', editDhikr.id), {
        languageId: editDhikr.languageId,
        categoryId: editDhikr.categoryId,
        text: editDhikr.text,
        repetitions: editDhikr.repetitions
      })
      await fetchDhikrs()
      setEditDhikr(null)
      toast.success('تم تحديث الذكر بنجاح')
    } catch (error) {
      console.error('خطأ في تحديث الذكر:', error)
      toast.error('حدث خطأ أثناء تحديث الذكر')
    }
    setIsLoading(false)
  }, [editDhikr, fetchDhikrs])


  const deleteDhikr = useCallback(async (id: string) => {
    try {
      await deleteDoc(doc(db, 'dhikrs', id))
      await fetchDhikrs()
      toast.success('تم حذف الذكر بنجاح')
    } catch (error) {
      console.error('خطأ في حذف الذكر:', error)
      toast.error('حدث خطأ أثناء حذف الذكر')
    }
  }, [fetchDhikrs])

  const filteredDhikrs = dhikrs.filter(dhikr =>
    (selectedLanguage === 'all' || dhikr.languageId === selectedLanguage) &&
    (selectedCategory === 'all' || dhikr.categoryId === selectedCategory) &&
    dhikr.text.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const sortedAndFilteredDhikrs = filteredDhikrs
    .sort((a, b) => a.uniqueId - b.uniqueId)

  return (
    <div className="mt-2">
      <Card className="mb-2 font-light">
        <CardHeader>
          <CardTitle className="font-light text-3xl">إدارة الأذكار</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <Input
              placeholder="بحث في الأذكار"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger>
                <SelectValue placeholder="فرز حسب اللغة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع اللغات</SelectItem>
                {languages.map((lang) => (
                  <SelectItem key={lang.id} value={lang.id}>{lang.nameAr}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="فرز حسب التصنيف" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع التصنيفات</SelectItem>
                {categories.filter(cat => selectedLanguage === 'all' || cat.languageId === selectedLanguage).map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.nameAr}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full">إضافة ذكر جديد</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>إضافة ذكر جديد</DialogTitle>
                  <DialogDescription>أدخل تفاصيل الذكر الجديد هنا.</DialogDescription>
                </DialogHeader>
                <form onSubmit={addDhikr} className="space-y-4">
                  <div>
                    <Label htmlFor="dhikrLanguage">اللغة</Label>
                    <Select
                      value={newDhikr.languageId}
                      onValueChange={(value) => setNewDhikr({ ...newDhikr, languageId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر اللغة" />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem key={lang.id} value={lang.id}>{lang.nameAr}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="dhikrCategory">التصنيف</Label>
                    <Select
                      value={newDhikr.categoryId}
                      onValueChange={(value) => setNewDhikr({ ...newDhikr, categoryId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر التصنيف" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.filter(cat => cat.languageId === newDhikr.languageId).map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.nameAr}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="dhikrText">نص الذكر</Label>
                    <Textarea
                      id="dhikrText"
                      value={newDhikr.text}
                      onChange={(e) => setNewDhikr({ ...newDhikr, text: e.target.value })}
                      rows={textareaRows}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="dhikrRepetitions">عدد التكرارات</Label>
                    <Input
                      id="dhikrRepetitions"
                      type="number"
                      value={newDhikr.repetitions}
                      onChange={(e) => setNewDhikr({ ...newDhikr, repetitions: parseInt(e.target.value) })}
                      required
                      min="1"
                    />
                  </div>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    إضافة
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      <Card>
      <CardHeader>
        <CardTitle className='text-center font-light text-3xl'>قائمة الأذكار</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dhikrs.map((dhikr) => (
            <Card key={dhikr.id}>
              <CardContent className="p-4">
                <h3 className="font-light text-lg mb-2 text-center">{dhikr.uniqueId}</h3>
                <h3 className="text-sm mb-2">{dhikr.text}</h3>
                <div className='flex justify-center gap-4 text-lg'>
                  <p className="text-md text-gray-500 dark:text-gray-400">
                    التكرارات: {dhikr.repetitions}
                  </p>
                  <p className="text-md text-gray-500 dark:text-gray-400">
                    {categories.find(cat => cat.id === dhikr.categoryId)?.nameAr}
                  </p>
                  <p className="text-md text-gray-500 dark:text-gray-400 mb-4">
                    {languages.find(lang => lang.id === dhikr.languageId)?.nameAr}
                  </p>
                </div>
                <div className="space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" onClick={() => setEditDhikr(dhikr)}>تعديل</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>تعديل الذكر</DialogTitle>
                        <DialogDescription>قم بتعديل تفاصيل الذكر هنا.</DialogDescription>
                      </DialogHeader>
                      <form onSubmit={updateDhikr} className="space-y-4">
                        <div>
                          <Label htmlFor="editDhikrLanguage">اللغة</Label>
                          <Select
                            value={editDhikr?.languageId}
                            onValueChange={(value) => setEditDhikr(prev => prev ? { ...prev, languageId: value } : null)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="اختر اللغة" />
                            </SelectTrigger>
                            <SelectContent>
                              {languages.map((lang) => (
                                <SelectItem key={lang.id} value={lang.id}>{lang.nameAr}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="editDhikrCategory">التصنيف</Label>
                          <Select
                            value={editDhikr?.categoryId}
                            onValueChange={(value) => setEditDhikr(prev => prev ? { ...prev, categoryId: value } : null)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="اختر التصنيف" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.id}>{cat.nameAr}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="editDhikrText">نص الذكر</Label>
                          <Textarea
                            id="editDhikrText"
                            value={editDhikr?.text}
                            onChange={(e) => setEditDhikr(prev => prev ? { ...prev, text: e.target.value } : null)}
                            rows={4}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="editDhikrRepetitions">عدد التكرارات</Label>
                          <Input
                            id="editDhikrRepetitions"
                            type="number"
                            value={editDhikr?.repetitions}
                            onChange={(e) => setEditDhikr(prev => prev ? { ...prev, repetitions: Number(e.target.value) } : null)}
                            required
                            min="1"
                          />
                        </div>
                        <Button type="submit" disabled={isLoading}>
                          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                          تحديث
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                  <Button className="mr-2" variant="destructive" onClick={() => deleteDhikr(dhikr.id)}>حذف</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
    </div>
  )
}
                              
                