'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi, communitiesApi, usersApi } from '@/lib/api';
import type { Community } from '@campus-companion/api-types';

export default function CommunitiesPage() {
  const router = useRouter();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [userCampus, setUserCampus] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const user = await usersApi.getMe();
        setUserCampus(user.campus);
        const data = await communitiesApi.list(user.campus);
        setCommunities(data);
      } catch (err) {
        authApi.logout();
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [router]);

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
        <h1 className="text-3xl font-bold mb-6">Communities</h1>
        <p className="text-gray-600 mb-6">Campus: {userCampus}</p>

        {communities.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-gray-600">No communities found for your campus.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {communities.map((community) => (
              <Link
                key={community.id}
                href={`/communities/${community.id}`}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
              >
                <h2 className="text-xl font-semibold mb-2">{community.name}</h2>
                <p className="text-gray-600 mb-4 line-clamp-2">{community.description}</p>
                <p className="text-sm text-gray-500">
                  {community.memberCount || 0} members
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

