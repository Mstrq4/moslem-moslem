'use client'

import { useState, useEffect, useCallback } from 'react'
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore'
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
  nameAr: string
}

interface Category {
  id: string
  languageId: string
  nameAr: string
}

interface PdfFile {
  id: string
  languageId: string
  categoryId: string
  name: string
  url: string
}

export default function ManagePdfFiles() {
  const [languages, setLanguages] = useState<Language[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [pdfFiles, setPdfFiles] = useState<PdfFile[]>([])
  const [selectedLanguage, setSelectedLanguage] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [newPdf, setNewPdf] = useState({ languageId: '', categoryId: '', name: '', file: null as File | null })
  const [isLoading, setIsLoading] = useState(false)

  const fetchLanguages = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'languages'))
      setLanguages(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Language)))
    } catch (error) {
      console.error('Error fetching languages:', error)
      toast.error('حدث خطأ أثناء جلب اللغات')
    }
  }, [])

  const fetchCategories = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'categories'))
      setCategories(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category)))
    } catch (error) {
      console.error('Error fetching categories:', error)
      toast.error('حدث خطأ أثناء جلب التصنيفات')
    }
  }, [])

  const fetchPdfFiles = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'pdfFiles'))
      setPdfFiles(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PdfFile)))
    } catch (error) {
      console.error('Error fetching PDF files:', error)
      toast.error('حدث خطأ أثناء جلب ملفات PDF')
    }
  }, [])

  useEffect(() => {
    fetchLanguages()
    fetchCategories()
    fetchPdfFiles()
  }, [fetchLanguages, fetchCategories, fetchPdfFiles])

  const addPdfFile = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      if (!newPdf.languageId || !newPdf.categoryId || !newPdf.name || !newPdf.file) {
        throw new Error('جميع الحقول مطلوبة')
      }

      const pdfRef = ref(storage, `pdfs/${Date.now()}_${newPdf.file.name}`)
      await uploadBytes(pdfRef, newPdf.file)
      const pdfUrl = await getDownloadURL(pdfRef)

      const docRef = await addDoc(collection(db, 'pdfFiles'), {
        languageId: newPdf.languageId,
        categoryId: newPdf.categoryId,
        name: newPdf.name,
        url: pdfUrl
      })

      console.log('تمت إضافة ملف PDF بنجاح مع المعرف:', docRef.id)

      setNewPdf({ languageId: '', categoryId: '', name: '', file: null })
      await fetchPdfFiles()
      toast.success('تمت إضافة ملف PDF بنجاح')
    } catch (error) {
      console.error('خطأ في إضافة ملف PDF:', error)
      toast.error(`حدث خطأ أثناء إضافة ملف PDF: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`)
    }
    setIsLoading(false)
  }, [newPdf, fetchPdfFiles])

  const deletePdfFile = useCallback(async (id: string) => {
    try {
      await deleteDoc(doc(db, 'pdfFiles', id))
      await fetchPdfFiles()
      toast.success('تم حذف ملف PDF بنجاح')
    } catch (error) {
      console.error('Error deleting PDF file:', error)
      toast.error('حدث خطأ أثناء حذف ملف PDF')
    }
  }, [fetchPdfFiles])

  const filteredPdfFiles = pdfFiles.filter(pdf =>
    (selectedLanguage === 'all' || pdf.languageId === selectedLanguage) &&
    (selectedCategory === 'all' || pdf.categoryId === selectedCategory)
  )

  return (
    <div className="mt-2">
      <Card className="mb-2">
        <CardHeader>
          <CardTitle>إدارة ملفات PDF</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-4">
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
                <Button className="w-full">إضافة ملف PDF جديد</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>إضافة ملف PDF جديد</DialogTitle>
                  <DialogDescription>أدخل تفاصيل ملف PDF الجديد هنا.</DialogDescription>
                </DialogHeader>
                <form onSubmit={addPdfFile} className="space-y-4">
                  <div>
                    <Label htmlFor="pdfLanguage">اللغة</Label>
                    <Select
                      value={newPdf.languageId}
                      onValueChange={(value) => setNewPdf({ ...newPdf, languageId: value })}
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
                    <Label htmlFor="pdfCategory">التصنيف</Label>
                    <Select
                      value={newPdf.categoryId}
                      onValueChange={(value) => setNewPdf({ ...newPdf, categoryId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر التصنيف" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.filter(cat => cat.languageId === newPdf.languageId).map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.nameAr}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="pdfName">اسم الملف</Label>
                    <Input
                      id="pdfName"
                      value={newPdf.name}
                      onChange={(e) => setNewPdf({ ...newPdf, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="pdfFile">ملف PDF</Label>
                    <Input
                      id="pdfFile"
                      type="file"
                      onChange={(e) => setNewPdf({ ...newPdf, file: e.target.files ? e.target.files[0] : null })}
                      accept="application/pdf"
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
          <CardTitle className='text-center'>قائمة ملفات PDF</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 text-center lg:grid-cols-6 gap-4">
            {filteredPdfFiles.map((pdf) => (
              <Card key={pdf.id}>
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg mb-2">{pdf.name}</h3>
                  <p className="text-me text-gray-600 dark:text-gray-400">
                    {categories.find(cat => cat.id === pdf.categoryId)?.nameAr}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {languages.find(lang => lang.id === pdf.languageId)?.nameAr}
                  </p>
                  <div className="mt-4 space-x-2">
                    <Button variant="outline" onClick={() => window.open(pdf.url, '_blank')}>عرض</Button>
                    <Button variant="destructive" onClick={() => deletePdfFile(pdf.id)}>حذف</Button>
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