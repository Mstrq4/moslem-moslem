// components/Navbar.tsx
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Sun, Moon, Info, Phone, Globe, Tags } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useTheme } from "next-themes"
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';

interface Language {
  id: number;
  name: string;
  code: string;
}

export function Navbar() {
  const pathname = usePathname();
//   const t = useTranslations('Navbar');

  const navItems = [
    { name:'الرئيسية' , href: '/', icon: Home },
    { name:'التصنيفات' , href: '/categories', icon: Tags },
    { name:'حول' , href: '/about', icon: Info },
    { name:'اتصل بنا ' , href: '/contact', icon: Phone },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 hidden md:flex justify-center items-center p-4 bg-background/30 backdrop-blur-md shadow-md z-50">
        <div className="flex space-x-4">
          {navItems.map((item) => (
            <Link 
              key={item.href}
              href={item.href}
              className={`px-3 py-2 text-xl font-light rounded-full transition-colors hover:bg-background/50 ${
                pathname === item.href ? 'bg-background/50 text-primary' : 'text-foreground'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </nav>

      <nav className="md:hidden fixed bottom-0 right-0 left-0 flex justify-around items-center p-4 bg-background/80 backdrop-blur-md shadow-lg z-50">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`transition-colors hover:text-primary ${
              pathname === item.href 
                ? 'text-primary bg-primary/20 p-2 rounded-full' 
                : 'text-foreground p-2'
            }`}
          >
            <item.icon className="h-6 w-6" />
          </Link>
        ))}
      </nav>

      <div className="fixed top-4 left-4 z-50">
        {/* <LanguageToggle /> */}
      </div>
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
    </>
  );
}

// ThemeToggle component
export function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="rounded-full bg-background/30 backdrop-blur-md"
    >
      <Sun className="h-[1rem] w-[1rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1rem] w-[1rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">تبديل السمة</span>
    </Button>
  )
}

// LanguageToggle component
function LanguageToggle() {
  const [languages, setLanguages] = useState<Language[]>([]);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    fetch('/locales/languages.json')
      .then(response => response.json())
      .then(data => setLanguages(data));
  }, []);

  const changeLanguage = (langCode: string) => {
    const segments = pathname.split('/');
    segments[1] = langCode.toLowerCase();
    const newPath = segments.join('/');
    router.push(newPath);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full bg-background/30 backdrop-blur-md">
          <Globe className="h-[1rem] w-[1rem]" />
          <span className="sr-only">تغيير اللغة</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className='max-h-[200px] overflow-y-auto'>
        {languages.map((lang) => (
          <DropdownMenuItem key={lang.id} onSelect={() => changeLanguage(lang.code)}>
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}