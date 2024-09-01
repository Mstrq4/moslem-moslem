// components/CategoriesDisplay.tsx
import dynamic from 'next/dynamic';

const DynamicClientSideCategoriesDisplay = dynamic(
  () => import('./ClientSideCategoriesDisplay'),
  { ssr: false }
);

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

interface CategoriesDisplayProps {
  categories: Category[];
  languages: Language[];
  selectedLanguage: string;
  onLanguageChange: (value: string) => void;
}

export default function CategoriesDisplay({
  categories,
  languages,
  selectedLanguage,
  onLanguageChange
}: CategoriesDisplayProps) {
  return (
    <DynamicClientSideCategoriesDisplay
      categories={categories}
      languages={languages}
      selectedLanguage={selectedLanguage}
      onLanguageChange={onLanguageChange}
    />
  );
}