// components/LanguageCheck.tsx
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LanguageCheck({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const selectedLanguage = localStorage.getItem('selectedLanguage');
    if (!selectedLanguage) {
      router.push('/language-selection');
    }
  }, [router]);

  return <>{children}</>;
}