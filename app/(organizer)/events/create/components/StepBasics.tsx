"use client";

import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { EventFormValues } from "../schema";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import ImageUploadZone from "./ImageUploadZone";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import LocationMap from "./LocationMap";
import { CalendarIcon, Plus } from "lucide-react";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { organizerApi } from "@/lib/api";
import AiAutofillModal from "./AiAutofillModal";
import CreateOrganizerModal from "./CreateOrganizerModal";
import { Sparkles } from "lucide-react";

const CATEGORIES = [
  { id: "1", name: "Music & Concerts" },
  { id: "2", name: "Technology & Innovation" },
  { id: "3", name: "Arts & Culture" },
  { id: "4", name: "Business & Networking" },
  { id: "5", name: "Food & Drink" },
];

export default function StepBasics() {
  const { control, watch, setValue } = useFormContext<EventFormValues>();
  const locationType = watch("locationType");
  const organizerProfileId = watch("organizerProfileId");
  const { user } = useAuth();
  
  const [organizerProfiles, setOrganizerProfiles] = useState<any[]>([]);
  const [isOrganizerModalOpen, setIsOrganizerModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(true);

  useEffect(() => {
    const fetchProfiles = async () => {
      setIsLoadingProfiles(true);
      try {
        const res = await organizerApi.getProfiles();
        const profiles = res.data.profiles || [];
        setOrganizerProfiles(profiles);
        if (profiles.length > 0 && !organizerProfileId) {
          setValue("organizerProfileId", profiles[0]._id || profiles[0].id, { shouldValidate: true });
        }
      } catch (error) {
        console.error("Failed to fetch organizer profiles:", error);
      } finally {
        setIsLoadingProfiles(false);
      }
    };

    if (user && !organizerProfiles.length) {
      fetchProfiles();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id]);

  const handleOrganizerCreated = (newId: string) => {
    // Mock updating the list with the new organizer
    const newProfile = { id: newId, brandName: "New Organization" };
    setOrganizerProfiles(prev => [...prev, newProfile]);
    setValue("organizerProfileId", newId, { shouldValidate: true });
  };

  const handleAiFill = (data: any) => {
    if (data.title) setValue("title", data.title, { shouldValidate: true });
    if (data.category) setValue("categoryId", data.category, { shouldValidate: true });
    if (data.locationType) setValue("locationType", data.locationType, { shouldValidate: true });
    if (data.venueName) setValue("venueName", data.venueName, { shouldValidate: true });
    if (data.city) setValue("city", data.city, { shouldValidate: true });
    if (data.platform) setValue("platform", data.platform, { shouldValidate: true });
    if (data.startDate) setValue("startDate", new Date(data.startDate), { shouldValidate: true });
    if (data.startTime) setValue("startTime", data.startTime, { shouldValidate: true });
    if (data.overview) setValue("overview", data.overview, { shouldValidate: true });
  };

  return (
    <div className="space-y-12 pb-8">
      {/* AI Autofill Banner */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div>
          <h3 className="text-xl font-bold text-purple-900 flex items-center gap-2 mb-2">
            <Sparkles className="text-purple-600" size={24} /> 
            Magic Fill with Gemini AI
          </h3>
          <p className="text-purple-800/80">
            Have an event poster or a drafted message? Upload it and let our AI extract the details to auto-fill this form for you instantly.
          </p>
        </div>
        <Button 
          type="button"
          onClick={() => setIsAiModalOpen(true)}
          className="shrink-0 bg-purple-600 hover:bg-purple-700 text-white rounded-xl h-12 px-6 shadow-lg shadow-purple-200"
        >
          <Sparkles className="mr-2 h-5 w-5" /> Auto-fill Details
        </Button>
      </div>

      {/* 1. Event Details */}
      <section>
        <h2 className="text-2xl font-semibold text-[#001F29] mb-6">1. Event Details</h2>
        <div className="space-y-6 max-w-3xl">
          <FormField
            control={control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#001F29] font-semibold">Event Title *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter the name of your event" {...field} value={field.value || ""} className="h-12 border-gray-300 rounded-xl focus-visible:ring-[#006782]" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#001F29] font-semibold">Event Category *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-12 border-gray-300 rounded-xl focus:ring-[#006782]">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-white">
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat.id} value={cat.name}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </section>

      {/* 2. Event Banner */}
      <section>
        <h2 className="text-2xl font-semibold text-[#001F29] mb-6">2. Event Banner</h2>
        <div className="max-w-3xl">
          <ImageUploadZone />
        </div>
      </section>

      {/* 3. Location */}
      <section>
        <h2 className="text-2xl font-semibold text-[#001F29] mb-6">3. Location</h2>
        
        <FormField
          control={control}
          name="locationType"
          render={({ field }) => (
            <FormItem className="space-y-3 mb-6">
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="VENUE" className="text-[#006782]" />
                    </FormControl>
                    <FormLabel className="font-medium">Venue (Physical Location)</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="ONLINE" className="text-[#006782]" />
                    </FormControl>
                    <FormLabel className="font-medium">Online Event</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col lg:flex-row gap-8 max-w-5xl">
          {locationType === "VENUE" ? (
            <>
              <div className="flex-1 space-y-6">
                <FormField
                  control={control}
                  name="venueName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#001F29] font-semibold">Venue Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Expo Center" {...field} value={field.value || ""} className="h-12 border-gray-300 rounded-xl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#001F29] font-semibold">City</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Lahore" {...field} value={field.value || ""} className="h-12 border-gray-300 rounded-xl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#001F29] font-semibold">Address Line 1</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 123 Main St" {...field} value={field.value || ""} className="h-12 border-gray-300 rounded-xl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex-1">
                <FormLabel className="text-[#001F29] font-semibold block mb-3">Map Preview</FormLabel>
                <LocationMap />
              </div>
            </>
          ) : (
            <div className="flex-1 space-y-6 max-w-3xl">
              <FormField
                control={control}
                name="platform"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#001F29] font-semibold">Platform / Software</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Zoom, Google Meet" {...field} value={field.value || ""} className="h-12 border-gray-300 rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="virtualLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#001F29] font-semibold">Virtual Link (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://" {...field} value={field.value || ""} className="h-12 border-gray-300 rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>
      </section>

      {/* 4. Date and Time */}
      <section>
        <h2 className="text-2xl font-semibold text-[#001F29] mb-6">4. Date and Time</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
          <FormField
            control={control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-[#001F29] font-semibold">Start Date *</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full h-12 pl-3 text-left font-normal border-gray-300 rounded-xl",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#001F29] font-semibold">Start Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} value={field.value || ""} className="h-12 border-gray-300 rounded-xl" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-[#001F29] font-semibold">End Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full h-12 pl-3 text-left font-normal border-gray-300 rounded-xl",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#001F29] font-semibold">End Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} value={field.value || ""} className="h-12 border-gray-300 rounded-xl" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </section>

      {/* 5. Event Overview & Organizer Page */}
      <section>
        <h2 className="text-2xl font-semibold text-[#001F29] mb-6">5. Event Overview</h2>
        <div className="max-w-3xl space-y-12">
          <FormField
            control={control}
            name="overview"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#001F29] font-semibold">Description</FormLabel>
                <FormControl>
                  <RichTextEditor 
                    content={field.value || ""} 
                    onChange={field.onChange} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="pt-8 border-t border-gray-100">
            <h3 className="text-lg font-semibold text-[#001F29] mb-4">Organizer Page</h3>
            <FormField
              control={control}
              name="organizerProfileId"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value} disabled={isLoadingProfiles}>
                      <SelectTrigger className="w-[350px] h-12 border-gray-300 rounded-xl focus:ring-[#006782]">
                        <SelectValue placeholder={isLoadingProfiles ? "Loading organizers..." : "Select an organizer page"} />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {organizerProfiles.map((profile) => (
                          <SelectItem key={profile._id || profile.id} value={profile._id || profile.id}>
                            <div className="flex items-center gap-3">
                              <div className="w-6 h-6 rounded bg-[#006782] text-white flex items-center justify-center text-xs font-bold">
                                {profile.brandName?.charAt(0) || "O"}
                              </div>
                              <span>{profile.brandName}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <button 
                    type="button" 
                    onClick={() => setIsOrganizerModalOpen(true)}
                    className="text-[#006782] text-sm font-medium hover:underline flex items-center gap-1 self-start mt-2"
                  >
                    <Plus className="w-4 h-4" /> Create new organizer page
                  </button>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </section>

      <CreateOrganizerModal 
        isOpen={isOrganizerModalOpen} 
        onClose={() => setIsOrganizerModalOpen(false)} 
        onSuccess={handleOrganizerCreated}
      />

      <AiAutofillModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onFill={handleAiFill}
      />
    </div>
  );
}
