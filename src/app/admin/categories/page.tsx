'use client'

import { useState, useEffect, useCallback } from 'react'
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '@/lib/firebase'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { toast } from 'sonner'

interface Language {
  id: string
  code: string
  nameAr: string
  nameNative: string
}

interface Category {
  id: string
  languageId: string
  nameAr: string
  nameNative: string
  imageUrl: string
}

export default function ManageCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [languages, setLanguages] = useState<Language[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('all')
  const [newCategory, setNewCategory] = useState({ languageId: '', nameAr: '', nameNative: '', image: null as File | null })
  const [editCategory, setEditCategory] = useState<Category | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const fetchCategories = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'categories'))
      setCategories(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category)))
    } catch (error) {
      console.error('Error fetching categories:', error)
      toast.error('حدث خطأ أثناء جلب التصنيفات')
    }
  }, [])

  const fetchLanguages = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'languages'))
      setLanguages(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Language)))
    } catch (error) {
      console.error('Error fetching languages:', error)
      toast.error('حدث خطأ أثناء جلب اللغات')
    }
  }, [])

  useEffect(() => {
    fetchCategories()
    fetchLanguages()
  }, [fetchCategories, fetchLanguages])

  const addCategory = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      if (!newCategory.languageId || !newCategory.nameAr || !newCategory.nameNative || !newCategory.image) {
        throw new Error('جميع الحقول مطلوبة')
      }

      let imageUrl = ''
      if (newCategory.image) {
        const imageRef = ref(storage, `categories/${Date.now()}_${newCategory.image.name}`)
        await uploadBytes(imageRef, newCategory.image)
        imageUrl = await getDownloadURL(imageRef)
      }

      const docRef = await addDoc(collection(db, 'categories'), {
        languageId: newCategory.languageId,
        nameAr: newCategory.nameAr,
        nameNative: newCategory.nameNative,
        imageUrl
      })

      console.log('تمت إضافة التصنيف بنجاح مع المعرف:', docRef.id)

      setNewCategory({ languageId: '', nameAr: '', nameNative: '', image: null })
      await fetchCategories()
      toast.success('تمت إضافة التصنيف بنجاح')
    } catch (error) {
      console.error('خطأ في إضافة التصنيف:', error)
      toast.error(`حدث خطأ أثناء إضافة التصنيف: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`)
    }
    setIsLoading(false)
  }, [newCategory, fetchCategories])

  const updateCategory = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (editCategory) {
      setIsLoading(true)
      try {
        let imageUrl = editCategory.imageUrl
        if (newCategory.image) {
          const imageRef = ref(storage, `categories/${Date.now()}_${newCategory.image.name}`)
          await uploadBytes(imageRef, newCategory.image)
          imageUrl = await getDownloadURL(imageRef)
        }
        await updateDoc(doc(db, 'categories', editCategory.id), {
          languageId: editCategory.languageId,
          nameAr: editCategory.nameAr,
          nameNative: editCategory.nameNative,
          imageUrl
        })
        setEditCategory(null)
        await fetchCategories()
        toast.success('تم تحديث التصنيف بنجاح')
      } catch (error) {
        console.error('Error updating category:', error)
        toast.error('حدث خطأ أثناء تحديث التصنيف')
      }
      setIsLoading(false)
    }
  }, [editCategory, newCategory.image, fetchCategories])

  const deleteCategory = useCallback(async (id: string) => {
    try {
      await deleteDoc(doc(db, 'categories', id))
      await fetchCategories()
      toast.success('تم حذف التصنيف بنجاح')
    } catch (error) {
      console.error('Error deleting category:', error)
      toast.error('حدث خطأ أثناء حذف التصنيف')
    }
  }, [fetchCategories])

  const filteredCategories = categories.filter(cat =>
    (cat.nameAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.nameNative.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedLanguage === 'all' || cat.languageId === selectedLanguage)
  )

  return (
    <div className="mt-2">
      <Card className="mb-2">
        <CardHeader>
          <CardTitle>البحث والفلترة وإضافة تصنيف جديد</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Input
              placeholder="بحث عن تصنيف..."
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
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full">إضافة تصنيف جديد</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>إضافة تصنيف جديد</DialogTitle>
                  <DialogDescription>أدخل تفاصيل التصنيف الجديد هنا.</DialogDescription>
                </DialogHeader>
                <form onSubmit={addCategory} className="space-y-4">
                  <div>
                    <Label htmlFor="language">اللغة</Label>
                    <Select
                      value={newCategory.languageId}
                      onValueChange={(value) => setNewCategory({ ...newCategory, languageId: value })}
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
                    <Label htmlFor="nameAr">اسم التصنيف بالعربية</Label>
                    <Input
                      id="nameAr"
                      value={newCategory.nameAr}
                      onChange={(e) => setNewCategory({ ...newCategory, nameAr: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="nameNative">اسم التصنيف باللغة الأصلية</Label>
                    <Input
                      id="nameNative"
                      value={newCategory.nameNative}
                      onChange={(e) => setNewCategory({ ...newCategory, nameNative: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="image">صورة التصنيف</Label>
                    <Input
                      id="image"
                      type="file"
                      onChange={(e) => setNewCategory({ ...newCategory, image: e.target.files ? e.target.files[0] : null })}
                      accept="image/*"
                      required
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
          <CardTitle className='text-center'>قائمة التصنيفات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredCategories.map((cat) => (
              <Card key={cat.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <img src={cat.imageUrl} alt={cat.nameAr} className="w-full h-40 object-cover" />
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2">{cat.nameAr}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{cat.nameNative}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">اللغة: {cat.languageId}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">التصنيف: {cat.id}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {languages.find(lang => lang.id === cat.languageId)?.nameAr}
                    </p>
                    <div className="mt-4 space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" onClick={() => setEditCategory(cat)}>تعديل</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>تعديل التصنيف</DialogTitle>
                          </DialogHeader>
                          {editCategory && (
                            <form onSubmit={updateCategory} className="space-y-4">
                              <div>
                                <Label htmlFor="editLanguage">اللغة</Label>
                                <Select
                                  value={editCategory.languageId}
                                  onValueChange={(value) => setEditCategory({ ...editCategory, languageId: value })}
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
                                <Label htmlFor="editNameAr">اسم التصنيف بالعربية</Label>
                                <Input
                                  id="editNameAr"
                                  value={editCategory.nameAr}
                                  onChange={(e) => setEditCategory({ ...editCategory, nameAr: e.target.value })}
                                  required
                                />
                              </div>
                              <div>
                                <Label htmlFor="editNameNative">اسم التصنيف باللغة الأصلية</Label>
                                <Input
                                  id="editNameNative"
                                  value={editCategory.nameNative}
                                  onChange={(e) => setEditCategory({ ...editCategory, nameNative: e.target.value })}
                                  required
                                />
                              </div>
                              <div>
                                <Label htmlFor="editImage">صورة التصنيف</Label>
                                <Input
                                  id="editImage"
                                  type="file"
                                  onChange={(e) => setNewCategory({ ...newCategory, image: e.target.files ? e.target.files[0] : null })}
                                  accept="image/*"
                                />
                              </div>
                              <Button type="submit" disabled={isLoading}>
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                تحديث
                              </Button>
                            </form>
                          )}
                        </DialogContent>
                      </Dialog>
                      <Button variant="destructive" onClick={() => deleteCategory(cat.id)}>حذف</Button>
                    </div>
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