'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { LucideLoader2 } from 'lucide-react';

interface Dhikr {
  id: string;
  languageId: string;
  categoryId: string;
  text: string;
  repetitions: number;
  uniqueId: number;
}

interface Category {
  id: string;
  languageId: string;
  nameAr: string;
  nameNative: string;
  imageUrl: string;
}

const ARABIC_LANGUAGE_ID = 'WZOLVA9ASdFtfUKHCPJu';

export default function CategoryPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const categoryId = params.id as string;
  const languageId = searchParams.get('languageId') || ARABIC_LANGUAGE_ID;
  const [category, setCategory] = useState<Category | null>(null);
  const [dhikrs, setDhikrs] = useState<{ [key: string]: Dhikr[] }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (categoryId) {
        setLoading(true);
        setError(null);
        try {
          console.log(`جاري جلب البيانات للفئة بالمعرف: ${categoryId}, واللغة: ${languageId}`);

          const categoryDocRef = doc(db, 'categories', categoryId);
          const categorySnapshot = await getDoc(categoryDocRef);

          if (!categorySnapshot.exists()) {
            console.error('لم يتم العثور على التصنيف');
            setError('لم يتم العثور على هذا التصنيف');
            setLoading(false);
            return;
          }

          const categoryData = categorySnapshot.data() as Category;
          categoryData.id = categorySnapshot.id;
          setCategory(categoryData);
          console.log('تم العثور على التصنيف:', categoryData);

          const arabicCategoryQuery = query(
            collection(db, 'categories'),
            where('nameAr', '==', categoryData.nameAr),
            where('languageId', '==', ARABIC_LANGUAGE_ID)
          );
          const arabicCategorySnapshot = await getDocs(arabicCategoryQuery);
          let arabicCategoryId = '';
          if (!arabicCategorySnapshot.empty) {
            arabicCategoryId = arabicCategorySnapshot.docs[0].id;
          }

          let dhikrsData: { [key: string]: Dhikr[] } = {};

          if (arabicCategoryId) {
            const arabicDhikrQuery = query(
              collection(db, 'dhikrs'),
              where('categoryId', '==', arabicCategoryId)
            );
            const arabicDhikrSnapshot = await getDocs(arabicDhikrQuery);
            const arabicDhikrsData = arabicDhikrSnapshot.docs.map(d => ({ id: d.id, ...d.data() } as Dhikr));
            console.log('تم العثور على الأذكار العربية:', arabicDhikrsData);
            dhikrsData[ARABIC_LANGUAGE_ID] = arabicDhikrsData;
          }

          const dhikrQuery = query(
            collection(db, 'dhikrs'),
            where('categoryId', '==', categoryId)
          );
          const dhikrSnapshot = await getDocs(dhikrQuery);
          const otherLangDhikrsData = dhikrSnapshot.docs.map(d => ({ id: d.id, ...d.data() } as Dhikr));
          console.log(`تم العثور على الأذكار باللغة ${languageId}:`, otherLangDhikrsData);
          dhikrsData[languageId] = otherLangDhikrsData;

          for (const langId in dhikrsData) {
            dhikrsData[langId].sort((a, b) => a.uniqueId - b.uniqueId);
          }

          setDhikrs(dhikrsData);
          console.log('تم تعيين الأذكار:', dhikrsData);

          if (Object.values(dhikrsData).every(arr => arr.length === 0)) {
            setError('لم يتم العثور على أذكار لهذا التصنيف');
          }
        } catch (error) {
          console.error("خطأ في جلب البيانات:", error);
          setError('حدث خطأ أثناء جلب البيانات');
        } finally {
          setLoading(false);
        }
      }
    }

    fetchData();
  }, [categoryId, languageId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LucideLoader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !category) {
    return <p className="text-center text-xl text-red-500">{error || 'حدث خطأ غير متوقع'}</p>;
  }

  const splitIntoParagraphs = (text: string) => {
    const paragraphs = text.split('\n\n');
    return paragraphs.length > 1 ? paragraphs : [text, ''];
  };
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-light my-3 text-center">{category.nameNative}</h1>
      <div className="text-center mb-4">
        {/* <Button onClick={generatePDF}>تحميل كملف PDF</Button> */}
      </div>
      <div className="grid gap-6">
        {dhikrs[ARABIC_LANGUAGE_ID]?.map((arabicDhikr, index) => (
          <div key={arabicDhikr.id} className="grid gap-3 my-2">
            <div className="border shadow-md rounded-lg p-6">
              <h3 className="text-2xl mb-2 font-light">{arabicDhikr.text}</h3>
              <p className="text-lg">عدد التكرارات: {arabicDhikr.repetitions || 'غير محدد'}</p>
            </div>
            {languageId !== ARABIC_LANGUAGE_ID && dhikrs[languageId]?.[index] && (
              <div className="border shadow-md rounded-lg p-6">
                {splitIntoParagraphs(dhikrs[languageId][index].text).map((paragraph, pIndex) => (
                  <p 
                    key={pIndex}
                    dir='ltr' 
                    className="text-2xl mb-2 font-light whitespace-pre-wrap"
                    style={{ marginBottom: pIndex === 0 ? '1rem' : '0' }}
                  >
                    {paragraph}
                  </p>
                ))}
                <p className="text-lg">عدد التكرارات: {dhikrs[languageId][index].repetitions || 'غير محدد'}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}