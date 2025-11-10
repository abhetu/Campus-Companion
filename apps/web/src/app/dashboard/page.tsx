'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi, usersApi } from '@/lib/api';
import type { UserWithInterests } from '@campus-companion/api-types';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserWithInterests | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await usersApi.getMe();
        setUser(userData);
      } catch (err) {
        authApi.logout();
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [router]);

  const handleLogout = () => {
    authApi.logout();
    router.push('/');
  };

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
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Campus Companion</h1>
          <div className="flex gap-4 items-center">
            <span className="text-gray-600">Welcome, {user?.name}</span>
            <button
              onClick={handleLogout}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6">Dashboard</h2>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link
            href="/communities"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold mb-2">My Communities</h3>
            <p className="text-gray-600">View and join communities</p>
          </Link>
          <Link
            href="/buddy"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold mb-2">Buddy Status</h3>
            <p className="text-gray-600">Check your buddy match</p>
          </Link>
          <Link
            href="/tips"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold mb-2">Tips</h3>
            <p className="text-gray-600">Browse helpful tips</p>
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Profile</h3>
          <div className="space-y-2">
            <p><strong>Campus:</strong> {user?.campus}</p>
            <p><strong>Role:</strong> {user?.role}</p>
            <p><strong>Country/Region:</strong> {user?.countryOrRegion}</p>
            {user?.degreeLevel && (
              <p><strong>Degree Level:</strong> {user.degreeLevel}</p>
            )}
            {user?.interests && user.interests.length > 0 && (
              <div>
                <strong>Interests:</strong>{' '}
                <span className="text-gray-600">{user.interests.join(', ')}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

