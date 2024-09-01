// src/components/user/LatestCategories.tsx
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Category {
  id: string;
  languageId: string;
  nameAr: string;
  nameNative: string;
  imageUrl: string;
}

export default function LatestCategories() {
  const [latestCategories, setLatestCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatestCategories = async () => {
      try {
        setIsLoading(true);
        // Replace this URL with your actual API endpoint
        const response = await fetch('/api/latest-categories?limit=8');
        if (!response.ok) {
          throw new Error('Failed to fetch latest categories');
        }
        const data = await response.json();
        setLatestCategories(data);
      } catch (err) {
        setError('Failed to load latest categories');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestCategories();
  }, []);

  if (isLoading) {
    return <div className="text-center">جاري تحميل أحدث التصنيفات...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <section className="my-8">
      <h2 className="text-2xl font-bold mb-6 text-center">أحدث التصنيفات</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {latestCategories.map((category) => (
          <Link href={`/category/${category.id}`} key={category.id} className="group">
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 transform hover:scale-105">
              <div className="relative h-40">
                <Image
                  src={category.imageUrl}
                  alt={category.nameAr}
                  layout="fill"
                  objectFit="cover"
                  className="transition-opacity duration-300 group-hover:opacity-75"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{category.nameAr}</h3>
                <p className="text-sm text-gray-600">{category.nameNative}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}