import { Button } from "@/components/ui/button"
import { BackgroundGradient } from "@/components/ui/background-gradient"
import { TextGenerateEffect } from "@/components/ui/text-generate-effect"
import Link from 'next/link'
import { BackgroundBeams } from "@/components/ui/background-beams"

export default function About() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 text-center">
        <BackgroundBeams className="h-screen" />
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-12">
            <Link className="mb-8" href="/">
                    <img className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" src="/Azkar1.svg" alt="logo" />
                    <img className=" rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" src="/Azkar.svg" alt="logo" />
            </Link>
          <p className="text-3xl mt-10">
            مصدر شامل للأذكار الإسلامية بأكثر من 50 لغة
          </p>
        </div>
        
        <div className="space-y-10 text-center">
          <section>
            <h2 className="text-3xl font-light mb-4 text-center">رسالتنا</h2>
            <p className=" border text-2xl p-4 rounded-lg shadow-sm text-center">
              نسعى لتسهيل وصول المسلمين حول العالم إلى الأذكار اليومية بلغتهم الأم، وتعزيز صلة المسلم بربه وإبقائه دائم الذكر لله تعالى وفق كتابة الله وما صح من سنة نبيه صلى الله عليه وسلم.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-light mb-4 text-center">ما نقدمه</h2>
            <ul className="list-disc text-2xl text-center list-inside space-y-2 border p-4 rounded-lg shadow-sm">
              <p>أذكار الصباح والمساء</p>
              <p>أذكار النوم والاستيقاظ</p>
              <p>أدعية مأثورة للمناسبات المختلفة</p>
              <p>ترجمات دقيقة لأكثر من 50 لغة</p>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-light mb-4 text-center">رؤيتنا المستقبلية</h2>
            <div className=" border p-4 rounded-lg shadow-sm">
              <p className="mb-3 text-2xl text-center">
                نطمح لتوسيع نطاق خدماتنا لتشمل:
              </p>
              <ul className="list-disc text-2xl list-inside space-y-2 text-center text-nowrap">
                <p>تطبيق للأذكار متعدد اللغات للهواتف الذكية</p>
                <p>تطبيق للمصحف الشريف مع تفسير وترجمة</p>
                <p>منصة لحلقات تحفيظ القرآن الكريم عن بعد</p>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-light mb-4 text-center">دعمكم يهمنا</h2>
            <div className="border p-4 rounded-lg shadow-sm">
              <p className="mb-6 text-2xl">
                استمرارية هذا المشروع وتطويره يعتمد على دعمكم. كل مساهمة، - مهما كانت صغيرة - تساعدنا في الوصول إلى المزيد من المسلمين حول العالم.
              </p>
              <Link href="/contact" passHref>
                <Button className="w-full sm:w-auto ">ساهم في دعم المشروع</Button>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}