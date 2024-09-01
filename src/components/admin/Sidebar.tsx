// components/Sidebar.tsx
'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useTheme } from "next-themes"
import { 
  LayoutDashboard, 
  FileText, 
  FolderOpen, 
  Tags, 
  Globe, 
  Users, 
  Settings,
  Menu,
  X
} from 'lucide-react'
import { motion } from 'framer-motion'

const sidebarNavItems = [
  {
    title: "لوحة التحكم",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "الأذكار",
    href: "/admin/adhkar",
    icon: FileText,
  },
  {
    title: "الملفات",
    href: "/admin/files",
    icon: FolderOpen,
  },
  {
    title: "التصنيفات",
    href: "/admin/categories",
    icon: Tags,
  },
  {
    title: "اللغات",
    href: "/admin/languages",
    icon: Globe,
  },
  {
    title: "المستخدمين",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "الإعدادات",
    href: "/admin/settings",
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { setTheme, theme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  
  // Close sidebar when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <>
      <Button
        variant="outline"
        className="fixed top-4 right-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>
      <div className={cn(
        "fixed inset-y-0 right-0 z-40 w-64 border rounded-xl shadow-lg transform transition-transform duration-300 ease-in-out",
        "md:translate-x-0 md:static md:w-64",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <div className="px-3 py-4">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center"
            >
              <Link href="/">
                <img className="absolute rotate-90 w-[150px] md:w-[200px] scale-0 transition-all dark:rotate-0 dark:scale-100" src="/Azkar1.svg" alt="logo" />
                <img className="rotate-0 w-[150px] md:w-[200px] scale-100 transition-all dark:-rotate-90 dark:scale-0" src="/Azkar.svg" alt="logo" />
              </Link>
            </motion.div>
          </div>
          <ScrollArea className="flex-grow px-3 py-4">
            <nav className="space-y-1">
              {sidebarNavItems.map((item, index) => {
                const isActive = pathname === item.href
                return (
                  <Link key={index} href={item.href}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-between my-1 text-sm md:text-base",
                        isActive ? "bg-gray-700 text-white" : "hover:text-white hover:bg-gray-700"
                      )}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.title}</span>
                    </Button>
                  </Link>
                )
              })}
            </nav>
          </ScrollArea>
        </div>
      </div>
    </>
  )
}