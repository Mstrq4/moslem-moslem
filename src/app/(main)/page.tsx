// pages/index.tsx

import { BackgroundBeams } from "@/components/ui/background-beams";
import CategoriesLogic from "@/components/user/CategoriesLogic";
import DailyDhikr from "@/components/user/DailyDhikr";
import Footer from "@/components/user/Footer";
import Hero from "@/components/user/Hero";
import PrayerTimes from "@/components/user/PrayerTimes";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
        {/* <BackgroundBeams /> */}
      <main className="flex-grow p-5">
        <Hero />
        <CategoriesLogic />
        <DailyDhikr />
        <PrayerTimes />
        {/* Add more sections here */}
      </main>
      
    </div>
  );
}