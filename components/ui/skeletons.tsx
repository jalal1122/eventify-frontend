import React from "react";

export function EventCardSkeleton() {
  return (
    <div className="w-full bg-white rounded-3xl border border-[#F3F4F6] shadow-sm overflow-hidden flex flex-col group animate-pulse">
      <div className="w-full h-48 md:h-[220px] bg-gray-200 shrink-0" />
      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-center mb-3">
          <div className="h-4 w-24 bg-gray-200 rounded-md" />
          <div className="h-6 w-12 bg-gray-200 rounded-md" />
        </div>
        <div className="h-6 w-3/4 bg-gray-200 rounded-md mb-2" />
        <div className="h-6 w-1/2 bg-gray-200 rounded-md mb-4" />
        <div className="space-y-2 mb-6 mt-auto">
          <div className="h-4 w-full bg-gray-200 rounded-md" />
          <div className="h-4 w-2/3 bg-gray-200 rounded-md" />
        </div>
        <div className="h-[1px] w-full bg-[#F3F4F6] mb-4" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gray-200" />
            <div className="h-4 w-20 bg-gray-200 rounded-md" />
          </div>
          <div className="h-8 w-8 rounded-full bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

export function EventBannerCardSkeleton() {
  return (
    <div className="w-full bg-white rounded-3xl border border-[#F3F4F6] shadow-sm overflow-hidden flex flex-col group animate-pulse">
      <div className="w-full h-48 md:h-[300px] bg-gray-200 shrink-0" />
      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-center mb-4">
          <div className="h-4 w-32 bg-gray-200 rounded-md" />
          <div className="h-6 w-12 bg-gray-200 rounded-md" />
        </div>
        <div className="h-8 w-3/4 bg-gray-200 rounded-md mb-2" />
        <div className="h-4 w-full bg-gray-200 rounded-md mb-2" />
        <div className="h-4 w-5/6 bg-gray-200 rounded-md mb-6" />
        <div className="space-y-3 mb-6 mt-auto">
          <div className="h-4 w-1/3 bg-gray-200 rounded-md" />
          <div className="h-4 w-1/2 bg-gray-200 rounded-md" />
        </div>
        <div className="h-[1px] w-full bg-[#F3F4F6] mb-6" />
        <div className="flex items-center gap-3">
          <div className="flex-1 md:flex-none md:w-[160px] h-12 bg-gray-200 rounded-xl" />
          <div className="flex-1 h-12 bg-gray-200 rounded-xl" />
          <div className="w-12 h-12 shrink-0 bg-gray-200 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function CategoryCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl p-8 flex flex-col items-center text-center shadow-sm border border-[#F3F4F6] animate-pulse">
      <div className="w-14 h-14 rounded-full bg-gray-200 mb-6" />
      <div className="h-5 w-24 bg-gray-200 rounded-md mb-2" />
      <div className="h-4 w-16 bg-gray-200 rounded-md" />
    </div>
  );
}

export function OrganizerCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col items-center text-center animate-pulse">
      <div className="w-20 h-20 rounded-full bg-gray-200 mb-4" />
      <div className="h-5 w-32 bg-gray-200 rounded-md mb-2" />
      <div className="h-4 w-24 bg-gray-200 rounded-md mb-4" />
      <div className="h-4 w-16 bg-gray-200 rounded-md mb-6" />
      <div className="w-full h-10 bg-gray-200 rounded-xl" />
    </div>
  );
}

export function TicketCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col md:flex-row p-3 gap-6 animate-pulse">
      <div className="w-full md:w-[240px] h-[200px] shrink-0 rounded-2xl bg-gray-200" />
      <div className="flex-1 py-2 flex flex-col justify-center">
        <div className="h-6 w-32 bg-gray-200 rounded-full mb-4" />
        <div className="h-6 w-3/4 bg-gray-200 rounded-md mb-2" />
        <div className="h-4 w-1/4 bg-gray-200 rounded-md mb-6" />
        <div className="grid grid-cols-2 gap-4 mt-auto">
          <div>
            <div className="h-3 w-16 bg-gray-200 rounded-md mb-1" />
            <div className="h-4 w-24 bg-gray-200 rounded-md" />
          </div>
          <div>
            <div className="h-3 w-16 bg-gray-200 rounded-md mb-1" />
            <div className="h-4 w-24 bg-gray-200 rounded-md" />
          </div>
        </div>
      </div>
      <div className="w-full md:w-[200px] shrink-0 flex items-center justify-center p-4 md:border-l border-gray-100 mt-4 md:mt-0">
        <div className="w-full h-12 bg-gray-200 rounded-xl" />
      </div>
    </div>
  );
}
