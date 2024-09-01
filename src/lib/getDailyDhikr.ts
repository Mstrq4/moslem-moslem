// lib/getDailyDhikr.ts
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Dhikr {
  id: string;
  languageId: string;
  categoryId: string;
  text: string;
  repetitions: number;
  uniqueId: number;
}

export async function getDailyDhikr(languageId: string): Promise<Dhikr | null> {
  const dhikrsRef = collection(db, 'dhikrs');
  const q = query(dhikrsRef, where("languageId", "==", languageId));
  const querySnapshot = await getDocs(q);
  const dhikrs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Dhikr));
  
  if (dhikrs.length === 0) {
    return null;
  }
  
  const randomIndex = Math.floor(Math.random() * dhikrs.length);
  return dhikrs[randomIndex];
}