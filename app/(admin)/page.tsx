"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/adminApi";
import type {
  SnapshotStats,
  AdminEvent,
  AdminClaim,
  ActiveReport,
} from "@/types/admin";
import {
  Users,
  Building2,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  Clock,
  ShieldAlert,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AdminOverview() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<SnapshotStats | null>(null);
  const [pendingEvents, setPendingEvents] = useState<AdminEvent[]>([]);
  const [pendingClaims, setPendingClaims] = useState<AdminClaim[]>([]);
  const [activeReports, setActiveReports] = useState<ActiveReport[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await adminApi.getSnapshot();
        if (data.success) {
          setStats(data.stats);
          setPendingEvents(data.pendingEvents);
          setPendingClaims(data.pendingClaims);
          setActiveReports(data.activeReports);
        }
      } catch (error) {
        console.error("Failed to load snapshot:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-500 border-t-transparent"></div>
      </div>
    );
  }

  const statCards = [
    {
      name: "New Attendees",
      value: stats.newAttendeesToday.toLocaleString(),
      change: `${stats.newAttendeesGrowth > 0 ? "+" : ""}${stats.newAttendeesGrowth.toFixed(1)}%`,
      trend: stats.newAttendeesGrowth >= 0 ? "up" : "down",
      icon: Users,
    },
    {
      name: "New Organizers",
      value: stats.newOrganizersToday.toLocaleString(),
      change: `${stats.newOrganizersGrowth > 0 ? "+" : ""}${stats.newOrganizersGrowth.toFixed(1)}%`,
      trend: stats.newOrganizersGrowth >= 0 ? "up" : "down",
      icon: Building2,
    },
    {
      name: "New Events Created",
      value: stats.newEventsToday.toLocaleString(),
      change: `${stats.newEventsGrowth > 0 ? "+" : ""}${stats.newEventsGrowth.toFixed(1)}%`,
      trend: stats.newEventsGrowth >= 0 ? "up" : "down",
      icon: Calendar,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:tracking-tight">
          Morning Snapshot
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Your daily overview of platform activity and pending action items.
        </p>
      </div>

      {/* Stats Grid */}
      <dl className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {statCards.map((item) => (
          <div
            key={item.name}
            className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6 border border-gray-100"
          >
            <dt>
              <div className="absolute rounded-md bg-teal-500 p-3">
                <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">
                {item.name}
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">
                {item.value}
              </p>
              <p
                className={`ml-2 flex items-baseline text-sm font-semibold ${
                  item.trend === "up" ? "text-green-600" : "text-red-600"
                }`}
              >
                {item.trend === "up" ? (
                  <ArrowUpRight
                    className="h-4 w-4 flex-shrink-0 self-center text-green-500"
                    aria-hidden="true"
                  />
                ) : (
                  <ArrowDownRight
                    className="h-4 w-4 flex-shrink-0 self-center text-red-500"
                    aria-hidden="true"
                  />
                )}
                <span className="sr-only">
                  {" "}
                  {item.trend === "up" ? "Increased" : "Decreased"} by{" "}
                </span>
                {item.change}
              </p>
              <div className="absolute inset-x-0 bottom-0 bg-gray-50 px-4 py-4 sm:px-6 border-t border-gray-100">
                <div className="text-sm">
                  <Link
                    href="/admin/analytics"
                    className="font-medium text-teal-600 hover:text-teal-500"
                  >
                    View full analytics
                    <span className="sr-only"> {item.name} stats</span>
                  </Link>
                </div>
              </div>
            </dd>
          </div>
        ))}
      </dl>

      {/* Action Items Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Pending Event Approvals */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col">
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 flex items-center gap-3">
            <Clock className="h-5 w-5 text-amber-500" />
            <h3 className="font-semibold text-gray-900 flex-1">
              Pending Event Approvals
            </h3>
            {pendingEvents.length > 0 && (
              <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                {pendingEvents.length} action
                {pendingEvents.length !== 1 ? "s" : ""} needed
              </span>
            )}
          </div>
          <div className="flex-1 divide-y divide-gray-100 p-0">
            {pendingEvents.length === 0 ? (
              <div className="p-6 text-center text-sm text-gray-500">
                No events waiting for approval.
              </div>
            ) : (
              pendingEvents.map((event) => (
                <div
                  key={event._id}
                  className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                      {event.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {event.organizerProfileId?.brandName}
                    </p>
                  </div>
                  <Link
                    href="/admin/moderation"
                    className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    Review
                  </Link>
                </div>
              ))
            )}
          </div>
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
            <Link
              href="/admin/moderation"
              className="text-sm font-medium text-teal-600 hover:text-teal-500 flex items-center justify-end"
            >
              View all <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>

        {/* Brand Ownership Claims */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col">
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 flex items-center gap-3">
            <ShieldAlert className="h-5 w-5 text-indigo-500" />
            <h3 className="font-semibold text-gray-900 flex-1">
              Organizer Claims
            </h3>
            {pendingClaims.length > 0 && (
              <span className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800">
                {pendingClaims.length} pending
              </span>
            )}
          </div>
          <div className="flex-1 divide-y divide-gray-100 p-0">
            {pendingClaims.length === 0 ? (
              <div className="p-6 text-center text-sm text-gray-500">
                No pending organizer claims.
              </div>
            ) : (
              pendingClaims.map((claim) => (
                <div
                  key={claim._id}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-sm font-medium text-gray-900 truncate max-w-[180px]">
                      {claim.eventId?.title || "Unknown Event"}
                    </p>
                    <span className="inline-flex items-center rounded-md bg-blue-50 px-1.5 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                      Dispute
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Claimant: {claim.requesterId?.email}
                  </p>
                </div>
              ))
            )}
          </div>
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
            <Link
              href="/admin/spam-reports"
              className="text-sm font-medium text-teal-600 hover:text-teal-500 flex items-center justify-end"
            >
              Resolve claims <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>

        {/* Active Flagged Events */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col">
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <h3 className="font-semibold text-gray-900 flex-1">
              Active Flagged Reports
            </h3>
            {activeReports.length > 0 && (
              <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                {activeReports.length} flagged
              </span>
            )}
          </div>
          <div className="flex-1 divide-y divide-gray-100 p-0">
            {activeReports.length === 0 ? (
              <div className="p-6 text-center text-sm text-gray-500">
                No heavily reported events right now.
              </div>
            ) : (
              activeReports.map((report) => (
                <div
                  key={report._id}
                  className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between"
                >
                  <div className="flex-1 min-w-0 pr-4">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {report.eventTitle}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {report.reportCount} individual reports
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                      report.badgeType === "CRITICAL"
                        ? "bg-red-50 text-red-700 ring-red-600/20"
                        : "bg-amber-50 text-amber-700 ring-amber-600/20"
                    }`}
                  >
                    {report.badgeType}
                  </span>
                </div>
              ))
            )}
          </div>
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
            <Link
              href="/admin/spam-reports"
              className="text-sm font-medium text-teal-600 hover:text-teal-500 flex items-center justify-end"
            >
              Investigate <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
