// components/CategoriesLogic.tsx
"use client";
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import CategoriesDisplay from './CategoriesDisplay';

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

async function getCategoriesAndLanguages(): Promise<{ categories: Category[], languages: Language[] }> {
  const categoriesSnapshot = await getDocs(collection(db, 'categories'));
  const languagesSnapshot = await getDocs(collection(db, 'languages'));

  const categories = categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
  const languages = languagesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Language));

  return { categories, languages };
}

export default function CategoriesLogic() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');

  useEffect(() => {
    async function fetchData() {
      try {
        const { categories, languages } = await getCategoriesAndLanguages();
        setCategories(categories);
        setLanguages(languages);
        
        const browserLang = navigator.language.split('-')[0];
        const defaultLang = languages.find(lang => lang.code === browserLang) || languages[0];
        if (defaultLang) {
          setSelectedLanguage(defaultLang.id);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  }, []);

  return (
    <CategoriesDisplay
      categories={categories}
      languages={languages}
      selectedLanguage={selectedLanguage}
      onLanguageChange={setSelectedLanguage}
    />
  );
}