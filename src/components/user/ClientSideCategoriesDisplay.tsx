// components/ClientSideCategoriesDisplay.tsx
"use client";

import { useEffect, useState, useRef } from 'react';
import { Card } from "@/components/ui/card";
import CategoryCard from '@/components/user/CategoryCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from '../use-toast';

interface Category {
  id: string;
  languageId: string;
  nameAr: string;
  nameNative: string;
  imageUrl: string;
}

interface Language {
  id: string;
  nameNative: string;
  code: string;
}

interface CategoriesDisplayProps {
  categories: Category[];
  languages: Language[];
  selectedLanguage: string;
  onLanguageChange: (value: string) => void;
}

export default function ClientSideCategoriesDisplay({
  categories,
  languages,
  selectedLanguage,
  onLanguageChange
}: CategoriesDisplayProps) {
  const [currentLanguage, setCurrentLanguage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
      onLanguageChange(savedLanguage);
    } else {
      if (languages.length > 0) {
        setCurrentLanguage(languages[0].id);
        onLanguageChange(languages[0].id);
      }
    }
  }, [languages, onLanguageChange]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const filteredCategories = currentLanguage
    ? categories.filter(category => category.languageId === currentLanguage)
    : categories;

  const handleLanguageChange = (value: string) => {
    setCurrentLanguage(value);
    onLanguageChange(value);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  const filteredLanguages = languages.filter(lang => 
    lang.nameNative.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const setDefaultLanguage = () => {
    setIsAlertOpen(true);
  };

  const confirmSetDefaultLanguage = () => {
    localStorage.setItem('selectedLanguage', currentLanguage);
    setIsAlertOpen(false);
    const selectedLanguageName = languages.find(lang => lang.id === currentLanguage)?.nameNative || currentLanguage;
    toast({
      title: "تم تغيير اللغة الافتراضية",
      description: `تم تعيين اللغة الافتراضية إلى ${selectedLanguageName}`,
      duration: 3000,
    });
  };

  return (
    <>
      <div className="mb-6 flex justify-center items-center space-x-4 gap-3">
        {languages.length > 0 ? (
          <>
            <Select 
              value={currentLanguage} 
              onValueChange={handleLanguageChange}
              open={isOpen}
              onOpenChange={(open) => {
                setIsOpen(open);
                if (open) {
                  setTimeout(() => inputRef.current?.focus(), 0);
                }
              }}
            >
              <SelectTrigger className="w-[280px]" onClick={() => setIsOpen(true)}>
                <SelectValue placeholder="اختر اللغة" />
              </SelectTrigger>
              <SelectContent>
                <div className="p-2">
                  <Input
                    ref={inputRef}
                    type="text"
                    placeholder="ابحث عن لغة"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="mb-2"
                    onKeyDown={(e) => {
                      e.stopPropagation();
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsOpen(true);
                    }}
                  />
                </div>
                <ScrollArea className="h-[200px] text-center">
                  {filteredLanguages.map((language) => (
                    <SelectItem key={language.id} value={language.id}>
                      {language.nameNative}
                    </SelectItem>
                  ))}
                </ScrollArea>
              </SelectContent>
            </Select>
            <Button onClick={setDefaultLanguage}>
              تعيين كلغة افتراضية
            </Button>
          </>
        ) : (
          <p>جاري تحميل اللغات...</p>
        )}
      </div>
      {filteredCategories.length === 0 ? (
        <p className="text-center text-xl">لم يتم العثور على تصنيفات.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredCategories.map((category) => (
            <Card key={category.id}>
              <CategoryCard
                id={category.id}
                nameAr={category.nameAr}
                nameNative={category.nameNative}
                imageUrl={category.imageUrl}
                languageId={currentLanguage}
              />
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className='text-center text-2xl'>تأكيد تعيين اللغة الافتراضية</AlertDialogTitle>
            <AlertDialogDescription className='text-center text-lg'>
              هل أنت متأكد أنك تريد تعيين {languages.find(lang => lang.id === currentLanguage)?.nameNative} كلغة افتراضية؟
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className='flex gap-3'>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSetDefaultLanguage}>تأكيد</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}