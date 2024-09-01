// app/categories/page.tsx
import CategoriesLogic from '@/components/user/CategoriesLogic';

export const metadata = {
  title: 'التصنيفات',
  description: 'استكشف مجموعة متنوعة من التصنيفات في مختلف اللغات',
};

export default function CategoriesPage() {
  return (
    <main className="container mx-auto px-4 py-8 mt-10">
      <h1 className="mb-8 text-center text-4xl font-light">التصنيفات</h1>
      <CategoriesLogic />
    </main>
  );
}