"use client";

import { useState, useEffect } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { adminApi } from "@/lib/adminApi";
import { AdminReport, FlaggedEvent, AdminClaim } from "@/types/admin";
import { ResolveReportModal } from "@/components/admin/modals/ResolveReportModal";
import { ResolveFlaggedModal } from "@/components/admin/modals/ResolveFlaggedModal";
import { ResolveClaimModal } from "@/components/admin/modals/ResolveClaimModal";

export default function SpamReportsHub() {
  const [activeTab, setActiveTab] = useState("community");

  // State for Community Reports
  const [reports, setReports] = useState<AdminReport[]>([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [selectedReport, setSelectedReport] = useState<AdminReport | null>(
    null,
  );

  // State for Flagged Events
  const [flaggedEvents, setFlaggedEvents] = useState<FlaggedEvent[]>([]);
  const [loadingFlagged, setLoadingFlagged] = useState(true);
  const [selectedFlagged, setSelectedFlagged] = useState<FlaggedEvent | null>(
    null,
  );

  // State for Claims
  const [claims, setClaims] = useState<AdminClaim[]>([]);
  const [loadingClaims, setLoadingClaims] = useState(true);
  const [selectedClaim, setSelectedClaim] = useState<AdminClaim | null>(null);

  const fetchReports = async () => {
    setLoadingReports(true);
    try {
      const res = await adminApi.getCommunityReports();
      if (res.success) setReports(res.reports);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingReports(false);
    }
  };

  const fetchFlagged = async () => {
    setLoadingFlagged(true);
    try {
      const res = await adminApi.getFlaggedEvents();
      if (res.success) setFlaggedEvents(res.flaggedEvents);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingFlagged(false);
    }
  };

  const fetchClaims = async () => {
    setLoadingClaims(true);
    try {
      const res = await adminApi.getClaimsDisputes();
      if (res.success) setClaims(res.claims);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingClaims(false);
    }
  };

  useEffect(() => {
    if (activeTab === "community") fetchReports();
    if (activeTab === "flagged") fetchFlagged();
    if (activeTab === "claims") fetchClaims();
  }, [activeTab]);

  const handleResolveReport = async (
    reportId: string,
    action: "dismiss" | "warn" | "takedown" | "freeze",
    notes?: string,
  ) => {
    await adminApi.resolveReport(reportId, action, notes);
    await fetchReports();
  };

  const handleResolveFlagged = async (
    eventId: string,
    action: "dismiss_reports" | "takedown",
  ) => {
    await adminApi.resolveFlaggedEvent(eventId, action);
    await fetchFlagged();
  };

  const handleResolveClaim = async (
    claimId: string,
    decision: "approved" | "rejected",
    explanation?: string,
  ) => {
    await adminApi.resolveClaim(claimId, decision, explanation);
    await fetchClaims();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:tracking-tight">
          Spam & Reports Hub
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Investigate community reports, flagged events, and brand ownership
          claims.
        </p>
      </div>

      <Tabs.Root
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex flex-col w-full"
      >
        <Tabs.List
          className="flex shrink-0 border-b border-gray-200"
          aria-label="Spam & Reports Tabs"
        >
          <Tabs.Trigger
            value="community"
            className="px-5 h-[45px] flex items-center justify-center text-sm leading-none text-gray-500 select-none hover:text-gray-700 data-[state=active]:text-teal-600 data-[state=active]:shadow-[inset_0_-2px_0_0,0_1px_0_0] data-[state=active]:shadow-current outline-none cursor-pointer font-medium"
          >
            Community Reports
          </Tabs.Trigger>
          <Tabs.Trigger
            value="flagged"
            className="px-5 h-[45px] flex items-center justify-center text-sm leading-none text-gray-500 select-none hover:text-gray-700 data-[state=active]:text-teal-600 data-[state=active]:shadow-[inset_0_-2px_0_0,0_1px_0_0] data-[state=active]:shadow-current outline-none cursor-pointer font-medium"
          >
            Automated Flagged Events
          </Tabs.Trigger>
          <Tabs.Trigger
            value="claims"
            className="px-5 h-[45px] flex items-center justify-center text-sm leading-none text-gray-500 select-none hover:text-gray-700 data-[state=active]:text-teal-600 data-[state=active]:shadow-[inset_0_-2px_0_0,0_1px_0_0] data-[state=active]:shadow-current outline-none cursor-pointer font-medium"
          >
            Organizer Claims
          </Tabs.Trigger>
        </Tabs.List>

        <div className="mt-6">
          {/* TAB: COMMUNITY REPORTS */}
          <Tabs.Content value="community" className="outline-none">
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">
                  User Generated Reports
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Event
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reporter
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reason Preview
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loadingReports ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-8 text-center text-sm text-gray-500"
                        >
                          Loading reports...
                        </td>
                      </tr>
                    ) : reports.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-8 text-center text-sm text-gray-500"
                        >
                          No active reports.
                        </td>
                      </tr>
                    ) : (
                      reports.map((report) => (
                        <tr key={report._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {report.eventId?.title || "Unknown"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {report.reporterId?.email || "Unknown"}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-xs">
                            {report.reason}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                            {report.status.replace("_", " ")}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => setSelectedReport(report)}
                              className="text-teal-600 hover:text-teal-900"
                            >
                              Investigate
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </Tabs.Content>

          {/* TAB: FLAGGED EVENTS */}
          <Tabs.Content value="flagged" className="outline-none">
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">
                  System Flagged Events
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Event
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Report Count
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Severity
                      </th>
                      <th className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loadingFlagged ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-8 text-center text-sm text-gray-500"
                        >
                          Loading flagged events...
                        </td>
                      </tr>
                    ) : flaggedEvents.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-8 text-center text-sm text-gray-500"
                        >
                          No flagged events.
                        </td>
                      </tr>
                    ) : (
                      flaggedEvents.map((flag) => (
                        <tr key={flag.eventId} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {flag.event?.title || "Unknown"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                            {flag.event?.status}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {flag.reportCount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                                flag.severity === "CRITICAL"
                                  ? "bg-red-50 text-red-700 ring-red-600/20"
                                  : "bg-amber-50 text-amber-700 ring-amber-600/20"
                              }`}
                            >
                              {flag.severity}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => setSelectedFlagged(flag)}
                              className="text-teal-600 hover:text-teal-900"
                            >
                              Review
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </Tabs.Content>

          {/* TAB: ORGANIZER CLAIMS */}
          <Tabs.Content value="claims" className="outline-none">
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">
                  Brand Ownership Disputes
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Event Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Claimant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loadingClaims ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-8 text-center text-sm text-gray-500"
                        >
                          Loading claims...
                        </td>
                      </tr>
                    ) : claims.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-8 text-center text-sm text-gray-500"
                        >
                          No active claims.
                        </td>
                      </tr>
                    ) : (
                      claims.map((claim) => (
                        <tr key={claim._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {claim.eventId?.title || "Unknown"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {claim.requesterId?.email || "Unknown"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(claim.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                            {claim.status}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => setSelectedClaim(claim)}
                              className="text-teal-600 hover:text-teal-900"
                            >
                              Process
                            </button>
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
      <ResolveReportModal
        isOpen={!!selectedReport}
        report={selectedReport}
        onClose={() => setSelectedReport(null)}
        onResolve={handleResolveReport}
      />

      <ResolveFlaggedModal
        isOpen={!!selectedFlagged}
        flaggedEvent={selectedFlagged}
        onClose={() => setSelectedFlagged(null)}
        onResolve={handleResolveFlagged}
      />

      <ResolveClaimModal
        isOpen={!!selectedClaim}
        claim={selectedClaim}
        onClose={() => setSelectedClaim(null)}
        onResolve={handleResolveClaim}
      />
    </div>
  );
}
