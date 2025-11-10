'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi, buddyApi, usersApi } from '@/lib/api';
import { BuddyOptInType } from '@campus-companion/api-types';
import type { BuddyMatch } from '@campus-companion/api-types';

export default function BuddyPage() {
  const router = useRouter();
  const [match, setMatch] = useState<BuddyMatch | null>(null);
  const [loading, setLoading] = useState(true);
  const [optingIn, setOptingIn] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const user = await usersApi.getMe();
        const matchData = await buddyApi.getMatch();
        setMatch(matchData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleOptIn = async () => {
    setOptingIn(true);
    try {
      await buddyApi.optIn({ type: BuddyOptInType.MENTEE });
      // Reload match
      const matchData = await buddyApi.getMatch();
      setMatch(matchData);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to opt in');
    } finally {
      setOptingIn(false);
    }
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
        <div className="container mx-auto px-4 py-4">
          <Link href="/dashboard" className="text-blue-600 hover:underline">
            ← Back to Dashboard
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-3xl font-bold mb-6">Buddy System</h1>

        {match ? (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Your Match</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Buddy:</h3>
                <p className="text-gray-600">{match.buddy?.name}</p>
                <p className="text-sm text-gray-500">{match.buddy?.email}</p>
                <p className="text-sm text-gray-500">
                  {match.buddy?.countryOrRegion} • {match.buddy?.campus}
                </p>
              </div>
              <div>
                <h3 className="font-semibold">Mentee:</h3>
                <p className="text-gray-600">{match.mentee?.name}</p>
                <p className="text-sm text-gray-500">{match.mentee?.email}</p>
                <p className="text-sm text-gray-500">
                  {match.mentee?.countryOrRegion} • {match.mentee?.campus}
                </p>
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-500">
                  Matched on: {new Date(match.createdAt).toLocaleDateString()}
                </p>
                {match.lastMeetingAt && (
                  <p className="text-sm text-gray-500">
                    Last meeting: {new Date(match.lastMeetingAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p className="text-gray-600 mb-4">You don't have a buddy match yet.</p>
            <button
              onClick={handleOptIn}
              disabled={optingIn}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {optingIn ? 'Opting in...' : 'Opt In to Buddy System'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

