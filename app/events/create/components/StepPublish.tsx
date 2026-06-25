"use client";

import { useFormContext } from "react-hook-form";
import { EventFormValues } from "../schema";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar, MapPin, Ticket, ExternalLink, Users, AlertCircle, Edit2, Globe, Lock } from "lucide-react";
import { format } from "date-fns";

export default function StepPublish() {
  const { control, watch } = useFormContext<EventFormValues>();
  
  const formValues = watch();
  const {
    title,
    coverImage,
    startDate,
    locationType,
    venueName,
    city,
    platform,
    registrationMethod,
    customQuestions,
    tickets,
    externalUrl
  } = formValues;

  const displayDate = startDate ? format(startDate, "EEEE, MMMM d, yyyy") : "Date TBD";
  const displayLocation = locationType === "VENUE" 
    ? `${venueName || "Venue TBD"}${city ? `, ${city}` : ""}`
    : `${platform || "Online Event"}`;

  return (
    <div className="space-y-10 max-w-4xl">
      <section>
        <h2 className="text-2xl font-semibold text-[#001F29] mb-1">Review & Publish</h2>
        <p className="text-gray-500 mb-8">Review your event details before making it live.</p>

        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          {/* Section 1: Basic Details */}
          <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-48 h-32 bg-slate-100 rounded-xl overflow-hidden shrink-0 border border-slate-200">
              {coverImage ? (
                <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No Image</div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold text-[#001F29] mb-3">{title || "Untitled Event"}</h3>
                <button className="text-gray-400 hover:text-[#006782]"><Edit2 className="w-4 h-4" /></button>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center"><Calendar className="w-4 h-4 mr-2 text-gray-400" /> {displayDate}</div>
                <div className="flex items-center"><MapPin className="w-4 h-4 mr-2 text-gray-400" /> {displayLocation}</div>
              </div>
            </div>
          </div>

          {/* Conditional Sections based on Registration Method */}
          {registrationMethod === "INTERNAL" ? (
            <>
              {/* Section 2: Registration */}
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#006782]/10 flex items-center justify-center text-[#006782]">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#001F29]">Eventify Form attached</h4>
                    <p className="text-sm text-gray-500">Standard info + {customQuestions?.length || 0} custom questions</p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-[#006782]"><Edit2 className="w-4 h-4" /></button>
              </div>

              {/* Section 3: Tickets */}
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                    <Ticket className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#001F29]">{tickets?.length || 0} Ticket Types Created</h4>
                    <p className="text-sm text-gray-500">
                      {tickets && tickets.length > 0 
                        ? tickets.map(t => t.name).join(", ") 
                        : "No tickets added"}
                    </p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-[#006782]"><Edit2 className="w-4 h-4" /></button>
              </div>
            </>
          ) : (
            /* External Link Section */
            <div className="p-6 border-b border-gray-100 bg-slate-50/50">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <ExternalLink className="w-5 h-5 text-gray-500" />
                  <h4 className="font-semibold text-[#001F29]">External Link Attached</h4>
                </div>
                <button className="text-gray-400 hover:text-[#006782]"><Edit2 className="w-4 h-4" /></button>
              </div>
              <div className="bg-white border border-gray-200 p-3 rounded-lg text-sm text-[#006782] truncate">
                {externalUrl || "No URL provided"}
              </div>
              <div className="mt-4 bg-blue-50 text-blue-800 text-sm p-3 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-blue-600" />
                <p>We recommend testing your external link in an incognito window to ensure attendees can access it without logging in to your specific account.</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Visibility Settings */}
      <section>
        <h2 className="text-2xl font-semibold text-[#001F29] mb-6">Who can see this event?</h2>
        <FormField
          control={control}
          name="visibility"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <FormItem>
                    <FormControl>
                      <RadioGroupItem value="PUBLIC" className="peer sr-only" />
                    </FormControl>
                    <FormLabel className="flex items-start gap-4 p-5 border-2 border-gray-200 rounded-xl cursor-pointer hover:bg-slate-50 peer-data-[state=checked]:border-[#006782] peer-data-[state=checked]:bg-[#F0F8FA] transition-all">
                      <div className="p-2 bg-white rounded-lg border border-gray-200 shadow-sm mt-1">
                        <Globe className="w-5 h-5 text-[#006782]" />
                      </div>
                      <div>
                        <div className="font-bold text-[#001F29] mb-1">Public</div>
                        <div className="text-sm text-gray-500 font-normal">Listed on the discovery platform. Anyone can search and view it.</div>
                      </div>
                    </FormLabel>
                  </FormItem>

                  <FormItem>
                    <FormControl>
                      <RadioGroupItem value="PRIVATE" className="peer sr-only" />
                    </FormControl>
                    <FormLabel className="flex items-start gap-4 p-5 border-2 border-gray-200 rounded-xl cursor-pointer hover:bg-slate-50 peer-data-[state=checked]:border-[#006782] peer-data-[state=checked]:bg-[#F0F8FA] transition-all">
                      <div className="p-2 bg-white rounded-lg border border-gray-200 shadow-sm mt-1">
                        <Lock className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <div className="font-bold text-[#001F29] mb-1">Private (Link Only)</div>
                        <div className="text-sm text-gray-500 font-normal">Hidden from search. Only people with the direct link can view.</div>
                      </div>
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </section>
    </div>
  );
}

