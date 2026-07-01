"use client";

import { useState, useEffect } from "react";
import { adminApi } from "@/lib/adminApi";
import { AdminEvent } from "@/types/admin";
import { Pin, TrendingUp, Search, Plus, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

export default function TrendingManagement() {
  const [loading, setLoading] = useState(true);
  const [pinnedEvents, setPinnedEvents] = useState<AdminEvent[]>([]);
  const [queue, setQueue] = useState<
    {
      eventId: string;
      title: string;
      score: number;
      velocity: string;
      category?: string;
      organizer?: string;
      thumbnail?: string;
    }[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");



  const fetchTrendingData = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getTrendingQueue();
      if (res.success) {
        setPinnedEvents(res.pinnedEvents);
        setQueue(res.organicQueue);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrendingData();
  }, []);

  const handleUnpin = async (eventId: string) => {
    try {
      const currentPinned = pinnedEvents.map((e) => e._id);
      const newPinned = currentPinned.filter((id) => id !== eventId);
      await adminApi.updateTrendingConfig({ pinnedEventIds: newPinned });
      await fetchTrendingData();
    } catch (e) {
      console.error(e);
    }
  };

  const handlePin = async (eventId: string) => {
    if (pinnedEvents.length >= 3) {
      alert("Hero Carousel is full. Please unpin an event first.");
      return;
    }
    try {
      const newPinned = [...pinnedEvents.map((e) => e._id), eventId];
      await adminApi.updateTrendingConfig({ pinnedEventIds: newPinned });
      await fetchTrendingData();
    } catch (e) {
      console.error(e);
    }
  };

  const movePinnedEvent = async (index: number, direction: "up" | "down") => {
    try {
      const newPinned = [...pinnedEvents.map((e) => e._id)];
      if (direction === "up" && index > 0) {
        [newPinned[index - 1], newPinned[index]] = [
          newPinned[index],
          newPinned[index - 1],
        ];
      } else if (direction === "down" && index < newPinned.length - 1) {
        [newPinned[index + 1], newPinned[index]] = [
          newPinned[index],
          newPinned[index + 1],
        ];
      } else {
        return;
      }
      await adminApi.updateTrendingConfig({ pinnedEventIds: newPinned });
      await fetchTrendingData();
    } catch (e) {
      console.error(e);
    }
  };

  const getVelocityBadge = (velocity: string) => {
    if (velocity.includes("Super Hot"))
      return "bg-red-50 text-red-700 ring-red-600/20";
    if (velocity.includes("Breakout"))
      return "bg-purple-50 text-purple-700 ring-purple-600/20";
    if (velocity.includes("Rising"))
      return "bg-orange-50 text-orange-700 ring-orange-600/20";
    return "bg-teal-50 text-teal-700 ring-teal-600/20"; // Steady
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:tracking-tight">
          Trending Management
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Override algorithmic homepage placement and monitor platform virality.
        </p>
      </div>

      {/* Manual Override Section */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">
            Homepage Hero Carousel
          </h3>
          <p className="text-sm text-gray-500">
            Pin up to 10 events to force them into the primary hero rotation.
          </p>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {Array.from({ length: 10 }).map((_, index) => {
            const event = pinnedEvents[index];

            if (event) {
              return (
                <div
                  key={event._id}
                  className="relative rounded-lg border border-gray-200 bg-white overflow-hidden flex flex-col h-64 shadow-sm group"
                >
                  <div className="absolute top-2 left-2 z-10 rounded-md bg-black/60 px-2 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                    Position {index + 1}
                  </div>
                  <div className="h-40 bg-gray-100 relative">
                    {event.bannerUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={event.bannerUrl}
                        alt="banner"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="p-3 flex-1 flex flex-col justify-between border-t border-gray-200">
                    <p className="font-medium text-gray-900 truncate">
                      {event.title}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => movePinnedEvent(index, "up")}
                        disabled={index === 0}
                        className="flex-1 rounded bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-600 hover:bg-gray-200 disabled:opacity-50 flex items-center justify-center"
                        title="Move Left"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleUnpin(event._id)}
                        className="flex-1 rounded bg-white px-2 py-1 text-xs font-semibold text-red-600 shadow-sm ring-1 ring-inset ring-red-300 hover:bg-red-50 flex items-center justify-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" /> Unpin
                      </button>
                      <button
                        onClick={() => movePinnedEvent(index, "down")}
                        disabled={index === pinnedEvents.length - 1}
                        className="flex-1 rounded bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-600 hover:bg-gray-200 disabled:opacity-50 flex items-center justify-center"
                        title="Move Right"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={`empty-${index}`}
                className="relative rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center h-64 text-center p-6"
              >
                <div className="rounded-full bg-white p-2 shadow-sm border border-gray-200 mb-3">
                  <Plus className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-900 mb-1">
                  Slot Available
                </p>
                <p className="text-xs text-gray-500 mb-4">
                  Pin an event from the queue below to feature it.
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Organic Queue Section */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Organic Trending Queue
            </h3>
            <p className="text-sm text-gray-500">
              Live algorithm rankings based on view velocity and engagement.
            </p>
          </div>
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-md border-0 py-2 pl-9 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-teal-600 sm:text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Velocity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-sm text-gray-500"
                  >
                    Loading algorithm data...
                  </td>
                </tr>
              ) : queue.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-sm text-gray-500"
                  >
                    Queue is empty.
                  </td>
                </tr>
              ) : (
                queue
                  .filter((q) =>
                    q.title.toLowerCase().includes(searchTerm.toLowerCase()),
                  )
                  .map((item, index) => (
                    <tr key={item.eventId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                        #{index + 1}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-900 truncate max-w-sm">
                          {item.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {item.organizer || "Independent"}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${getVelocityBadge(item.velocity)}`}
                        >
                          <TrendingUp className="w-3 h-3 mr-1" />{" "}
                          {item.velocity}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">
                        {item.score.toLocaleString(undefined, {
                          maximumFractionDigits: 1,
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handlePin(item.eventId)}
                          disabled={pinnedEvents.length >= 10}
                          className="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 gap-1.5 disabled:opacity-50"
                        >
                          <Pin className="h-4 w-4 text-gray-400" /> Pin
                        </button>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
