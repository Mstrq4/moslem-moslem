
'use client';

import { useState } from 'react';

export default function Home() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateResult, setUpdateResult] = useState<string | null>(null);

  const handleUpdate = async () => {
    setIsUpdating(true);
    setUpdateResult(null);

    try {
      const response = await fetch('/api/updateDhikrs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setUpdateResult(`تم التحديث بنجاح. عدد الأذكار المحدثة: ${result.updatedCount}`);
    } catch (error) {
      console.error('Error updating dhikrs:', error);
      setUpdateResult('حدث خطأ أثناء تحديث الأذكار');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className='flex h-screen w-full justify-center items-center'>
      <h1>تحديث الأذكار</h1>
      <button onClick={handleUpdate} disabled={isUpdating}>
        {isUpdating ? 'جاري التحديث...' : 'تحديث الأذكار'}
      </button>
      {updateResult && <p>{updateResult}</p>}
    </div>
  );
}