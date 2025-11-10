'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { authApi, communitiesApi, eventsApi } from '@/lib/api';
import type { Community, Event } from '@campus-companion/api-types';

export default function CommunityDetailPage() {
  const router = useRouter();
  const params = useParams();
  const communityId = params.communityId as string;
  const [community, setCommunity] = useState<Community | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [commData, eventsData] = await Promise.all([
          communitiesApi.get(communityId),
          eventsApi.listByCommunity(communityId),
        ]);
        setCommunity(commData);
        setEvents(eventsData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [communityId]);

  const handleJoin = async () => {
    setJoining(true);
    try {
      await communitiesApi.join(communityId);
      // Reload community data
      const commData = await communitiesApi.get(communityId);
      setCommunity(commData);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to join');
    } finally {
      setJoining(false);
    }
  };

  const handleLeave = async () => {
    try {
      await communitiesApi.leave(communityId);
      // Reload community data
      const commData = await communitiesApi.get(communityId);
      setCommunity(commData);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to leave');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!community) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Community not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link href="/communities" className="text-blue-600 hover:underline">
            ← Back to Communities
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h1 className="text-3xl font-bold mb-4">{community.name}</h1>
          <p className="text-gray-600 mb-4">{community.description}</p>
          <p className="text-sm text-gray-500 mb-4">
            {community.memberCount || 0} members
          </p>
          <div className="flex gap-4">
            <button
              onClick={handleJoin}
              disabled={joining}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {joining ? 'Joining...' : 'Join'}
            </button>
            <button
              onClick={handleLeave}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
            >
              Leave
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Events</h2>
          {events.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <p className="text-gray-600">No events scheduled.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <Link
                  key={event.id}
                  href={`/events/${event.id}`}
                  className="block bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
                >
                  <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                  <p className="text-gray-600 mb-2">{event.description}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(event.startTime).toLocaleString()} • {event.locationText}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

