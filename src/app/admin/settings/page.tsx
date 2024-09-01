// pages/settings.tsx
'use client'

import { useSettings } from "../../../../contexts/SettingsContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"

export default function Settings() {
  const {
    primaryColor, setPrimaryColor,
    fontSize, setFontSize,
    isDarkMode, setIsDarkMode,
    language, setLanguage,
    fontFamily, setFontFamily,
    borderRadius, setBorderRadius,
    animationsEnabled, setAnimationsEnabled,
    sidebarPosition, setSidebarPosition,
    contentWidth, setContentWidth
  } = useSettings()

  return (
    <div className="py-2">
      <Card>
        <CardHeader>
          <CardTitle>إعدادات الموقع</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="primaryColor">اللون الرئيسي</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="primaryColor"
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-12 h-12 p-1"
              />
              <Input
                type="text"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="flex-grow"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="fontSize">حجم الخط</Label>
            <Slider
              id="fontSize"
              min={12}
              max={24}
              step={1}
              value={[parseInt(fontSize)]}
              onValueChange={(value) => setFontSize(value[0].toString())}
            />
            <span>{fontSize}px</span>
          </div>

          <div>
            <Label htmlFor="fontFamily">نوع الخط</Label>
            <Select value={fontFamily} onValueChange={setFontFamily}>
              <SelectTrigger id="fontFamily">
                <SelectValue placeholder="اختر نوع الخط" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Arial">Arial</SelectItem>
                <SelectItem value="Helvetica">Helvetica</SelectItem>
                <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                <SelectItem value="Courier New">Courier New</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="borderRadius">نصف قطر الحواف</Label>
            <Slider
              id="borderRadius"
              min={0}
              max={20}
              step={1}
              value={[parseInt(borderRadius)]}
              onValueChange={(value) => setBorderRadius(value[0].toString())}
            />
            <span>{borderRadius}px</span>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="darkMode"
              checked={isDarkMode}
              onCheckedChange={setIsDarkMode}
            />
            <Label htmlFor="darkMode">الوضع الليلي</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="animations"
              checked={animationsEnabled}
              onCheckedChange={setAnimationsEnabled}
            />
            <Label htmlFor="animations">تفعيل الرسوم المتحركة</Label>
          </div>

          <div>
            <Label htmlFor="language">اللغة</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger id="language">
                <SelectValue placeholder="اختر اللغة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ar">العربية</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="sidebarPosition">موقع الشريط الجانبي</Label>
            <Select value={sidebarPosition} onValueChange={setSidebarPosition}>
              <SelectTrigger id="sidebarPosition">
                <SelectValue placeholder="اختر موقع الشريط الجانبي" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="right">يمين</SelectItem>
                <SelectItem value="left">يسار</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="contentWidth">عرض المحتوى</Label>
            <Select value={contentWidth} onValueChange={setContentWidth}>
              <SelectTrigger id="contentWidth">
                <SelectValue placeholder="اختر عرض المحتوى" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="limited">محدود</SelectItem>
                <SelectItem value="full">كامل</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={() => alert('تم حفظ الإعدادات')}>حفظ الإعدادات</Button>
        </CardContent>
      </Card>
    </div>
  )
}