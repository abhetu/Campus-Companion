'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { authApi, eventsApi } from '@/lib/api';
import { EventRsvpStatus } from '@campus-companion/api-types';
import type { Event } from '@campus-companion/api-types';

export default function EventDetailPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.eventId as string;
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [rsvpStatus, setRsvpStatus] = useState<EventRsvpStatus | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const eventData = await eventsApi.get(eventId);
        setEvent(eventData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadEvent();
  }, [eventId]);

  const handleRsvp = async (status: EventRsvpStatus) => {
    setUpdating(true);
    try {
      await eventsApi.rsvp(eventId, { status });
      setRsvpStatus(status);
      // Reload event to get updated count
      const eventData = await eventsApi.get(eventId);
      setEvent(eventData);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update RSVP');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Event not found</div>
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

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
          <p className="text-gray-600 mb-6">{event.description}</p>

          <div className="space-y-2 mb-6">
            <p><strong>Start:</strong> {new Date(event.startTime).toLocaleString()}</p>
            <p><strong>End:</strong> {new Date(event.endTime).toLocaleString()}</p>
            <p><strong>Location:</strong> {event.locationText}</p>
            {event.capacity && (
              <p><strong>Capacity:</strong> {event.capacity} people</p>
            )}
            <p><strong>Attendees:</strong> {event.rsvpCount || 0}</p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => handleRsvp(EventRsvpStatus.GOING)}
              disabled={updating}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              Going
            </button>
            <button
              onClick={() => handleRsvp(EventRsvpStatus.INTERESTED)}
              disabled={updating}
              className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 disabled:opacity-50"
            >
              Interested
            </button>
            <button
              onClick={() => handleRsvp(EventRsvpStatus.NOT_GOING)}
              disabled={updating}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
            >
              Not Going
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

