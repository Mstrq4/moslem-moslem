// app/layout.tsx
import { Metadata } from 'next';
import '../../styles/globals.css'; // تأكد من إنشاء هذا الملف وإضافة أي أنماط عامة تحتاجها
import Footer from '@/components/user/Footer';
import { Navbar } from '@/components/user/Navbar';
import { ThemeProvider } from 'next-themes';
import LanguageCheck from '@/components/LanguageCheck';

export const metadata: Metadata = {
  title: 'صحيح أذكار المسلم',
  description: 'تم بعون الله ترجمة ما تيسر من اذكار المسلم إلى اكثر من اربعين لغة ',
  keywords: 'أذكار الصباح والمساء أذكار النوم أذكار الصلاة',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html dir='rtl'>
      <body className="flex flex-col min-h-screen">
            <div className='px-2 py-8 w-full'>
            <LanguageCheck>
                <Navbar />
                        {children}
                <Footer />
            </LanguageCheck>
            </div>
      </body>
    </html>
  )
}