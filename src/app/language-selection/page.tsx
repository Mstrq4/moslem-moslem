// app/language-selection/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Language {
  id: string;
  code: string;
  nameAr: string;
  nameNative: string;
}

export default function LanguageSelection() {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'languages'));
        const languagesList = querySnapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        } as Language));
        setLanguages(languagesList);
      } catch (error) {
        console.error("Error fetching languages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLanguages();
  }, []);

  const handleLanguageSelect = (languageId: string) => {
    localStorage.setItem('selectedLanguage', languageId);
    router.push('/');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen md:mt-7 bg-gradient-to-br flex items-center justify-center p-4">
      <Card className="w-full max-w-full shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-light text-gray-800 dark:text-white">اختر لغتك المفضلة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {languages.map((language) => (
              <Button
                key={language.id}
                onClick={() => handleLanguageSelect(language.id)}
                className="h-24 flex flex-col items-center justify-center text-center p-2 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 rounded-lg shadow"
              >
                <span className="text-lg text-gray-600 dark:text-gray-300">{language.nameNative}</span>
                <span className="text-sm font-semibold text-gray-800 dark:text-white">{language.nameAr}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}