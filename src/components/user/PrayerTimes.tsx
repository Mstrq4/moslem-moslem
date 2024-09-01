"use client";
import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaSun, FaMoon, FaCloudSun, FaCloudMoon, FaStar, FaMapMarkerAlt, FaClock, FaCalendarAlt } from 'react-icons/fa';
import moment from 'moment-hijri';

interface PrayerTime {
  [key: string]: string;
}

const PrayerTimes = () => {
  const [address, setAddress] = useState('');
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoLocated, setAutoLocated] = useState(false);
  const [locationName, setLocationName] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [hijriDate, setHijriDate] = useState('');
  const [nextPrayer, setNextPrayer] = useState({ name: '', time: '', remaining: '' });

  const formatTime = useCallback((timeString: string) => {
    const [time] = timeString.split(' ');
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('ar-SA', { hour: 'numeric', minute: '2-digit', hour12: true });
  }, []);

  const updateCurrentTime = useCallback(() => {
    const now = new Date();
    setCurrentTime(
      now.toLocaleTimeString('ar-SA', { 
        hour: 'numeric', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: true 
      })
    );
  }, []);

  const updateCurrentDate = useCallback(() => {
    const now = new Date();
    const gregorianDate = now.toLocaleDateString('ar-SA', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    setCurrentDate(gregorianDate);

    const hijri = moment(now).format('iYYYY/iM/iD');
    const hijriFormatted = moment(now).format('iDD iMMMM iYYYY');
    setHijriDate(`${hijriFormatted} هـ`);
  }, []);

  const updateNextPrayer = useCallback(() => {
    if (!prayerTimes) return;

    const now = new Date();
    const prayers = [
      { name: 'الفجر', time: prayerTimes.Fajr },
      { name: 'الشروق', time: prayerTimes.Sunrise },
      { name: 'الظهر', time: prayerTimes.Dhuhr },
      { name: 'العصر', time: prayerTimes.Asr },
      { name: 'المغرب', time: prayerTimes.Maghrib },
      { name: 'العشاء', time: prayerTimes.Isha },
    ];

    for (let prayer of prayers) {
      const prayerTime = new Date(now.toDateString() + ' ' + prayer.time);
      if (prayerTime > now) {
        const diff = prayerTime.getTime() - now.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setNextPrayer({
          name: prayer.name,
          time: formatTime(prayer.time),
          remaining: `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        });
        break;
      }
    }
  }, [prayerTimes, formatTime]);

  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    updateCurrentDate();
    const timer = setInterval(() => {
      updateCurrentTime();
      updateCurrentDate();
    }, 1000);
    return () => clearInterval(timer);
  }, [updateCurrentTime, updateCurrentDate]);

  useEffect(() => {
    if (prayerTimes) {
      const timer = setInterval(() => {
        updateNextPrayer();
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [prayerTimes, updateNextPrayer]);

  const getLocation = () => {
    if ("geolocation" in navigator) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          fetchPrayerTimes(`${latitude},${longitude}`);
          fetchLocationName(latitude, longitude);
          setAutoLocated(true);
        },
        error => {
          console.error("Error getting location:", error);
          setError("لم نتمكن من تحديد موقعك تلقائيًا. يرجى إدخال العنوان يدويًا.");
          setLoading(false);
        }
      );
    } else {
      setError("متصفحك لا يدعم تحديد الموقع. يرجى إدخال العنوان يدويًا.");
    }
  };

  const fetchLocationName = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
      const data = await response.json();
      setLocationName(data.display_name);
    } catch (error) {
      console.error("Error fetching location name:", error);
      setLocationName("موقع غير معروف");
    }
  };

  const fetchPrayerTimes = async (location: string) => {
    setLoading(true);
    setError(null);

    try {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      
      const response = await fetch(`http://api.aladhan.com/v1/calendar/${year}/${month}?latitude=${location.split(',')[0]}&longitude=${location.split(',')[1]}&method=2`);
      const data = await response.json();

      if (data.code === 200 && data.data.length > 0) {
        const today = currentDate.getDate() - 1;
        const timings = data.data[today].timings;
        const formattedTimings: PrayerTime = {};
        for (const [key, value] of Object.entries(timings)) {
          formattedTimings[key] = formatTime(value as string);
        }
        setPrayerTimes(formattedTimings);
      } else {
        setError('لم يتم العثور على مواقيت الصلاة للموقع المحدد');
      }
    } catch (err) {
      setError('حدث خطأ أثناء جلب مواقيت الصلاة');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (address) {
      fetchPrayerTimes(address);
    }
  };

  const PrayerTimeItem = ({ name, time, icon }: { name: string, time: string, icon: React.ReactNode }) => (
    <div className="flex items-center justify-between p-3 bg-secondary rounded-lg mb-2">
      <span className="text-lg font-light">{time}</span>
      <div className="flex items-center">
        <span className="font-light ml-2">{name}</span>
        <span className="text-2xl mr-2 text-primary">{icon}</span>
      </div>
    </div>
  );

  return (
    <Card className="mt-8 min-w-[60%] mx-auto">
      <CardHeader>
        <CardTitle className="text-3xl font-light text-center">مواقيت الصلوات لليوم</CardTitle>
      </CardHeader>
      <CardContent>
        {!autoLocated && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="أدخل العنوان (مثال: Sultanahmet Mosque, Istanbul, Turkey)"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="w-full"
            />
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'جاري البحث...' : 'عرض مواقيت الصلاة'}
            </Button>
          </form>
        )}

        {autoLocated && (
          <div className="text-center mb-4">
            <FaMapMarkerAlt className="inline-block ml-2 text-primary" />
            <span>{locationName}</span>
          </div>
        )}

        {currentDate && hijriDate && (
          <div className="text-center mb-4">
            <FaCalendarAlt className="inline-block ml-2 text-primary" />
            <span className="text-lg font-light">{currentDate}</span>
            <br />
            {/* <span className="text-lg font-light">{hijriDate}</span> */}
          </div>
        )}

        {currentTime && (
          <div className="text-center mb-4">
            <FaClock className="inline-block ml-2 text-primary" />
            <span className="text-lg font-light">{currentTime}</span>
          </div>
        )}        
        {error && <p className="text-destructive mt-4 text-center">{error}</p>}

        {prayerTimes && (
          <div className="mt-6">
            <PrayerTimeItem name="الفجر" time={prayerTimes.Fajr} icon={<FaCloudMoon />} />
            <PrayerTimeItem name="الشروق" time={prayerTimes.Sunrise} icon={<FaSun />} />
            <PrayerTimeItem name="الظهر" time={prayerTimes.Dhuhr} icon={<FaSun />} />
            <PrayerTimeItem name="العصر" time={prayerTimes.Asr} icon={<FaCloudSun />} />
            <PrayerTimeItem name="المغرب" time={prayerTimes.Maghrib} icon={<FaMoon />} />
            <PrayerTimeItem name="العشاء" time={prayerTimes.Isha} icon={<FaStar />} />
          </div>
        )}
        
        {nextPrayer.name && (
          <div className="mt-4 text-center">
            <p className="text-lg font-light">الصلاة القادمة: {nextPrayer.name} في {nextPrayer.time}</p>
            <p className="text-lg font-light">الوقت المتبقي: {nextPrayer.remaining}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PrayerTimes;