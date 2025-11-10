'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi, tipsApi, usersApi } from '@/lib/api';
import { TipCategory } from '@campus-companion/api-types';
import type { Tip } from '@campus-companion/api-types';

export default function TipsPage() {
  const router = useRouter();
  const [tips, setTips] = useState<Tip[]>([]);
  const [userCampus, setUserCampus] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const user = await usersApi.getMe();
        setUserCampus(user.campus);
        const data = await tipsApi.list(user.campus);
        setTips(data);
      } catch (err) {
        authApi.logout();
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [router]);

  const tipsByCategory = tips.reduce((acc, tip) => {
    if (!acc[tip.category]) {
      acc[tip.category] = [];
    }
    acc[tip.category].push(tip);
    return acc;
  }, {} as Record<TipCategory, Tip[]>);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link href="/dashboard" className="text-blue-600 hover:underline">
            ← Back to Dashboard
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Tips</h1>
        <p className="text-gray-600 mb-6">Campus: {userCampus}</p>

        {tips.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-gray-600">No tips available for your campus.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(tipsByCategory).map(([category, categoryTips]) => (
              <div key={category} className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">{category}</h2>
                <div className="space-y-4">
                  {categoryTips.map((tip) => (
                    <div key={tip.id} className="border-b pb-4 last:border-0">
                      <h3 className="text-lg font-semibold mb-2">{tip.title}</h3>
                      <p className="text-gray-600 whitespace-pre-line">{tip.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

