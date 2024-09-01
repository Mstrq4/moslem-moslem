'use client'

import { useState, useEffect } from 'react'
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface Language {
  id: string
  code: string
  nameAr: string
  nameNative: string
}

export default function ManageLanguages() {
  const [languages, setLanguages] = useState<Language[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [newLanguage, setNewLanguage] = useState({ code: '', nameAr: '', nameNative: '' })
  const [editLanguage, setEditLanguage] = useState<Language | null>(null)

  useEffect(() => {
    fetchLanguages()
  }, [])

  const fetchLanguages = async () => {
    const querySnapshot = await getDocs(collection(db, 'languages'))
    setLanguages(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Language)))
  }

  const addLanguage = async (e: React.FormEvent) => {
    e.preventDefault()
    await addDoc(collection(db, 'languages'), newLanguage)
    setNewLanguage({ code: '', nameAr: '', nameNative: '' })
    fetchLanguages()
  }

  const updateLanguage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editLanguage) {
      await updateDoc(doc(db, 'languages', editLanguage.id), {
        code: editLanguage.code,
        nameAr: editLanguage.nameAr,
        nameNative: editLanguage.nameNative
      })
      setEditLanguage(null)
      fetchLanguages()
    }
  }

  const deleteLanguage = async (id: string) => {
    await deleteDoc(doc(db, 'languages', id))
    fetchLanguages()
  }

  const filteredLanguages = languages.filter(lang =>
    lang.nameAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lang.nameNative.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lang.code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="py-2">
      <Card>
        <CardHeader>
          <CardTitle>إدارة اللغات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <Input
              placeholder="بحث عن لغة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Dialog>
              <DialogTrigger asChild>
                <Button>إضافة لغة جديدة</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>إضافة لغة جديدة</DialogTitle>
                </DialogHeader>
                <form onSubmit={addLanguage} className="space-y-4 overflow-auto">
                  <div>
                    <Label htmlFor="code">رمز اللغة</Label>
                    <Input
                      id="code"
                      placeholder="مثال: ar"
                      value={newLanguage.code}
                      onChange={(e) => setNewLanguage({ ...newLanguage, code: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="nameAr">اسم اللغة بالعربية</Label>
                    <Input
                      id="nameAr"
                      placeholder="مثال: العربية"
                      value={newLanguage.nameAr}
                      onChange={(e) => setNewLanguage({ ...newLanguage, nameAr: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="nameNative">اسم اللغة بلغتها الأصلية</Label>
                    <Input
                      id="nameNative"
                      placeholder="مثال: Arabic"
                      value={newLanguage.nameNative}
                      onChange={(e) => setNewLanguage({ ...newLanguage, nameNative: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit">إضافة</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredLanguages.map((lang) => (
              <Card key={lang.id}>
                <CardContent className="flex justify-between items-center p-4">
                  <div>
                    <p className="font-bold">{lang.nameAr}</p>
                    <p>{lang.nameNative} ({lang.code})</p>
                  </div>
                  <div className="space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" onClick={() => setEditLanguage(lang)}>تعديل</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>تعديل اللغة</DialogTitle>
                        </DialogHeader>
                        {editLanguage && (
                          <form onSubmit={updateLanguage} className="space-y-4">
                            <div>
                              <Label htmlFor="editCode">رمز اللغة</Label>
                              <Input
                                id="editCode"
                                value={editLanguage.code}
                                onChange={(e) => setEditLanguage({ ...editLanguage, code: e.target.value })}
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="editNameAr">اسم اللغة بالعربية</Label>
                              <Input
                                id="editNameAr"
                                value={editLanguage.nameAr}
                                onChange={(e) => setEditLanguage({ ...editLanguage, nameAr: e.target.value })}
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="editNameNative">اسم اللغة بلغتها الأصلية</Label>
                              <Input
                                id="editNameNative"
                                value={editLanguage.nameNative}
                                onChange={(e) => setEditLanguage({ ...editLanguage, nameNative: e.target.value })}
                                required
                              />
                            </div>
                            <Button type="submit">حفظ التغييرات</Button>
                          </form>
                        )}
                      </DialogContent>
                    </Dialog>
                    <Button variant="destructive" onClick={() => deleteLanguage(lang.id)}>حذف</Button>
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