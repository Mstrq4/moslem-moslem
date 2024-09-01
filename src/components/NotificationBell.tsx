'use client'
import { useState, useEffect } from 'react'
import { Bell } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { db } from '@/lib/firebase'
import { collection, query, where, onSnapshot, Timestamp, orderBy, limit } from 'firebase/firestore'

interface Notification {
  id: string;
  type: 'message' | 'whatsapp' | 'social';
  content: string;
  createdAt: Timestamp;
  read: boolean;
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const q = query(
      collection(db, 'notifications'),
      where('read', '==', false),
      orderBy('createdAt', 'desc'),
      limit(5)
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newNotifications = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Notification[]
      
      setNotifications(newNotifications)
      setUnreadCount(newNotifications.length)
    })

    return () => unsubscribe()
  }, [])

  const handleNotificationClick = (notification: Notification) => {
    // Здесь вы можете добавить логику для обработки клика по уведомлению
    console.log('Clicked notification:', notification)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>الإشعارات</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <DropdownMenuItem>لا توجد إشعارات جديدة</DropdownMenuItem>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem key={notification.id} onClick={() => handleNotificationClick(notification)}>
              <div className="flex flex-col">
                <span className="font-medium">{notification.type === 'message' ? 'رسالة جديدة' : notification.type === 'whatsapp' ? 'رسالة واتساب' : 'إشعار وسائل التواصل'}</span>
                <span className="text-sm text-gray-500">{notification.content}</span>
              </div>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}