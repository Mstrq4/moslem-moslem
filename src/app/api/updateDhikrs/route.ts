// src/app/api/updateDhikrs/route.ts
import { NextResponse } from 'next/server';
import { collection, doc, setDoc, writeBatch } from 'firebase/firestore';
import { db } from '../../../lib/firebase'; // تأكد من تحديث هذا المسار ليتوافق مع هيكل مشروعك
import fs from 'fs';
import path from 'path';

type Dhikr = {
  categoryId: string;
  languageId: string;
  repetitions: number;
  text: string;
  uniqueId: string;
}

export async function POST() {
  try {
    console.log('بدء عملية تحديث الأذكار...');

    const jsonPath = path.join(process.cwd(), 'data', 'dhikrs.json');
    console.log('مسار ملف JSON:', jsonPath);

    const fileContents = fs.readFileSync(jsonPath, 'utf8');
    console.log('تم قراءة محتويات الملف بنجاح');

    const jsonData = JSON.parse(fileContents) as { dhikrs: Dhikr[] };
    console.log('تم تحليل JSON بنجاح، عدد الأذكار:', jsonData.dhikrs.length);

    const dhikrsCollectionRef = collection(db, 'dhikrs');

    const batchSize = 500;
    let updatedCount = 0;

    for (let i = 0; i < jsonData.dhikrs.length; i += batchSize) {
      const batch = writeBatch(db);
      const currentBatch = jsonData.dhikrs.slice(i, i + batchSize);

      currentBatch.forEach((dhikr) => {
        const dhikrDocRef = doc(dhikrsCollectionRef);
        batch.set(dhikrDocRef, dhikr);
      });

      await batch.commit();
      updatedCount += currentBatch.length;
      console.log(`تم تحديث الدفعة ${i / batchSize + 1}, إجمالي الأذكار المحدثة: ${updatedCount}`);
    }

    console.log('تم تحديث جميع الأذكار بنجاح');
    return NextResponse.json({ message: 'تم تحديث الأذكار بنجاح', updatedCount });
  } catch (error) {
    console.error('خطأ أثناء تحديث الأذكار:', error);
    return NextResponse.json(
      { 
        message: 'حدث خطأ أثناء تحديث الأذكار', 
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}