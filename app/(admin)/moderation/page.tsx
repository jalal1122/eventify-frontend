"use client";

import { useState, useEffect } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import {
  Search,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  MoreVertical,
} from "lucide-react";
import { adminApi } from "@/lib/adminApi";
import { AdminEvent, AdminOrganizerProfile, AdminUser } from "@/types/admin";
import { ReviewEventModal } from "@/components/admin/modals/ReviewEventModal";
import { ReviewOrganizerModal } from "@/components/admin/modals/ReviewOrganizerModal";

export default function ModerationHub() {
  const [activeTab, setActiveTab] = useState("events");

  // State for Events
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<AdminEvent | null>(null);

  // State for Organizers
  const [organizers, setOrganizers] = useState<AdminOrganizerProfile[]>([]);
  const [loadingOrganizers, setLoadingOrganizers] = useState(true);
  const [selectedOrganizer, setSelectedOrganizer] =
    useState<AdminOrganizerProfile | null>(null);

  // State for CRM
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [crmSearch, setCrmSearch] = useState("");
  const [crmRoleFilter, setCrmRoleFilter] = useState("all");

  const fetchEvents = async () => {
    setLoadingEvents(true);
    try {
      const res = await adminApi.getPendingEvents();
      if (res.success) setEvents(res.events);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingEvents(false);
    }
  };

  const fetchOrganizers = async () => {
    setLoadingOrganizers(true);
    try {
      const res = await adminApi.getPendingOrganizers();
      if (res.success) setOrganizers(res.organizers);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingOrganizers(false);
    }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await adminApi.getUsers({
        search: crmSearch,
        role: crmRoleFilter,
      });
      if (res.success) setUsers(res.users);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (activeTab === "events") fetchEvents();
    if (activeTab === "organizers") fetchOrganizers();
    if (activeTab === "users") fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, crmSearch, crmRoleFilter]);

  const handleReviewEvent = async (
    eventId: string,
    decision: "approved" | "rejected",
    reason?: string,
  ) => {
    await adminApi.reviewEvent(eventId, decision, reason);
    await fetchEvents();
  };

  const handleReviewOrganizer = async (
    profileId: string,
    decision: "approved" | "rejected",
    reason?: string,
  ) => {
    await adminApi.reviewOrganizer(profileId, decision, reason);
    await fetchOrganizers();
  };

  const handleToggleBan = async (userId: string, currentStatus: boolean) => {
    try {
      await adminApi.banUser(userId, !currentStatus);
      await fetchUsers(); // refresh
    } catch (e) {
      console.error(e);
    }
  };

  const handleRoleChange = async (userId: string, role: string) => {
    try {
      await adminApi.updateUserRole(userId, role);
      await fetchUsers();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:tracking-tight">
          Moderation Hub
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Review pending organizers, approve new events, and manage the user
          directory.
        </p>
      </div>

      <Tabs.Root
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex flex-col w-full"
      >
        <Tabs.List
          className="flex shrink-0 border-b border-gray-200"
          aria-label="Moderation Tabs"
        >
          <Tabs.Trigger
            value="events"
            className="px-5 h-[45px] flex items-center justify-center text-sm leading-none text-gray-500 select-none hover:text-gray-700 data-[state=active]:text-teal-600 data-[state=active]:shadow-[inset_0_-2px_0_0,0_1px_0_0] data-[state=active]:shadow-current outline-none cursor-pointer font-medium"
          >
            Event Approvals
          </Tabs.Trigger>
          <Tabs.Trigger
            value="organizers"
            className="px-5 h-[45px] flex items-center justify-center text-sm leading-none text-gray-500 select-none hover:text-gray-700 data-[state=active]:text-teal-600 data-[state=active]:shadow-[inset_0_-2px_0_0,0_1px_0_0] data-[state=active]:shadow-current outline-none cursor-pointer font-medium"
          >
            New Organizers
          </Tabs.Trigger>
          <Tabs.Trigger
            value="users"
            className="px-5 h-[45px] flex items-center justify-center text-sm leading-none text-gray-500 select-none hover:text-gray-700 data-[state=active]:text-teal-600 data-[state=active]:shadow-[inset_0_-2px_0_0,0_1px_0_0] data-[state=active]:shadow-current outline-none cursor-pointer font-medium"
          >
            User CRM Directory
          </Tabs.Trigger>
        </Tabs.List>

        <div className="mt-6">
          {/* TAB: EVENT APPROVALS */}
          <Tabs.Content value="events" className="outline-none">
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h3 className="font-semibold text-gray-900">
                  Events Awaiting Review
                </h3>
              </div>
              <div className="divide-y divide-gray-100">
                {loadingEvents ? (
                  <div className="p-8 text-center text-gray-500">
                    Loading...
                  </div>
                ) : events.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    No events pending approval.
                  </div>
                ) : (
                  events.map((event) => (
                    <div
                      key={event._id}
                      className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        {event.bannerUrl ? (
                          <div className="w-16 h-16 rounded bg-gray-200 flex-shrink-0 overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={event.bannerUrl}
                              alt="banner"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded bg-gray-100 flex-shrink-0 flex items-center justify-center border border-dashed border-gray-300">
                            <span className="text-xs text-gray-400">
                              No Img
                            </span>
                          </div>
                        )}
                        <div>
                          <h4 className="text-base font-medium text-gray-900">
                            {event.title}
                          </h4>
                          <p className="text-sm text-gray-500 mt-1">
                            By{" "}
                            {event.organizerProfileId?.brandName || "Unknown"}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Submitted:{" "}
                            {new Date(event.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedEvent(event)}
                        className="rounded-md bg-white px-3.5 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                      >
                        Review
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </Tabs.Content>

          {/* TAB: NEW ORGANIZERS */}
          <Tabs.Content value="organizers" className="outline-none">
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h3 className="font-semibold text-gray-900">
                  Organizer Profiles Awaiting Verification
                </h3>
              </div>
              <div className="divide-y divide-gray-100">
                {loadingOrganizers ? (
                  <div className="p-8 text-center text-gray-500">
                    Loading...
                  </div>
                ) : organizers.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    No organizers pending verification.
                  </div>
                ) : (
                  organizers.map((org) => (
                    <div
                      key={org._id}
                      className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <div>
                        <h4 className="text-base font-medium text-gray-900">
                          {org.brandName}
                        </h4>
                        <div className="flex gap-4 mt-1">
                          <p className="text-sm text-gray-500">
                            Owner: {org.ownerId?.name || "N/A"}
                          </p>
                          <p className="text-sm text-gray-500">
                            City: {org.ownerId?.city || "N/A"}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedOrganizer(org)}
                        className="rounded-md bg-white px-3.5 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                      >
                        Review
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </Tabs.Content>

          {/* TAB: USER CRM */}
          <Tabs.Content value="users" className="outline-none">
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col">
              {/* Toolbar */}
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={crmSearch}
                    onChange={(e) => setCrmSearch(e.target.value)}
                    className="w-full rounded-md border-0 py-2 pl-9 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">
                    Role:
                  </span>
                  <select
                    value={crmRoleFilter}
                    onChange={(e) => setCrmRoleFilter(e.target.value)}
                    className="rounded-md border-0 py-2 pl-3 pr-8 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-teal-600 sm:text-sm"
                  >
                    <option value="all">All Roles</option>
                    <option value="attendee">Attendee</option>
                    <option value="organizer">Organizer</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        User
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Role
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Joined
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loadingUsers ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-8 text-center text-sm text-gray-500"
                        >
                          Loading directory...
                        </td>
                      </tr>
                    ) : users.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-8 text-center text-sm text-gray-500"
                        >
                          No users found.
                        </td>
                      </tr>
                    ) : (
                      users.map((user) => (
                        <tr key={user._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-medium">
                                {user.name?.[0]?.toUpperCase() || "?"}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {user.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {user.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={user.role}
                              onChange={(e) =>
                                handleRoleChange(user._id, e.target.value)
                              }
                              disabled={user.role === "admin"}
                              className="text-sm rounded-md border-0 py-1 pl-2 pr-6 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-teal-600 disabled:opacity-50 disabled:bg-gray-100"
                            >
                              <option value="attendee">Attendee</option>
                              <option value="organizer">Organizer</option>
                              {user.role === "admin" && (
                                <option value="admin">Admin</option>
                              )}
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {user.isActive ? (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                <CheckCircle2 className="h-3.5 w-3.5" /> Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                                <XCircle className="h-3.5 w-3.5" /> Banned
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            {user.role !== "admin" && (
                              <button
                                onClick={() =>
                                  handleToggleBan(user._id, user.isActive)
                                }
                                className={`text-${user.isActive ? "red" : "green"}-600 hover:text-${user.isActive ? "red" : "green"}-900`}
                              >
                                {user.isActive ? "Ban User" : "Unban"}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </Tabs.Content>
        </div>
      </Tabs.Root>

      {/* Modals */}
      <ReviewEventModal
        isOpen={!!selectedEvent}
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onReview={handleReviewEvent}
      />

      <ReviewOrganizerModal
        isOpen={!!selectedOrganizer}
        profile={selectedOrganizer}
        onClose={() => setSelectedOrganizer(null)}
        onReview={handleReviewOrganizer}
      />
    </div>
  );
}
