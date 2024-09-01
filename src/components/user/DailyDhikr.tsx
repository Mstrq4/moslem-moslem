// components/user/DailyDhikr.tsx
"use client";
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dhikr, getDailyDhikr } from '@/lib/getDailyDhikr';

const DailyDhikr = () => {
  const [dailyDhikr, setDailyDhikr] = useState<Dhikr | null>(null);
  const [defaultLanguage, setDefaultLanguage] = useState<string | null>(null);

  useEffect(() => {
    const fetchDefaultLanguage = () => {
      const savedLanguage = localStorage.getItem('selectedLanguage');
      setDefaultLanguage(savedLanguage || 'ar'); // استخدم 'ar' كلغة افتراضية إذا لم يتم العثور على لغة محفوظة
    };

    fetchDefaultLanguage();
  }, []);

  useEffect(() => {
    const fetchDailyDhikr = async () => {
      if (defaultLanguage) {
        const dhikr = await getDailyDhikr(defaultLanguage);
        setDailyDhikr(dhikr);
      }
    };

    if (defaultLanguage) {
      fetchDailyDhikr();
    }
  }, [defaultLanguage]);

  if (!dailyDhikr || !defaultLanguage) return null;

  return (
    <Card className="mt-8">
      <CardHeader>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-light">{dailyDhikr.text}</p>
      </CardContent>
    </Card>
  );
};

export default DailyDhikr;