// components/Hero.tsx
'use client'
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Button } from "@/components/ui/button";
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';
import { BackgroundBeams } from '@/components/ui/background-beams';
import Link from 'next/link';

const MotionDiv = dynamic(() => import('framer-motion').then((mod) => mod.motion.div), { ssr: false });
const MotionH1 = dynamic(() => import('framer-motion').then((mod) => mod.motion.h1), { ssr: false });

const Hero = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // أو عرض نسخة ثابتة من المكون
  }

  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden">
      <BackgroundBeams />
      <div className="relative z-10 text-center w-full grid">
        <div className='flex w-full'>
          <img className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" src="/Azkar1.svg" alt="logo" />
          <img className=" rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" src="/Azkar.svg" alt="logo" />
        </div>

        <TextGenerateEffect words="تم بعون الله ترجمة الاذكار إلى اكثر من 50 لغة " className="text-lg md:text-2xl mb-8 font-light" />
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className='gap-2 flex justify-center items-center'
        >
          <Link href="/about">
            <Button size="lg" className="mr-4">تحميل التطبيق</Button>
          </Link>
          <Link href="/contact">
            <Button size="lg" variant="outline">تواصل بنا</Button>
          </Link>
        </MotionDiv>
      </div>
    </div>
  );
};

export default Hero;