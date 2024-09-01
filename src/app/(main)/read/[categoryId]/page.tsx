// app/read/[categoryId]/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from "@/components/ui/card";
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Category {
  id: string;
  languageId: string;
  nameAr: string;
}

interface Dhikr {
  id: string;
  languageId: string;
  categoryId: string;
  text: string;
  repetitions: number;
  uniqueId: number;
}

export default function ReadPage({ params, searchParams }: { 
  params: { categoryId: string }, 
  searchParams: { lang?: string }
}) {
  const [category, setCategory] = useState<Category | null>(null);
  const [dhikrs, setDhikrs] = useState<Dhikr[]>([]);
  const [translations, setTranslations] = useState<{[key: number]: string}>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const { categoryId } = params;
  const languageId = searchParams.lang || "AR";

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        console.log('Fetching data for category:', categoryId);
        
        // Fetch category
        const categoryQuery = query(collection(db, 'categories'), where('id', '==', categoryId));
        const categorySnapshot = await getDocs(categoryQuery);
        
        if (categorySnapshot.empty) {
          console.log('No matching category found');
          setError('Category not found');
          setLoading(false);
          return;
        }
        
        const categoryData = categorySnapshot.docs[0].data() as Category;
        console.log('Category data:', categoryData);
        setCategory(categoryData);

        // Fetch Arabic dhikrs
        const arabicDhikrsQuery = query(
          collection(db, 'dhikrs'),
          where('categoryId', '==', categoryId),
          where('languageId', '==', 'AR')
        );
        const arabicDhikrsSnapshot = await getDocs(arabicDhikrsQuery);
        const arabicDhikrs = arabicDhikrsSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Dhikr));
        console.log('Arabic dhikrs:', arabicDhikrs);
        setDhikrs(arabicDhikrs);

        // Fetch translations if needed
        if (languageId !== 'AR') {
          const translationsQuery = query(
            collection(db, 'dhikrs'),
            where('categoryId', '==', categoryId),
            where('languageId', '==', languageId)
          );
          const translationsSnapshot = await getDocs(translationsQuery);
          const translationsMap: {[key: number]: string} = {};
          translationsSnapshot.docs.forEach(doc => {
            const dhikr = doc.data() as Dhikr;
            translationsMap[dhikr.uniqueId] = dhikr.text;
          });
          console.log('Translations:', translationsMap);
          setTranslations(translationsMap);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('An error occurred while fetching data');
        setLoading(false);
      }
    }

    fetchData();
  }, [categoryId, languageId]);

  if (loading) {
    return <div className='mt-10'>Loading...</div>;
  }

  if (error) {
    return <div className='mt-10'>Error: {error}</div>;
  }

  if (!category || dhikrs.length === 0) {
    return <div className='mt-10'>No data available</div>;
  }

  return (
    <div className="container mx-auto p-4 min-h-screen mt-10">
      <h1 className="text-2xl font-bold mb-6 text-center">{category.nameAr}</h1>
      
      <div className="space-y-4">
        {dhikrs.map((dhikr) => (
          <Card key={dhikr.id}>
            <CardContent className="py-4 relative">
              <p className="my-4 text-2xl text-center leading-loose">{dhikr.text}</p>
              
              {translations[dhikr.uniqueId] && (
                <p className="text-center text-xl border-t-2 pt-4 text-gray-600">{translations[dhikr.uniqueId]}</p>
              )}
              
              <span className="absolute top-2 right-2 text-sm text-gray-500">
                {dhikr.repetitions > 1 ? `التكرار: ${dhikr.repetitions}` : ''}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}